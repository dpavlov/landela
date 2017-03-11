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
    static random(xmin, xmax, ymin, ymax) {
      return new Point(
        Math.round(Math.random() * (xmax - xmin) + xmin),
        Math.round(Math.random() * (ymax - ymin) + ymin)
      );
    }
    toString() {
        return "[" + (this.x | 0) + " x " + (this.y | 0) + "]";
    }
};
