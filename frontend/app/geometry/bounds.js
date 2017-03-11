import Point from './point';
import Size from './size';
export default class Bounds {
  x: number
  y: number
	width: number
	height: number
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  static fromCenter(center: Point, size: Size): Bounds {
    return new Bounds(center.x - size.halfWidth(), center.y - size.halfHeight(), size.width, size.height);
  }
  toString(): string {
    return "[" + (this.x | 0) + " x " + (this.y | 0) + "]";
  }
};
