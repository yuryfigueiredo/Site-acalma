// Medida real dos alvos de toque: roda no Chrome headless via CDP e lista tudo abaixo de 44x44 CSS px.
// uso: node scripts/tap-targets.mjs <url> [--width 390] [--height 844]
import { setTimeout as sleep } from 'node:timers/promises';
import { spawn } from 'node:child_process';

const PORT = 9345;
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : fallback; };
const url = process.argv[2];
if (!url) { console.error('uso: node scripts/tap-targets.mjs <url> [--width 390]'); process.exit(1); }
const width = Number(arg('width', 390)), height = Number(arg('height', 844));

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--no-default-browser-check',
  '--enable-unsafe-swiftshader', '--hide-scrollbars', `--window-size=${width},${height}`, 'about:blank',
], { stdio: 'ignore' });

async function targetList() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json/list`); const l = await r.json(); const p = l.find(t => t.type === 'page'); if (p) return p; } catch { }
    await sleep(250);
  }
  throw new Error('chrome não respondeu');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
  return new Promise(resolve => ws.addEventListener('open', () => resolve({
    ws,
    send(method, params = {}) { return new Promise((res, rej) => { const n = ++id; pending.set(n, m => m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result)); ws.send(JSON.stringify({ id: n, method, params })); }); },
  })));
}

const probe = `(() => {
  const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], summary, label';
  const out = [];
  for (const el of document.querySelectorAll(sel)) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    if (el.closest('dialog:not([open])')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const min = Math.min(r.width, r.height);
    out.push({ tag: el.tagName.toLowerCase(), id: el.id || null, cls: (el.className || '').toString().slice(0, 40), label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), min: Math.round(min) });
  }
  return out;
})()`;

try {
  const target = await targetList();
  const { ws, send } = await connect(target.webSocketDebuggerUrl);
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url });
  await send('Page.frameStoppedLoading').catch(() => { });
  await sleep(1500);
  const seen = new Set();
  const openDialogs = url.includes('open=dialog');
  const result = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
  const items = result.result.value || [];
  const small = items.filter(i => i.min < 44 && !(i.tag === 'a' && !i.cls && !i.id && i.h < 30 && i.w > 60));
  for (const i of items) seen.add(`${i.tag}#${i.id}.${i.cls}`);
  console.log(`viewport ${width}px · ${items.length} alvos · ${small.length} abaixo de 44px`);
  for (const i of small) console.log(`  ${String(i.min).padStart(3)}px  ${i.tag}${i.id ? '#' + i.id : ''}${i.cls ? '.' + i.cls.split(' ')[0] : ''}  "${i.label}"  ${i.w}x${i.h}`);
  if (openDialogs) console.log('');
  ws.close();
} finally {
  chrome.kill();
}
