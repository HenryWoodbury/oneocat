export type Grid2D = {
  x: number;
  y: number;
};

// With cp2, draw a bezier curve. Without draw a quadratic curve.
export type Curve = {
  start: Grid2D;
  end: Grid2D;
  cp1: Grid2D;
  cp2?: Grid2D;
};

export type BezierWave = Curve[] | undefined;

// Get the Control Points that ensure the path passes from knot0 through knot1 and will smoothly continue to knot2
// Three knots are passed to the function where knot0 and knot1 are the next two end points and knot2 is the next 
// end point for the next bezier curve, required to return a smooth curve through knot1. The return is a rolling
// array of control points
const getControlPoints = (
  knot0: Grid2D,
  knot1: Grid2D,
  knot2: Grid2D,
  tension: number
) => {
  //  Scaling factors: distances from this knot to the previous and following knots.
  const distanceZeroToOne = Math.sqrt(Math.pow(knot1.x - knot0.x, 2) + Math.pow(knot1.y - knot0.y, 2));
  const distanceOneToTwo = Math.sqrt(Math.pow(knot2.x - knot1.x, 2) + Math.pow(knot2.y - knot1.y, 2));

  const scalingFactorLeft = tension * distanceZeroToOne / (distanceZeroToOne + distanceOneToTwo);
  const scalingFactorRight = tension - scalingFactorLeft;

  // x distance from knot0 to knot2
  const xDiff = knot0.x - knot2.x;
  const yDiff = knot0.y - knot2.y;

  return [{
    x: knot1.x + scalingFactorLeft * xDiff,
    y: knot1.y + scalingFactorLeft * yDiff,
  },{
    x: knot1.x - scalingFactorRight * xDiff,
    y: knot1.y - scalingFactorRight * yDiff,
  }];
}

export const createBezierWave = (
  knots: Grid2D[],
  tension = 0
): BezierWave => {
  const p: BezierWave = [];
  const controlPoints: Grid2D[] = [];
  for (let i = 0; i < knots.length - 2; i++) {
    const cps = getControlPoints(knots[i], knots[i+1], knots[i+2], tension);
    controlPoints.push(...cps);
  }
  p.push({
    start: knots[0],
    end: knots[1],
    cp1: controlPoints[0],
  });
  for (let i = 1; i < knots.length - 2; i++) {
    p.push({
      start: knots[i],
      end: knots[i+1],
      cp1: controlPoints[i*2 - 1],
      cp2: controlPoints[i*2],
    });
  }
  p.push({
    start: knots[knots.length - 2],
    end: knots[knots.length - 1],
    cp1: controlPoints[controlPoints.length - 1],
  });
  return p;
};

export const drawPath = (ctx: CanvasRenderingContext2D, ps: Curve) => {
  ctx.beginPath();
  ctx.moveTo(ps.start.x, ps.start.y);
  if (ps.cp2) {
    ctx.bezierCurveTo(
      ps.cp1.x, 
      ps.cp1.y, 
      ps.cp2.x, 
      ps.cp2.y, 
      ps.end.x, 
      ps.end.y
    );
//    drawControlLine(ctx, ps.start, ps.cp1, 'rgb(204 204 0)');
//    drawControlLine(ctx, ps.end, ps.cp2, 'rgb(0 204 0)');
  } else {
    ctx.quadraticCurveTo(
      ps.cp1.x, 
      ps.cp1.y, 
      ps.end.x, 
      ps.end.y
    );
//    drawControlLine(ctx, ps.start, ps.cp1, 'rgb(204 204 0)');
  }
  ctx.stroke();
};

export const drawKnot = (ctx: CanvasRenderingContext2D, pt: Grid2D, r = 4) => { 
  ctx.save();
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, r, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.restore();
}

export const drawControlLine = (ctx: CanvasRenderingContext2D, point: Grid2D, control: Grid2D, color: string) => {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle='rgb(0 0 0 / 0.3)';
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(control.x, control.y);
  ctx.closePath();
  ctx.stroke();
  drawPoint(ctx, control, 4, color);
  ctx.restore();
}

const drawPoint = (ctx: CanvasRenderingContext2D, point: Grid2D, r:number, color: string) => {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle=color;
  ctx.arc(point.x, point.y, r, 0.0, 2*Math.PI, false);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}
