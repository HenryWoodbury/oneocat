import { useRef, useEffect, useState, type RefObject  } from 'react';

import { getPreferredScheme } from '../lib/colors';

export type CanvasProps = {
  animate?: (i:number) => void;
  draw?: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseClick?: (e: React.MouseEvent<HTMLElement>) => void;
  getCanvasContext?: (context: CanvasRenderingContext2D | null) => void;
  getCanvasWidth?: (width: number) => void;
  getCanvasHeight?: (height: number) => void;
  fps?: number;  
  width?: string;
  height?: string;
  classNames?: string[];
}

const Canvas = (props: CanvasProps) => {
  const { 
    animate,
    draw, 
    fps = 30, 
    getCanvasContext, 
    getCanvasWidth, 
    getCanvasHeight, 
    width = "100%", 
    height = "100%",
    onMouseMove
  } = props;

  const currentTheme = getPreferredScheme();
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [theme, setTheme] = useState(currentTheme)

  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', event => {
    const preferredScheme = event.matches ? 'dark' : 'light';
    setTheme(preferredScheme);
  });

  const resizeCanvas = (context: CanvasRenderingContext2D) => {
		const canvas = context.canvas;
		const { width, height } = canvas.getBoundingClientRect();

		if (canvas.width !== width || canvas.height !== height) {
			const { devicePixelRatio: ratio = 1 } = window;
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			context.scale(ratio, ratio);
			return true;
		}
		return false;
	};

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");
      if (!canvasContext) return;
      setContext(canvasContext);
      resizeCanvas(canvasContext);
      if (getCanvasContext) {
        getCanvasContext(canvasContext);
      }
      if (getCanvasWidth) {
        getCanvasWidth(canvas.width);
      }
      if (getCanvasHeight) {
        getCanvasHeight(canvas.height);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // window.requestAnimationFrame will pause the animation when its tab is not in focus.
  // It also maps to browser display rate, which is usually 60hz, but not always. And it
  // may be impacted by computational load. Thus, animations should use a timing function
  // to control the frame rate. The callback provided to requestAnimationFrame
  useEffect(() => {
    // This should be abstracted as an object passed to Canvas that includes an animate()
    // callback. For now, define it here. I've also seen code that manages fps here and
    // a tick counter that sets the callbacks on a set cadence (i.e. once per frame)
    const waveHandler = {
      frameId: 0, // will be overwritten
      lastUpdateTime: performance.now(), // Track time between updates
      lastRenderTime: performance.now(), // Track time between renders
      frameInterval: 1000 / 30, // 30 frames per second
    }
    // Need canvas context and a callback function
    if (context && animate) { 
      // See MDN Web Docs, https://developer.mozilla.org/en-US/docs/Games/Anatomy for the some 
      // source info on this logic. tFrame is always the last RAF timestamp passed by the callback
      // Also https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
      // and https://jsfiddle.net/chicagogrooves/nRpVD/2/ for the code to sync precisely to frame rate.
      const render = (tFrame: number) => {
        // Best practice is to call the requestAnimationFrame at the top of the render function.
        // By assigning the current frameId to our object, we can cancel the animation request
        // that corresponds to the ID. window.cancelAnimationFrame(waveHandler.lastFrame);
        waveHandler.frameId = window.requestAnimationFrame(render);
        // Typically a complex animation, such as a game, would separate computation from rendering
        // A multipler property or separate frameInterval properties can determine cadence for each
        // type of callback function
        const elapsedTime = tFrame - waveHandler.lastRenderTime;
        if (elapsedTime > waveHandler.frameInterval) {
          // For an increment counter, tFrame may actually be fractionally off our fps, so back off
          // lastRenderTime by the modulo of elapsedTime and frameInterval 
          waveHandler.lastRenderTime = tFrame - (elapsedTime % waveHandler.frameInterval);
          // Pass waveHandler.lastRenderTime to the animation function for any time-based processing.
          animate(waveHandler.lastRenderTime);
        }
      }
      // Initial call to render
      render(performance.now());
    }
    return () => {
      window.cancelAnimationFrame(waveHandler.frameId);
    };
  }, [animate, context]);

  // One time draw
  useEffect(() => {
    if (context && draw) { 
      draw();
    }
  }, [draw, context]);

  return (
      <canvas ref={canvasRef} style={{ width: width, height: height }} onMouseMove={onMouseMove}/>
  );
};

export { Canvas }
