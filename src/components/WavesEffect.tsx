import { useCallback, useState } from 'react';

import { Canvas } from './Canvas';
import { createBezierWave, drawPath, type BezierWave, type Grid2D } from '../lib/wavePath';
import { getPreferredScheme } from '../lib/colors';
import css from '../styles/draw.module.css';

const definePath = (canvasContext: CanvasRenderingContext2D | null, offsetY = 60) => {
  if (!canvasContext) return;
  const playX = 60;
  const playY = 90;
  const tension = 0.5;
  const maxCurves = 9;
  const minWavelength = 180;
  const curves = Math.min(Math.ceil(canvasContext.canvas.width / minWavelength), maxCurves);
  const waveLength = Math.ceil(canvasContext.canvas.width / (curves - 1));
  const startX = Math.ceil(Math.random() * playX - waveLength);
  const startY = Math.ceil(Math.random() * playY + offsetY);
  
  const knots: Grid2D[] = [{
    x: startX,
    y: startY
  }]; 

  for (let i = 1; i < curves + 2; i++) {
    const knotX = knots[i-1].x + waveLength + Math.floor(Math.random() * playX - playX / 2);
    const knotY = Math.ceil(Math.random() * playY + offsetY);
    knots.push({
      x: knotX,
      y: knotY
    })
  }

  const wave = createBezierWave(
    knots,
    tension
  );

  return { w: wave, k: knots };
}

const WavesEffect = () => {
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [paths, setPaths] = useState<BezierWave[] | null>([]);
//  const [knots, setKnots] = useState<Grid2D[] | null>([]);

  const getCanvasContext = useCallback((context: CanvasRenderingContext2D | null) => {
    setCanvasContext(context);
    if (!context) return;
    let offsetY = 0;
    const gap = 30;
    const paths: BezierWave[] = [];
    const { devicePixelRatio: ratio = 1 } = window;
    while ((offsetY + 80) < context.canvas.height / ratio) {
      const path = definePath(context, offsetY);
      if (path) paths.push(path.w);
      offsetY += gap;
    }
    setPaths(paths);
//    setKnots(paths?.k || null);
  }, []);

  const classNames = [ css.full ];

/*
  const waveClick = (event: MouseEvent) => {
    event.preventDefault();
    console.log(event);
  };
*/

// Should be able to use lineDash and lineDashOffset following the same model as the SVG animation
// animation: dash 5s linear;  where 'dash' changes offset from 1 to 0;
  const draw = () => {
    if (!canvasContext) return;
    // Layers a slightly transparent layer over last drawn wave
    const fillStyle = getPreferredScheme() === 'dark' ? 'rgb(13 14 17)' : 'rgb(255 255 255)';
    const overlayFillStyle = getPreferredScheme() === 'dark' ? 'rgb(13 14 17 / 3%)' : 'rgb(255 255 255 / 4%)';
    const strokeStyle = getPreferredScheme() === 'dark' ? 'rgb(97 176 255 / 20%)' : 'rgb(20 30 255 / 20%)';
    canvasContext.fillStyle = fillStyle;
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = strokeStyle;
    canvasContext.fillStyle = overlayFillStyle;

    paths?.forEach(p => {
      canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
      p?.forEach((w) => {
        drawPath(canvasContext, w);
      });
    });
  };

  const drawUp = (i = 0) => {
    if (!canvasContext || !paths || i > paths.length) return;
    // Layers a slightly transparent layer over last drawn wave
//    const fillStyle = getPreferredScheme() === 'dark' ? 'rgb(13 14 17)' : 'rgb(255 255 255)';
    const overlayFillStyle = getPreferredScheme() === 'dark' ? 'rgb(13 14 17 / 3%)' : 'rgb(255 255 255 / 4%)';
    const strokeStyle = getPreferredScheme() === 'dark' ? 'rgb(97 176 255 / 20%)' : 'rgb(20 30 255 / 20%)';
    canvasContext.fillStyle = overlayFillStyle;
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = strokeStyle;
    canvasContext.fillStyle = overlayFillStyle;
    const path = paths[i];
    path?.forEach((w) => {
      drawPath(canvasContext, w);
    });
  };

  const animate = () => {
    if (!canvasContext) return;
    const fillStyle = getPreferredScheme() === 'dark' ? 'rgb(13 14 17)' : 'rgb(255 255 255)';
    const overlayFillStyle = getPreferredScheme() === 'dark' ? 'rgb(13 14 17 / 3%)' : 'rgb(255 255 255 / 4%)';
    const strokeStyle = getPreferredScheme() === 'dark' ? 'rgb(97 176 255 / 20%)' : 'rgb(20 30 255 / 20%)';
    canvasContext.fillStyle = fillStyle;
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = strokeStyle;
    canvasContext.fillStyle = overlayFillStyle;
    canvasContext.translate(0, -1);
    paths?.forEach(p => {
      // Should be able to create up and down movement by making small changes to knots and recalculating. 
      // But this could be an expensive approach to drawing waves as an animation.
      canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
      p?.forEach((w) => {
        drawPath(canvasContext, w);
      });
    });
    // Need to add a path every n redraws
  }

  return (
    <div className={ classNames.join(' ') }>
      <Canvas 
//        animate={drawUp}
        draw={draw}
//        onMouseMove={disturbanceEffect}
        getCanvasContext={getCanvasContext} 
      />
    </div>
  );

}

export { WavesEffect };