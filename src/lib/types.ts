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

export type CanvasTypes = {
  draw: () => void;
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