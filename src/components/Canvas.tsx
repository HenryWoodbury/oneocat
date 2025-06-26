import { useRef, useEffect, useState, type RefObject  } from 'react';

import { type CanvasTypes} from '../lib/types';

const Canvas = (props: CanvasTypes) => {
  const { 
    draw, 
    fps = 30, 
    getCanvasContext, 
    getCanvasWidth, 
    getCanvasHeight, 
    width = "100%", 
    height = "100%",
    onMouseMove
  } = props;

  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

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

  useEffect(() => {
// window.requestAnimationFrame is great for resource-conservation in that it pauses the 
// animation when its tab is not in focus, but it has a potential drawback: it will match 
// your browser’s display refresh rate to the best of its ability (depending on the 
// computational load of your animation). This means that the perceived speed at which your
// animation progresses is variable depending on the  user’s display and computational 
// power at hand. 
// 
// So if we want to control the frame rate we need to add a timing functionality to our code. 
    let animationFrameId: number;
    let fpsInterval: number;
    let now: number;
    let then: number;
    let elapsed: number;

    if (context) { 
      const render = () => {
        animationFrameId = window.requestAnimationFrame(render);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
          // Get ready for next frame by setting then = now, but also adjust for your
          // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
          then = now - (elapsed % fpsInterval);
          draw();
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
  }, [draw, context, fps]);

  return (
      <canvas ref={canvasRef} style={{ width: width, height: height }} onMouseMove={onMouseMove}/>
  );
};

export { Canvas }