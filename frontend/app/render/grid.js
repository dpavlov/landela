import Point from '../geometry/point';
import Offset from '../geometry/offset';

export default class Grid {
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
  render(wStage, hStage) {

    var topCenter = new Point(wStage / 2, 0).xShift(this._offset);
    var bottomCenter = new Point(wStage / 2, hStage).xShift(this._offset);
    var leftCenter = new Point(0, hStage / 2).yShift(this._offset);
    var rightCenter = new Point(wStage, hStage / 2).yShift(this._offset)

    this.ioCanvas.line(topCenter, bottomCenter, "rgba(255,255,255,0.3)");
    this.ioCanvas.line(leftCenter, rightCenter, "rgba(255,255,255,0.3)");

    var center = new Point((wStage / 2), (hStage / 2))

    this.ioCanvas.text(
      "[0,0]",
      center.shift(new Offset(3, -3).withMultiplier(this._scale)).shift(this._offset),
      (this._scale * 10) + "px Tahoma",
      "left",
      "rgba(255,255,255,0.3)"
    )

    let xAxis = this.settings['x-axis'];
    let yAxis = this.settings['y-axis'];

    var wGridStep = this.settings.step * this._scale;

    var vLeftGridTotal = ((wStage / 2) - this._offset.xOffset) / wGridStep;
    var vRightGridTotal = ((wStage / 2) + this._offset.xOffset) / wGridStep;
    var hTopGridTotal = ((hStage / 2) - this._offset.yOffset) / wGridStep;
    var hBottomGridTotal = ((hStage / 2) + this._offset.yOffset) / wGridStep;

    for (var i = 1; i < vLeftGridTotal; i++) {
      this.ioCanvas.line(new Point(wStage / 2 + i * wGridStep, 0).xShift(this._offset), new Point(wStage / 2 + i * wGridStep, hStage).xShift(this._offset), "rgba(255,255,255,0.1)");
      this.ioCanvas.text(
        this.settings.step * i,
        new Point(wStage / 2 + i * wGridStep, hStage / 2).shift(new Offset(3, 10).withMultiplier(this._scale)).shift(this._offset),
        (this._scale * xAxis['font-size']) + "px " + xAxis['font-famaly'],
        xAxis['text-align'],
        xAxis['text-color']
      );
    }

    for (var i = 1; i < vRightGridTotal; i++) {
      this.ioCanvas.line(new Point(wStage / 2 - i * wGridStep, 0).xShift(this._offset), new Point(wStage / 2 - i * wGridStep, hStage).xShift(this._offset), "rgba(255,255,255,0.1)");
      this.ioCanvas.text(
        -this.settings.step * i,
        new Point(wStage / 2 - i * wGridStep, hStage / 2).shift(new Offset(3, 10).withMultiplier(this._scale)).shift(this._offset),
        (this._scale * xAxis['font-size']) + "px " + xAxis['font-famaly'],
        xAxis['text-align'],
        xAxis['text-color']
      );
    }

    for (var i = 1; i < hTopGridTotal; i++) {
      this.ioCanvas.line(new Point(0, hStage / 2 + i * wGridStep).yShift(this._offset), new Point(wStage, hStage / 2 + i * wGridStep).yShift(this._offset), "rgba(255,255,255,0.1)");
      this.ioCanvas.text(
        -this.settings.step * i,
        new Point(wStage / 2, hStage / 2 + i * wGridStep).shift(new Offset(3, 10).withMultiplier(this._scale)).shift(this._offset),
        (this._scale * yAxis['font-size']) + "px " + yAxis['font-famaly'],
        yAxis['text-align'],
        yAxis['text-color']
      );
    }

    for (var i = 1; i < hBottomGridTotal; i++) {
      this.ioCanvas.line(new Point(0, hStage / 2 - i * wGridStep).yShift(this._offset), new Point(wStage, hStage / 2 - i * wGridStep).yShift(this._offset), "rgba(255,255,255,0.1)");
      this.ioCanvas.text(
        this.settings.step * i,
        new Point(wStage / 2, hStage / 2 - i * wGridStep).shift(new Offset(3, 10).withMultiplier(this._scale)).shift(this._offset),
        (this._scale * yAxis['font-size']) + "px " + yAxis['font-famaly'],
        yAxis['text-align'],
        yAxis['text-color']
      );
    }
  }
};
