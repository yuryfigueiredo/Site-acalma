import assert from 'node:assert/strict';
import {imagePlacement,waterOutline,waterExclusions,isInsideWater} from '../src/assets/water-mask.js';
for(const [w,h,px,py] of [[1280,800,.5,.58],[360,720,.61,.5],[1920,950,.5,.58]]){
  const placement=imagePlacement(w,h,1536,1024,px,py);
  const polygon=waterOutline(placement);
  const holes=waterExclusions(placement);
  const point=([x,y])=>[placement.x+x*1536*placement.scale,placement.y+y*1024*placement.scale];
  assert.ok(isInsideWater(...point([.35,.5]),polygon,holes),'Open water must remain interactive');
  assert.ok(isInsideWater(...point([.4,.8]),polygon,holes),'Shallow foreground water must not disappear behind a rectangular cutoff');
  for(const p of [[.9,.7],[.62,.79],[.8,.85],[.4,.18]])assert.equal(isInsideWater(...point(p),polygon,holes),false,'Sand, rock and sky must remain outside the water mask');
}
console.log('Water mask: water, sand, rock and sky checked at desktop, mobile and wide sizes.');
