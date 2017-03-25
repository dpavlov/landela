import Point from './point';
import Size from './size';
export default class Bounds {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  static fromTopLeft(point, size) {
    return new Bounds(point.x, point.y, size.width, size.height);
  }
  static fromCenter(center, size) {
    return new Bounds(center.x - size.halfWidth(), center.y + size.halfHeight(), size.width, size.height);
  }
  in(point) {
    return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height;
  }
  tl() {
    return new Point(this.x, this.y);
  }
  center() {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }
  toString() {
    return "[" + (this.x | 0) + " x " + (this.y | 0) + "]";
  }
};
