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
  render(stageSize) {
    let hwStage = stageSize.halfWidth();
    let hhStage = stageSize.halfHeight();
    let topCenter = new Point(hwStage, 0).xShift(this._offset);
    let bottomCenter = new Point(hwStage, stageSize.height).xShift(this._offset);
    let leftCenter = new Point(0, hhStage).yShift(this._offset);
    let rightCenter = new Point(stageSize.width, hhStage).yShift(this._offset)

    let axisStyle = { lineWidth: 1, strokeStyle: "rgba(255,255,255,0.3)" };

    this.ioCanvas.line(topCenter, bottomCenter, axisStyle);
    this.ioCanvas.line(leftCenter, rightCenter, axisStyle);

    let stageCenter = new Point((hwStage), (hhStage))
    let ziroLabelPoint = stageCenter.shift(new Offset(3, -3).withMultiplier(this._scale)).shift(this._offset)
    let ziroLabelStyle = {
      font: (this._scale * 10) + "px Tahoma",
      textAlign: "left",
      fillStyle: "rgba(255,255,255,0.3)"
    };

    this.ioCanvas.text("[0,0]", ziroLabelPoint, ziroLabelStyle);

    let xAxis = this.settings['x-axis'];
    let yAxis = this.settings['y-axis'];

    var wGridStep = this.step();

    var vLeftGridTotal = (hwStage - this._offset.xOffset) / wGridStep;
    var vRightGridTotal = (hwStage + this._offset.xOffset) / wGridStep;
    var hTopGridTotal = (hhStage - this._offset.yOffset) / wGridStep;
    var hBottomGridTotal = (hhStage + this._offset.yOffset) / wGridStep;

    let xAxisLabelStyle = {
      font: (this._scale * xAxis['font-size']) + "px " + xAxis['font-famaly'],
      textAlign: xAxis['text-align'],
      fillStyle: xAxis['text-color']
    };
    let xAxisGridLineStyle = {lineWidth: 1, strokeStyle: "rgba(255,255,255,0.1)"};

    for (var i = 1; i < vLeftGridTotal; i++) {
      let svGridLinePoint = new Point(hwStage + i * wGridStep, 0).xShift(this._offset);
      let evGridLinePoint = new Point(hwStage + i * wGridStep, stageSize.height).xShift(this._offset)
      this.ioCanvas.line(svGridLinePoint, evGridLinePoint, xAxisGridLineStyle);

      let gridLabel = this.settings.step * i;
      let sGridLabelPoint = new Point(hwStage + i * wGridStep, hhStage)
        .shift(new Offset(3, 10).withMultiplier(this._scale))
        .shift(this._offset)
      this.ioCanvas.text(gridLabel, sGridLabelPoint, xAxisLabelStyle);
    }

    for (var i = 1; i < vRightGridTotal; i++) {
      let svGridLinePoint = new Point(hwStage - i * wGridStep, 0).xShift(this._offset);
      let evGridLinePoint = new Point(hwStage - i * wGridStep, stageSize.height).xShift(this._offset);
      this.ioCanvas.line(svGridLinePoint, evGridLinePoint, xAxisGridLineStyle);

      let gridLabel = -this.settings.step * i;
      let sGridLabelPoint = new Point(hwStage - i * wGridStep, hhStage)
        .shift(new Offset(3, 10).withMultiplier(this._scale))
        .shift(this._offset);
      this.ioCanvas.text(gridLabel, sGridLabelPoint, xAxisLabelStyle);
    }

    let yAxisLabelStyle = {
      font: (this._scale * yAxis['font-size']) + "px " + yAxis['font-famaly'],
      textAlign: yAxis['text-align'],
      fillStyle: yAxis['text-color']
    };
    let yAxisGridLineStyle = {lineWidth: 1, strokeStyle: "rgba(255,255,255,0.1)"};

    for (var i = 1; i < hTopGridTotal; i++) {
      let shGridLinePoint = new Point(0, hhStage + i * wGridStep).yShift(this._offset);
      let ehGridLinePoint = new Point(stageSize.width, hhStage + i * wGridStep).yShift(this._offset);
      this.ioCanvas.line(shGridLinePoint, ehGridLinePoint, yAxisGridLineStyle);

      let gridLabel = -this.settings.step * i;
      let sGridLabelPoint = new Point(hwStage, hhStage + i * wGridStep)
        .shift(new Offset(3, 10).withMultiplier(this._scale))
        .shift(this._offset)

      this.ioCanvas.text(gridLabel, sGridLabelPoint, yAxisLabelStyle);
    }

    for (var i = 1; i < hBottomGridTotal; i++) {
      let shGridLinePoint = new Point(0, hhStage - i * wGridStep).yShift(this._offset);
      let ehGridLinePoint = new Point(stageSize.width, hhStage - i * wGridStep).yShift(this._offset);
      this.ioCanvas.line(shGridLinePoint, ehGridLinePoint, yAxisGridLineStyle);

      let gridLabel = this.settings.step * i;
      let sGridLabelPoint = new Point(hwStage, hhStage - i * wGridStep)
        .shift(new Offset(3, 10).withMultiplier(this._scale))
        .shift(this._offset)

      this.ioCanvas.text(gridLabel, sGridLabelPoint, yAxisLabelStyle);
    }
  }
};
