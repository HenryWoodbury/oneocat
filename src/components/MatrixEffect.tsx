import { useState } from 'react';
import { Canvas } from './Canvas';

import css from '../styles/draw.module.css';

const MatrixEffect = () => {
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number | null>(null);

  const getCanvasContext = (context: CanvasRenderingContext2D | null) => {
    setCanvasContext(context);
  };

  const getCanvasWidth = (width: number) => {
    setCanvasWidth(width);
  };

  const classNames = [ css.full ];

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
  const letters = chars.split('');
  const fontSize = 10;
  const columns = canvasWidth ? canvasWidth / fontSize : 10;
  const drops: number[] = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  const convertMousePosToRowsAndCols = (x: number, y: number) => {
    if (!canvasContext) return { row: 0, col: 0 };
    const col = Math.floor(x / fontSize);
    const row = Math.min(Math.ceil(y / fontSize), Math.floor(canvasContext.canvas.height));
    return { row, col };
  };

  // Disturbance Effect Handlers
  let disturbanceRow = -1;
  let disturbanceCol = -1;
  let timeout: number;

  const disturbanceEffect = (e: React.MouseEvent<HTMLElement>) => {
    clearTimeout(timeout);
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const { row, col } = convertMousePosToRowsAndCols(x, y);
    disturbanceRow = row;
    disturbanceCol = col;
    timeout = setTimeout(() => {
      disturbanceRow = -1;
      disturbanceCol = -1;
    }, 50);
  };

  const animate = () => {
    if (!canvasContext) return;
    const isDisturbanceAffectedPosition = (dropIndex: number) => {
      return drops[dropIndex] * fontSize > disturbanceRow && dropIndex === disturbanceCol;
    }
    // Overlays progressive transparent fills on the canvas
    canvasContext.fillStyle = "rgba(255, 255, 255, .1)";
    canvasContext.fillRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      canvasContext.fillStyle = "#000";
      canvasContext.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > canvasContext.canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
      }
      if (isDisturbanceAffectedPosition(i)) {
        const h = Math.max(i - 1, 0);
        const j = Math.min(i + 1, Math.floor(columns));
        drops[h] = disturbanceRow;
        drops[i] = disturbanceRow;
        drops[j] = disturbanceRow;
      }
    }
  };

  return (
    <div className={ classNames.join(' ') }>
      <Canvas 
        animate={animate}
        onMouseMove={disturbanceEffect}
        getCanvasContext={getCanvasContext} 
        getCanvasWidth={getCanvasWidth} 
      />;
    </div>
  );
};

export { MatrixEffect };
