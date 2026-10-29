import { WATER_OUTLINE, WATER_EXCLUSIONS } from './water-mask.js';

const MASK_WIDTH = 768;
const MASK_HEIGHT = 512;
const MAX_RIPPLES = 8;
const MAX_PIXELS = 1500000;
const TAU = Math.PI * 2;

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying highp vec2 v_screen;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    // CSS and source-image coordinates both start at the top left.
    v_screen = vec2(a_position.x * 0.5 + 0.5, 0.5 - a_position.y * 0.5);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying highp vec2 v_screen;
  uniform sampler2D u_photo;
  uniform sampler2D u_mask;
  uniform vec2 u_view;
  uniform vec4 u_placement;
  uniform vec4 u_phase;
  uniform vec4 u_ripples[8];
  uniform int u_rippleCount;

  vec2 limitVector(vec2 value, float maximum) {
    return value * min(1.0, maximum / max(length(value), 0.0001));
  }

  void main() {
    vec2 screen = v_screen * u_view;
    vec2 uv = (screen - u_placement.xy) / u_placement.zw;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    float wet = texture2D(u_mask, uv).r;
    if (wet < 0.001) {
      // Original DOM photograph remains literally untouched on land, sky and
      // stone. No second crop or color treatment is composited over them.
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 p = uv * vec2(19.0, 22.0);
    float a = p.x * 1.26 + p.y * 3.4 + sin(p.y * 0.8 + u_phase.w) * 0.45 - u_phase.x;
    float b = p.x * 0.73 - p.y * 4.7 + sin(p.x * 0.65 - u_phase.w) * 0.5 + u_phase.y;
    float c = p.x * 2.65 + p.y * 1.65 - u_phase.z;
    vec2 normal = vec2(
      cos(a) * 0.65 + cos(b) * 0.35 + cos(c) * 0.16,
      sin(a) * 0.45 - sin(b) * 0.36 + cos(c) * 0.12
    );
    float foreground = mix(0.55, 1.0, smoothstep(0.3, 0.94, uv.y));
    vec2 current = limitVector(normal * 5.2 * foreground, 5.5);
    vec2 wake = vec2(0.0);
    float wakeLight = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= u_rippleCount) break;
      vec4 ripple = u_ripples[i];
      float age = ripple.z;
      vec2 delta = (screen - ripple.xy) * vec2(1.0, 2.8);
      float distance = length(delta);
      float radius = age * 96.0;
      float width = 30.0 + age * 12.0;
      float band = (distance - radius) / width;
      float envelope = exp(-band * band) * exp(-age * 0.65) * smoothstep(0.0, 0.12, age);
      vec2 direction = delta / max(distance, 1.0);
      float slope = cos((distance - radius) * 0.085);
      wake += direction * vec2(1.0, 0.36) * slope * envelope * ripple.w * 10.0;
      // Light catches the moving surface, softened by the same wave envelope.
      wakeLight += slope * envelope * ripple.w * 0.045;
    }
    wake = limitVector(wake, 10.0);
    vec2 displacement = limitVector(current + wake, 11.0) * wet;
    vec2 displacedUV = uv + displacement / u_placement.zw;
    // Refraction cannot pull a sand or stone texel across the wet boundary.
    float destinationWet = texture2D(u_mask, displacedUV).r;
    displacement *= smoothstep(0.1, 0.9, destinationWet);
    displacedUV = clamp(uv + displacement / u_placement.zw, vec2(0.0001), vec2(0.9999));
    vec3 photo = texture2D(u_photo, displacedUV).rgb;
    // Soft traveling highlights reveal the water even in the quiet distance.
    float crest = pow(max(0.0, sin(a) * 0.65 + sin(b) * 0.35), 4.0);
    float light = (normal.y * 0.028 + sin(a + b * 0.2) * 0.012 + crest * 0.05) * foreground;
    light = clamp(light + wakeLight, -0.085, 0.12) * wet;
    vec3 reflected = photo * (1.0 + light) + vec3(0.82, 0.88, 0.78) * max(0.0, light) * 0.18;
    gl_FragColor = vec4(clamp(reflected, 0.0, 1.0), wet);
  }
