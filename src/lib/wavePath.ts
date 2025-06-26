export type BezierCurve = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  dx1: number;
  dy1: number;
  dx2: number;
  dy2: number;
}

export type Path = BezierCurve[];

const calcDy = (dx: number, a: number) => dx * Math.tan((a * Math.PI) / 180);
const calcAngle = (slopeMax: number) => Math.floor(Math.random() * slopeMax * 2) - slopeMax;

export const bezierPath = (
  defaultEntry: BezierCurve,
  curves = 3,
  playX = 30,
  playY = 30,
  slopeMax = 15,
  waveLength = 100,
  dxOffset = 33,
  smooth = true,
) => {
  const p: Path = [];
// How to get smooth lines? Need the slope of the line
// Really badly written article here, with some code:
// https://www.geeksforgeeks.org/javascript/how-to-draw-smooth-curve-through-multiple-points-using-javascript/
// Very good geometric explanation here:
// https://scaledinnovation.com/analytics/splines/aboutSplines.html
// Source code for running the paths as a series of points and calculating smoothness through those points
// with a constant that feeds an algorithm for identifying control points.
// view-source:https://scaledinnovation.com/analytics/splines/splines.html

  for (let i = 0; i < curves; i++) {
    const a1 = calcAngle(slopeMax);
    const a2 = calcAngle(slopeMax);
    const lastEntry = i > 0 ? p[i - 1] : defaultEntry;
    const endX = lastEntry.endX + waveLength + Math.floor(Math.random() * playX - playX / 2);
    const endY = lastEntry.endY + Math.floor(Math.random() * playY - playY / 2);
    const dx1 = lastEntry.endX + dxOffset;
    const dy1 = smooth ? lastEntry.endY + lastEntry.dy2 : lastEntry.endY + calcDy(dxOffset, a1);
    const dx2 = endX - dxOffset;
    const dy2 = endY + calcDy(dxOffset, a2);
    p.push({
      startX: lastEntry.endX,
      startY: lastEntry.endY,
      endX: endX,
      endY: endY,
      dx1: dx1,
      dy1: dy1,
      dx2: dx2,
      dy2: dy2,
    });
  }
  return p;
}

export const drawPath = (ctx: CanvasRenderingContext2D, ps: BezierCurve) => {
  ctx.beginPath();
  ctx.moveTo(ps.startX, ps.startY);
  ctx.bezierCurveTo(
    ps.dx1, 
    ps.dy1, 
    ps.dx2, 
    ps.dy2, 
    ps.endX, 
    ps.endY
  );
  ctx.stroke();
};
