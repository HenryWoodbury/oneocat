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
// Best practice is to request the animation frame as the first call in the render loop.
// This allows the browser to best manage the canvas animation against the vsync window
// managed by the OS and graphics card.
        animationFrameId = window.requestAnimationFrame(render);
        now = Date.now();
// milliseconds since last render
        elapsed = now - then;
// Use a timing conditional to determine whether the render actually does anything. Here
// the elapsed milliseconds must be greater than the frames per second interval.
        if (elapsed > fpsInterval) {
// Set then = now, but also ensure that to adjust for the requestAnimationFrame's own internal
// interval (16.7ms on 60hz monitor). The actual "then" may be a few milliseconds different
// than the "then" captured in the last loop.
//
// window.requestAnimationFrame() always provides a DOMHighResTimeStamp as a return value. So 
// this is a default argument for the render callback -- render(tframe)
          then = now - (elapsed % fpsInterval);
// A very simple timer that waits a full second (30 frames) to run the animation.
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

/* 
Some examples for handling tick time

https://www.reddit.com/r/webdev/comments/8r0xw4/how_do_you_make_an_animation_like_this/

const animateIcon = icon => {
  const time = { total: 12000 };
  const maxDistance = 120;
  const maxRotation = 800;
  const transform = {};
  define(transform, "translateX", getRandomInt(-maxDistance, maxDistance));
  define(transform, "translateY", getRandomY(transform.translateX, 60, maxDistance));
  define(transform, "rotate", getRandomInt(-maxRotation, maxRotation));

  const tick = now => {
    if (time.start == null) define(time, "start", now);
    define(time, "elapsed", now - time.start);
    const progress = easeOutQuart(time.elapsed, 0, 1, time.total);

    icon.style.opacity = Math.abs(1 - progress);
    icon.style.transform = Object.keys(transform).map(key => {
      const value = transform[key] * progress;
      const unit = /rotate/.test(key) ? "deg" : "px";
      return `${key}(${value}${unit})`;
    }).join(" ");

    time.elapsed < time.total
    ? requestAnimationFrame(tick)
    : programmingLanguages.removeChild(icon);
  };

  requestAnimationFrame(tick);
};

https://www.reddit.com/r/webdev/comments/19c05to/efficient_use_of_requestanimationframe_for_10_fps/

let prevTickTime
// tick() updates and renders our game
function tick(timestamp: number) {
  if (!prevTickTime) {
    prevTickTime = timestamp
  }
  // deltaTime measures the time between frames
  let deltaTime = timestamp - prevTickTime
  prevTickTime = timestamp
  // Update the game
  game.update(deltaTime)
  // Render the game
  game.render(deltaTime)
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)



cancelAnimationFrame(requestID);



*/