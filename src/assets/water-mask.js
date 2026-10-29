// Shoreline traced in lagoon.png's normalized source coordinates.
// Rendering feathers inward from this boundary; land is always static.
export const WATER_OUTLINE = [
  [0,.270],[1,.270],[1,.294],[.945,.301],[.903,.312],
  [.875,.326],[.886,.343],[.950,.360],[1,.371],[1,.401],
  [.965,.416],[.913,.433],[.852,.452],[.800,.475],[.760,.500],
  [.737,.525],[.735,.548],[.750,.573],[.790,.597],[.837,.613],
  [.859,.629],[.811,.650],[.756,.679],[.716,.711],[.682,.751],
  [.649,.793],[.603,.833],[.548,.878],[.477,.931],[.388,.986],[.363,1],[0,1]
];
export const WATER_EXCLUSIONS=[{x:.628,y:.794,rx:.058,ry:.043}];
export function imagePlacement(width,height,imageWidth,imageHeight,positionX=.5,positionY=.5){
  const scale=Math.max(width/imageWidth,height/imageHeight);
  return {scale,x:(width-imageWidth*scale)*positionX,y:(height-imageHeight*scale)*positionY,imageWidth,imageHeight};
}
export function waterOutline(placement){return WATER_OUTLINE.map(([x,y])=>[placement.x+x*placement.imageWidth*placement.scale,placement.y+y*placement.imageHeight*placement.scale]);}
export function waterExclusions(placement){return WATER_EXCLUSIONS.map(hole=>({x:placement.x+hole.x*placement.imageWidth*placement.scale,y:placement.y+hole.y*placement.imageHeight*placement.scale,rx:hole.rx*placement.imageWidth*placement.scale,ry:hole.ry*placement.imageHeight*placement.scale}));}
export function isInsideWater(x,y,polygon,holes=[]){
  if(holes.some(hole=>((x-hole.x)/hole.rx)**2+((y-hole.y)/hole.ry)**2<=1))return false;
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const [xi,yi]=polygon[i], [xj,yj]=polygon[j];
    if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
  }
  return inside;
}
