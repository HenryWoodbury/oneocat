import { useRef, type MouseEvent } from 'react';

import { useSize } from '../hooks/useSize';
import { bezierPath } from '../lib/wavePath';
import { Delayer } from './Delayer';
import css from '../styles/waves.module.css';

const Waves: React.FC = () => {
  const target = useRef(null);
  const size = useSize(target);
  const svgWidth = size?.width || 1440;
  const svgHeight = Math.ceil(svgWidth / 6);
  const viewBox = `0 0 ${svgWidth.toString()} ${svgHeight.toString()}`;
  const waveCount = 30;
  const playX = Math.ceil(svgWidth / 40);
  const playY = Math.ceil(svgHeight / 8);
  const slopeMax = Math.ceil(svgHeight / 16);

  const paths = Array(waveCount)
    .fill(null)
    .map(() => bezierPath({
      svgWidth: svgWidth,
      svgHeight: svgHeight,
      playX: playX,
      playY: playY,
      slopeMax: slopeMax
    }));
  const waveClick = (event: MouseEvent) => {
    event.preventDefault();
    console.log(event);
  };
  return (
    <div className={css.waves} onClick={waveClick} ref={target}>
      {paths.map((p, i) => {
        const top = (1000 / waveCount * i - svgHeight / 2).toFixed(2);
        const r = Math.floor(Math.random() * 5000);
        const flip = Math.floor(Math.random() * 2) === 0;
        return (
          <Delayer timer={r} key={`k${top}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} key={i} className={flip ? css.waveRight : css.waveLeft} style={{top: `${top}px`}}>
              <path className={css.wavepath} d={p} pathLength="1"></path>
            </svg>
          </Delayer>
        )}
      )}
    </div>
  );
}

export { Waves };
