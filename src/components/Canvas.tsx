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

  // Animated frame-based drawing
  useEffect(() => {
// window.requestAnimationFrame wil pause the animation when its tab is not in focus, but 
// it has a potential drawback: it will match your browser’s display refresh rate to the 
// best of its ability (depending on the computational load of your animation). This means 
// that the perceived speed at which your animation progresses is variable depending on the 
// user’s display and computational power at hand. 
// This means that to control the frame rate requires a timing function.

    let animationFrameId: number;
    let fpsInterval: number;
    let now: number;
    let then: number;
    let elapsed: number;
    let i = 0;
    let timer = 0; 

    if (context && animate) { 
      const render = () => {
        // This is the code that redraws the canvas. use a conditional to limit the number
        // of redraws for this particular render function.
        animationFrameId = window.requestAnimationFrame(render);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
          // Get ready for next frame by setting then = now, but also adjust for your
          // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
          then = now - (elapsed % fpsInterval);
          timer++;
          if (timer === 30) {
            animate(i);           
            i++;
            timer = 0;
          }
        }
      };
      const startRendering = (fps: number) => {
        fpsInterval = 1000 / fps;
        then = Date.now();
        render();
      };
      startRendering(fps);
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [animate, context, fps, theme]);

  // One time draw
  useEffect(() => {
    if (context && draw) { 
      draw();
    }
  }, [draw, context, theme]);

  return (
      <canvas ref={canvasRef} style={{ width: width, height: height }} onMouseMove={onMouseMove}/>
  );
};

export { Canvas }