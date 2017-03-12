import Point from '../geometry/point';
import Circle from '../geometry/circle';
import Offset from '../geometry/offset';

export default class Honeycombs {
  constructor(settings, ioCanvas) {
    this.settings = settings;
    this.ioCanvas = ioCanvas;
    this._offset = new Offset(0, 0);
    this._scale = 1.0;
  }
  scale(newScale) {
    this._scale = newScale;
  }
  offset(newOffset) {
    this._offset = newOffset;
  }
  step() {
    return this.settings.step * this._scale;
  }
  align(offset) {
    let gridStep = this.step();
    let alignedOffset = new Offset(
      Math.round( offset.xOffset / gridStep ) * gridStep,
      Math.round( offset.yOffset / gridStep ) * gridStep
    );
    return alignedOffset.subtract(offset);
  }
  render(stageSize) {
    let hwStage = stageSize.halfWidth();
    let hhStage = stageSize.halfHeight();
    let center = new Point(hwStage, hhStage);
    let axisStyle = { lineWidth: 0.3, strokeStyle: "rgba(255,255,255,0.2)" };
    
    let halfStep = this.step() / 2;
    let quadStep = halfStep / 2;

    var wGridStep = this.step();

    var vLeftGridTotal = 1 + (hwStage + this._offset.xOffset) / wGridStep;
    var vRightGridTotal = 1 + (hwStage - this._offset.xOffset) / wGridStep;
    var hTopGridTotal = 1 + (hhStage + this._offset.yOffset) / wGridStep;
    var hBottomGridTotal = 1 + (hhStage - this._offset.yOffset) / wGridStep;

    for (var i = 0; i < vLeftGridTotal; i++) {
      for (var j = 1; j < hTopGridTotal; j++) {
        let oddOffset = j % 2 === 0 ? new Offset(0, 0) : new Offset(-1.5 * wGridStep, 0);
        let offset = new Offset(-3 * wGridStep * i, - j * 2 * Math.sqrt(halfStep * halfStep - quadStep * quadStep));
        this.honeycomb(center.shift(offset).shift(oddOffset).shift(this._offset), axisStyle);
      }
    }

    for (var i = 0; i < vRightGridTotal; i++) {
      for (var j = 1; j < hTopGridTotal; j++) {
        let oddOffset = j % 2 === 0 ? new Offset(0, 0) : new Offset(1.5 * wGridStep, 0);
        let offset = new Offset(3 * wGridStep * i, -j * 2 * Math.sqrt(halfStep * halfStep - quadStep * quadStep));
        this.honeycomb(center.shift(offset).shift(oddOffset).shift(this._offset), axisStyle);
      }
    }

    for (var i = 0; i < vLeftGridTotal; i++) {
      for (var j = 1; j < hBottomGridTotal; j++) {
        let oddOffset = j % 2 === 0 ? new Offset(0, 0) : new Offset(-1.5 * wGridStep, 0);
        let offset = new Offset(-3 * wGridStep * i, j * 2 * Math.sqrt(halfStep * halfStep - quadStep * quadStep));
        this.honeycomb(center.shift(offset).shift(oddOffset).shift(this._offset), axisStyle);
      }
    }

    for (var i = 0; i < vRightGridTotal; i++) {
      for (var j = 1; j < hBottomGridTotal; j++) {
        let oddOffset = j % 2 === 0 ? new Offset(0, 0) : new Offset(1.5 * wGridStep, 0);
        let offset = new Offset(3 * wGridStep * i, j * 2 * Math.sqrt(halfStep * halfStep - quadStep * quadStep));
        this.honeycomb(center.shift(offset).shift(oddOffset).shift(this._offset), axisStyle);
      }
    }
  }
  honeycomb(center, honeycombStyle) {
    let orbit = new Circle(center, this.step());
    let points = orbit.absPointsOn(6);
    var from = points[0];
    for (var i = 1; i < 7; i ++) {
      var to = points[i % 6];
      this.ioCanvas.line(from, to, honeycombStyle);
      from = to;
    }
  }
};
