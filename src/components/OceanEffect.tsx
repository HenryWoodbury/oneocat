import { useCallback, useState } from 'react';

import { Canvas } from './Canvas';
import { createBezierWave, drawPath, type Grid2D, type Waves } from '../lib/wavePath';
import { getPreferredScheme } from '../lib/colors';
import css from '../styles/draw.module.css';

const definePath = (
  width: number,
  offsetY = 60,
  maxWavelength = 200,
  maxCurves = 9,
  playX = 60, 
  playY = 60
) => {
  const curves = Math.min(Math.ceil(width / maxWavelength), maxCurves);
  const wavelength = Math.ceil(width / (curves - 1));
  const startX = Math.ceil(Math.random() * playX - wavelength);
  const startY = Math.ceil(Math.random() * playY + offsetY);
  
  const knots: Grid2D[] = [{
    x: startX,
    y: startY
  }]; 

  for (let i = 1; i < curves + 2; i++) {
    const knotX = knots[i-1].x + wavelength + Math.floor(Math.random() * playX - playX / 2);
    const knotY = Math.ceil(Math.random() * playY + offsetY);
    knots.push({
      x: knotX,
      y: knotY
    })
  }

  knots.push({
    x: width + wavelength + Math.floor(Math.random() * playX - playX / 2),
    y: Math.ceil(Math.random() * playY + offsetY)
  })

  return knots;
}

const OceanEffect = () => {
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [paths, setPaths] = useState<Waves | null>([]);

  const getCanvasContext = useCallback((context: CanvasRenderingContext2D | null) => {
    setCanvasContext(context);
    if (!context) return;
    // All of these values can be made user-configurable
    let offsetY = 0;
    const gap = 30;
    const maxWavelength = 200;
    const maxCurves = 9;
    const playX = 60;
    const playY = 60;
    const paths: Waves = [];
    const tension = 0.5;
    const speed = 1; // 1 second
    const { devicePixelRatio: ratio = 1 } = window;
    while ((offsetY + 80) < context.canvas.height / ratio) {
      const pathStart = definePath(context.canvas.width / ratio, offsetY, maxWavelength, maxCurves, playX, playY);
      const pathEnd = definePath(context.canvas.width/ ratio, offsetY + gap, maxWavelength, maxCurves, playX, playY);
      paths.push({
        start: pathStart,
        end: pathEnd,
        tension: tension,
        gap: gap,
        speed: speed,
      });
      offsetY += gap;
    }
    setPaths(paths);
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
      const wave = createBezierWave(
        p.start,
        p.tension
      );
      wave?.forEach((w) => {
        drawPath(canvasContext, w);
      });
    });
  };

  const animate = () => {
    
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

export { OceanEffect };