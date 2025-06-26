import { useCallback, useEffect, useState } from 'react';

import { Canvas } from './Canvas';
import { bezierPath, drawPath, type BezierCurve, type Path } from '../lib/wavePath';
import css from '../styles/draw.module.css';

const calcDy = (dx: number, a: number) => dx * Math.tan((a * Math.PI) / 180);
const calcAngle = (slopeMax: number) => Math.floor(Math.random() * slopeMax * 2) - slopeMax;

const WavesEffect = () => {
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [paths, setPaths] = useState<Path[] | null>([]);

  const getCanvasContext = useCallback((context: CanvasRenderingContext2D | null) => {
    setCanvasContext(context);
  }, []);

  const classNames = [ css.full ];
  const playX = 30;
  const playY = 30;
  const gapY = 30;
  const slopeMax = 15;

  useEffect(() => {
    if (!canvasContext) return;
    setPaths([]);
    // Some interesting things to consider for smaller screens. For example, set a minimum width
    // and height that is bigger than the viewport and allow drawing to start out of the viewport
    // or set a fixed wavelength and expand canvas to get to the end of the wave.
    const curves = 3;
    // Canvas.width is multiplied by devicePixelRatio
    const waveLength = Math.ceil(canvasContext.canvas.width / curves / window.devicePixelRatio);    
    console.log(canvasContext.canvas.width);
    console.log(window.devicePixelRatio);
    const dxOffset = Math.floor(waveLength / 3);
    const startY = Math.ceil(Math.random() * gapY + gapY);
    const defaultA1 =  calcAngle(slopeMax);
    const defaultEntry: BezierCurve = {
      startX: -waveLength,
      startY: startY,
      endX: 0,
      endY: startY,
      dx1: dxOffset,
      dy1: calcDy(dxOffset, defaultA1),
      dx2: -dxOffset,
      dy2: startY + calcDy(-dxOffset, calcAngle(slopeMax))
    };
    // Creates a single Wave from `n` curves
    const p = bezierPath(
      defaultEntry,
      curves,
      playX,
      playY,
      slopeMax,
      waveLength,
      dxOffset,
    );
    if (paths) {
      paths.push(p);
      setPaths(paths);
    } else {
      setPaths([p]);  
    }
  }, [canvasContext, paths]);
  
  const waveClick = (event: MouseEvent) => {
    event.preventDefault();
    console.log(event);
  };

// Should be able to use lineDash and lineDashOffset following the same model as the SVG animation
// animation: dash 5s linear;  where 'dash' changes offset from 1 to 0;
  const draw = () => {
    if (!canvasContext) return;
    // Layers a slightly transparent layer over last drawn wave
    // TODO: Dark Mode
/*
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
  });
  const getPreferredScheme = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light';
*/
    canvasContext.fillStyle = "rgba(255, 255, 255, .1)";
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = 'rgb(50 70 250 / 3%)';
    paths?.forEach(p => {
      drawPath(canvasContext, p[0]);
      canvasContext.strokeStyle = 'rgb(255 70 0 / 3%)';
      drawPath(canvasContext, p[1]);
      canvasContext.strokeStyle = 'rgb(0 255 0 / 3%)';
      drawPath(canvasContext, p[2]);
    });
  };

  return (
    <div className={ classNames.join(' ') }>
      <Canvas 
        draw={draw}
//        onMouseMove={disturbanceEffect}
        getCanvasContext={getCanvasContext} 
      />
    </div>
  );

}

export { WavesEffect };