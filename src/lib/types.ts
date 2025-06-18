export type BezierPathProps = {
  points: number;
  play: number;
  slopeMax: number;
  slopeMin: number;
  svgWidth: number;
  svgHeight: number;
};

export type SinPathProps = {
  frequency: number; 
  amplitude: number;
  phase: number;
  svgWidth: number; 
  svgHeight: number;
};

export type WaveFormProps = {
  stroke: string;
  strokeWidth: number;
  fill?: string;
  svgWidth: number; 
  svgHeight: number;
  count?: number;
  gap?: number;
}