import Offset from './offset';
export default class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  halfWidth() {
    return this.width / 2;
  }
  halfHeight() {
    return this.height / 2;
  }
  half() {
    return new Size(this.halfWidth(), this.halfHeight());
  }
  swap() {
    return new Size(this.height, this.width);
  }
  toString() {
    return "[" + (this.width | 0) + " x " + (this.height | 0) + "]";
  }
};
