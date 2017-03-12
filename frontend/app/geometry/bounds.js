import Point from './point';
import Size from './size';
export default class Bounds {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  static fromCenter(center, size) {
    return new Bounds(center.x - size.halfWidth(), center.y - size.halfHeight(), size.width, size.height);
  }
  toString() {
    return "[" + (this.x | 0) + " x " + (this.y | 0) + "]";
  }
};
