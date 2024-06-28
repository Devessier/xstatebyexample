export type Position = { x: number; y: number };

export type Circles = Circle[];

export type Circle = {
  id?: string;
  radius?: number;
  color?: string;
  position?: Position;
} | null;
