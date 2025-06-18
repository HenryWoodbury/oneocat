import { bezierPath } from '../lib/wavePath';
import css from '../styles/waves.module.css';

const Waves: React.FC = () => {
  const svgWidth = 1440;
  const svgHeight = 240;
  const viewBox = `0 0 ${svgWidth.toString()} ${svgHeight.toString()}`;
//  const gap = ?; (number of waves is vh / gap)
  const paths = Array(14)
    .fill(null)
    .map(() => bezierPath({
      svgWidth: svgWidth,
      svgHeight: svgHeight
    }));
  return (
    <div className={css.waves}>
      {paths.map((p, i) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} key={i}>
          <path className={css.wavepath} d={p} pathLength="1"></path>
        </svg>
      ))}
    </div>
  );
}

export { Waves };
