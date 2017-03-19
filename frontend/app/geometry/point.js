export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
    	return new Point(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }
    xInverse() {
        return new Point(-this.x, this.y);
    }
    yInverse() {
        return new Point(this.x, -this.y);
    }
    shift(offset) {
    	return new Point(this.x + offset.xOffset, this.y + offset.yOffset);
    }
    xShift(offset) {
    	return new Point(this.x + offset.xOffset, this.y);
    }
    yShift(offset) {
    	return new Point(this.x, this.y + offset.yOffset);
    }
    withMultiplier(k) {
        return new Point(this.x * k, this.y * k);
    }
    withMultipliers(k1, k2) {
        return new Point(this.x * k1, this.y * k2);
    }
    distanceTo(point) {
      let xDelta = this.x - point.x;
      let yDelta = this.y - point.y;
      return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
    }
    static random(xmin, xmax, ymin, ymax) {
      return new Point(
        Math.round(Math.random() * (xmax - xmin) + xmin),
        Math.round(Math.random() * (ymax - ymin) + ymin)
      );
    }
    copy() {
        return new Point(this.x, this.y);
    }
    toString() {
        return "[" + (this.x | 0) + " x " + (this.y | 0) + "]";
    }
};