`;

function maskCanvas() {
  const original = document.createElement('canvas');
  original.width = MASK_WIDTH;
  original.height = MASK_HEIGHT;
  const context = original.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Water mask unavailable');
  context.fillStyle = '#000';
  context.fillRect(0, 0, MASK_WIDTH, MASK_HEIGHT);
  context.fillStyle = '#fff';
  context.beginPath();
  WATER_OUTLINE.forEach(([x, y], index) => {
    if (index) context.lineTo(x * MASK_WIDTH, y * MASK_HEIGHT);
    else context.moveTo(x * MASK_WIDTH, y * MASK_HEIGHT);
  });
  context.closePath();
  context.fill();
  context.fillStyle = '#000';
  for (const hole of WATER_EXCLUSIONS) {
    context.beginPath();
    context.ellipse(hole.x * MASK_WIDTH, hole.y * MASK_HEIGHT, hole.rx * MASK_WIDTH, hole.ry * MASK_HEIGHT, 0, 0, TAU);
    context.fill();
  }
  const softened = document.createElement('canvas');
  softened.width = MASK_WIDTH;
  softened.height = MASK_HEIGHT;
  const softContext = softened.getContext('2d', { willReadFrequently: true });
  if (!softContext) throw new Error('Water feather unavailable');
  softContext.fillStyle = '#000';
  softContext.fillRect(0, 0, MASK_WIDTH, MASK_HEIGHT);
  softContext.filter = 'blur(12px)';
  softContext.drawImage(original, 0, 0);
  softContext.filter = 'none';
  const originalPixels = context.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT);
  const softPixels = softContext.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT);
  for (let i = 0; i < softPixels.data.length; i += 4) {
    const edge = Math.max(0, Math.min(1, (softPixels.data[i] / 255 - 0.6) / 0.4));
    const coverage = Math.round(originalPixels.data[i] * edge * edge * (3 - 2 * edge));
    softPixels.data[i] = coverage;
    softPixels.data[i + 1] = coverage;
    softPixels.data[i + 2] = coverage;
    softPixels.data[i + 3] = 255;
  }
  softContext.putImageData(softPixels, 0, 0);
  return softened;
}

/** One transparent quad, aligned with the original object-fit photograph. */
export default class WaterRenderer {
  constructor(canvas, image) {
    this.canvas = canvas;
    this.image = image;
    this.gl = null;
    this._ready = false;
    this._destroyed = false;
    this._geometry = null;
    this._program = null;
    this._shaders = [];
    this._buffer = null;
    this._textures = [];
    this._uniforms = null;
    this._rippleValues = new Float32Array(MAX_RIPPLES * 4);
    this._initialVisibility = canvas.style.visibility;
    this._onLoad = () => this._initialize();
    this._onImageError = () => this._fallback('image');
    this._onContextLost = event => {
      event.preventDefault();
      this._ready = false;
      this.canvas.dataset.waterRenderer = 'static';
      this.canvas.style.visibility = 'hidden';
    };
    this._onContextRestored = () => {
      this._program = null;
      this._shaders = [];
      this._buffer = null;
      this._textures = [];
      this._initialize();
    };
    canvas.dataset.waterRenderer = 'static';
    canvas.addEventListener('webglcontextlost', this._onContextLost, false);
    canvas.addEventListener('webglcontextrestored', this._onContextRestored, false);
    image.addEventListener('load', this._onLoad);
    image.addEventListener('error', this._onImageError);
    if (image.complete && image.naturalWidth > 0) this._initialize();
  }

  get ready() { return this._ready && !this._destroyed; }

  resize({ width, height, placement }) {
    if (this._destroyed || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
    if (!placement || ![placement.scale, placement.x, placement.y, placement.imageWidth, placement.imageHeight].every(Number.isFinite)) return;
    const drawWidth = placement.imageWidth * placement.scale;
    const drawHeight = placement.imageHeight * placement.scale;
    if (drawWidth <= 0 || drawHeight <= 0) return;
    this._geometry = { width, height, x: placement.x, y: placement.y, drawWidth, drawHeight };
    const pixelRatio = Math.min(globalThis.devicePixelRatio || 1, 1.35, Math.sqrt(MAX_PIXELS / (width * height)));
    const bufferWidth = Math.max(1, Math.floor(width * pixelRatio));
    const bufferHeight = Math.max(1, Math.floor(height * pixelRatio));
    if (this.canvas.width !== bufferWidth || this.canvas.height !== bufferHeight) {
      this.canvas.width = bufferWidth;
      this.canvas.height = bufferHeight;
    }
    if (this.gl && this._ready) this.gl.viewport(0, 0, bufferWidth, bufferHeight);
  }

  render(nowMs, ripples = []) {
    if (!this.ready || !this._geometry || !Number.isFinite(nowMs)) return false;
    const gl = this.gl;
    const { width, height, x, y, drawWidth, drawHeight } = this._geometry;
    gl.useProgram(this._program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    gl.enableVertexAttribArray(this._position);
    gl.vertexAttribPointer(this._position, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._textures[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._textures[1]);
    gl.uniform2f(this._uniforms.view, width, height);
    gl.uniform4f(this._uniforms.placement, x, y, drawWidth, drawHeight);
    const seconds = nowMs / 1000;
    // Individual periodic phases stay precise even after hours on the page.
    gl.uniform4f(this._uniforms.phase, seconds * 0.82 % TAU, seconds * 0.57 % TAU, seconds * 0.39 % TAU, seconds * 0.25 % TAU);
    this._rippleValues.fill(0);
    let count = 0;
    for (let i = ripples.length - 1; i >= 0 && count < MAX_RIPPLES; i--) {
      const ripple = ripples[i];
      const age = (nowMs - ripple.born) / 1000;
      if (![ripple.x, ripple.y, age].every(Number.isFinite) || age < 0 || age > 4.8) continue;
      const offset = count * 4;
      this._rippleValues[offset] = ripple.x;
      this._rippleValues[offset + 1] = ripple.y;
      this._rippleValues[offset + 2] = age;
      this._rippleValues[offset + 3] = ripple.ambient ? 0.18 : 1;
      count++;
    }
    gl.uniform1i(this._uniforms.rippleCount, count);
    gl.uniform4fv(this._uniforms.ripples, this._rippleValues);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return true;
  }

  clear() {
    if (!this.gl || this._destroyed || this.gl.isContextLost()) return;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  destroy() {
    if (this._destroyed) return;
    this.clear();
    this._release();
    this._ready = false;
    this._destroyed = true;
    this.canvas.dataset.waterRenderer = 'static';
    this.canvas.style.visibility = this._initialVisibility;
    this.canvas.removeEventListener('webglcontextlost', this._onContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this._onContextRestored);
    this.image.removeEventListener('load', this._onLoad);
    this.image.removeEventListener('error', this._onImageError);
  }

  _initialize() {
    if (this._destroyed || this._ready || !this.image.complete || !this.image.naturalWidth) return;
    try {
      this.gl ||= this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
      const gl = this.gl;
      if (!gl || gl.isContextLost()) throw new Error('WebGL unavailable');
      this._release();
      const vertex = this._shader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = this._shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!program) throw new Error('Program unavailable');
      this._program = program;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      this._shaders = [];
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
      gl.useProgram(program);
      this._buffer = gl.createBuffer();
      if (!this._buffer) throw new Error('Buffer unavailable');
      gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      this._position = gl.getAttribLocation(program, 'a_position');
      this._uniforms = {
        view: gl.getUniformLocation(program, 'u_view'),
        placement: gl.getUniformLocation(program, 'u_placement'),
        phase: gl.getUniformLocation(program, 'u_phase'),
        ripples: gl.getUniformLocation(program, 'u_ripples[0]'),
        rippleCount: gl.getUniformLocation(program, 'u_rippleCount')
      };
      // With flip disabled, uploaded DOM row zero is sampled at texture v=0.
      // The photo, mask and CSS top-left coordinates use this same convention.
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      this._upload(this.image, 0);
      this._upload(maskCanvas(), 1);
      gl.uniform1i(gl.getUniformLocation(program, 'u_photo'), 0);
      gl.uniform1i(gl.getUniformLocation(program, 'u_mask'), 1);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.disable(gl.CULL_FACE);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('WebGL initialization failed');
      this._ready = true;
      this.canvas.dataset.waterRenderer = 'webgl';
      delete this.canvas.dataset.waterError;
      this.canvas.style.visibility = this._initialVisibility;
    } catch (error) {
      this._fallback(error?.message || 'renderer');
    }
  }

  _shader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Shader unavailable');
    this._shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Shader compilation failed';
      gl.deleteShader(shader);
      this._shaders = this._shaders.filter(value => value !== shader);
      throw new Error(message);
    }
    return shader;
  }

  _upload(source, unit) {
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) throw new Error('Texture unavailable');
    this._textures.push(texture);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Texture upload failed');
  }

  _release() {
    const gl = this.gl;
    if (!gl || gl.isContextLost()) return;
    if (this._program) gl.deleteProgram(this._program);
    if (this._buffer) gl.deleteBuffer(this._buffer);
    for (const shader of this._shaders) gl.deleteShader(shader);
    for (const texture of this._textures) gl.deleteTexture(texture);
    this._program = null;
    this._shaders = [];
    this._buffer = null;
    this._textures = [];
  }

  _fallback(reason) {
    this._ready = false;
    this.clear();
    this._release();
    this.canvas.dataset.waterRenderer = 'static';
    this.canvas.dataset.waterError = String(reason).slice(0, 180);
    this.canvas.style.visibility = 'hidden';
  }
}
