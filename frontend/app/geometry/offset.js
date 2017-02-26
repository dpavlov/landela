export default class Offset { 
    constructor(xOffset, yOffset) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }
    inverse() {
        return new Offset(-this.xOffset, -this.yOffset);
    } 
    xInverse() {
        return new Offset(-this.xOffset, this.yOffset);
    } 
    yInverse() {
        return new Offset(this.xOffset, -this.yOffset);
    } 
    withMultiplier(x) {
        return new Offset(this.xOffset * x, this.yOffset * x);
    }
    add(offset) {
        return new Offset(this.xOffset + offset.xOffset, this.yOffset + offset.yOffset);
    }
    toString() {
        return "[" + this.xOffset + " x " + this.yOffset + "]";
    }
};