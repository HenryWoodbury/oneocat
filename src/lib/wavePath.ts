// Consider supporting a starting point and calculating from anywhere in the screen

// Bezier path
// https://medium.com/@bragg/cubic-bezier-curves-with-svg-paths-a326bb09616f
const calcDy = (dx: number, a: number) => dx * Math.tan((a * Math.PI) / 180);

// Remember that m, s, c are relative points while M, S, C are absolute;
const bezierPath = ({
  curves = 4,
  playX = 40,
  playY = 30,
  slopeMax = 15,
  svgHeight = 240,
  svgWidth = 1440,
}) => {
  const approximateSlice = Math.ceil(svgWidth / curves);
  const pathMiddle = Math.floor(svgHeight / 2);
  const mX = 0;
  const mY = pathMiddle - Math.floor(Math.random() * playY * 2) - playY;
  let pathData = `M ${mX} ${mY}`;
  const a1 = Math.floor(Math.random() * slopeMax * 2) - slopeMax;
  const dxOffset = Math.floor(approximateSlice / 3);
  const dx1 = dxOffset;
  const dy1 = pathMiddle - calcDy(dxOffset, a1);
  for (let i = 1; i <= curves; i++) {
    const dx = i === curves ? svgWidth : i * approximateSlice + Math.floor(Math.random() * playX * 2) - playX;
    const dy = pathMiddle - Math.floor(Math.random() * playY * 2) - playY;
    const a2 = Math.floor(Math.random() * slopeMax * 2) - slopeMax;
    const dx2 = dx - dxOffset;
    const dy2 = dy - calcDy(dxOffset, a2);
    let c;
    if (i === 1) {
      c = `C ${dx1} ${dy1} ${dx2} ${dy2}, ${dx} ${dy}`; 
    } else {
      c = `S ${dx2} ${dy2} ${dx} ${dy}`; 
    }
    pathData += ` ${c}`;
  }
  return pathData;
}

const sinPath = ({
  frequency = 0.02,
  amplitude = 80,
  phase = 10,
  svgHeight = 320,
  svgWidth = 1440,
}) => {
  const waveFrequency = Math.random() * frequency;
  const waveAmplitude = Math.random() * amplitude;
  const wavePhase = Math.random() * phase;
  const waveMiddle = svgHeight / 2;

  let pathData = `M 0 ${waveMiddle}`

  for (let x = 0; x < svgWidth; x++){
      const y = waveAmplitude * Math.sin(waveFrequency * x + wavePhase) + waveMiddle;
      pathData += `L ${x} ${y}`;
  }
  
  return pathData; 
}

export { bezierPath, sinPath };
// Some inspiration:
// https://medium.com/@bragg/cubic-bezier-curves-with-svg-paths-a326bb09616f
// https://www.nan.fyi/svg-paths/bezier-curves
// https://github.com/PikoCanFly/randomWaveGenerator/blob/main/index.js
// https://tips4devs.com/articles/build-a-reactive-trochoidal-wave-with-svg-and-vue-js.html
