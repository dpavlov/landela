import Offset from './offset';
export default class Size {
  width: number
  height: number
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  halfWidth(): number {
    return this.width / 2;
  }
  halfHeight(): number {
    return this.height / 2;
  }
  half(): Size {
    return new Size(this.halfWidth(), this.halfHeight());
  }
  toString(): string {
    return "[" + (this.width | 0) + " x " + (this.height | 0) + "]";
  }
};
