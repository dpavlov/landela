export default class Offset {
    constructor(xOffset, yOffset) {
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }
    inverse() {
        return new Offset(-this.xOffset, -this.yOffset);
    }
    half() {
        return new Offset(this.xOffset / 2, this.yOffset / 2);
    }
    quad() {
        return new Offset(this.xOffset / 4, this.yOffset / 4);
    }
    xReset() {
        return new Offset(0, this.yOffset);
    }
    yReset() {
        return new Offset(this.xOffset, 0);
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
    withReverseMultiplier(x) {
        let xReverse = (1 / x);
        return new Offset(this.xOffset * xReverse, this.yOffset * xReverse);
    }
    add(offset) {
        return new Offset(this.xOffset + offset.xOffset, this.yOffset + offset.yOffset);
    }
    subtract(offset) {
        return new Offset(this.xOffset - offset.xOffset, this.yOffset - offset.yOffset);
    }
    toString() {
        return "[" + this.xOffset + " x " + this.yOffset + "]";
    }
};
