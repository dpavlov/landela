import Offset from '../geometry/offset';
import Animation from '../utils/animation';

export default class SelectionAnimation {
  constructor(viewport, ioCanvas, icons) {
    this.icons = icons;
    this.ioCanvas = ioCanvas;
    this.viewport = viewport;
    this.duration = 500;
    this.underlineStyle = { lineWidth: 3, strokeStyle: 'yellow' };
  }
  selectNode(node, updateCallback, doneCallback) {
    let { nodeCenter, halfWidth, halfHeight } = this._nodeHalfSize(node);
    let centerUnderlinePoint = nodeCenter.shift(new Offset(0, halfHeight));
    this.ioCanvas.line(centerUnderlinePoint, centerUnderlinePoint, this.underlineStyle);
    Animation.animate(
      (progress) => {
        updateCallback();
        let sUnderlinePoint = centerUnderlinePoint.shift(new Offset(- halfWidth * progress, 0));
        let eUnderlinePoint = centerUnderlinePoint.shift(new Offset(halfWidth * progress, 0));
        this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, this.underlineStyle);
      },
      this.duration,
      doneCallback
    );
  }
  deselectNode(node, updateCallback, doneCallback) {
    let { nodeCenter, halfWidth, halfHeight } = this._nodeHalfSize(node);
    let sUnderlinePoint = nodeCenter.shift(new Offset(- halfWidth, halfHeight));
    let eUnderlinePoint = nodeCenter.shift(new Offset(halfWidth, halfHeight));
    this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, this.underlineStyle);
    Animation.animate(
      (progress) => {
        updateCallback();
        let sUnderlinePoint = nodeCenter.shift(new Offset(- halfWidth * (1 - progress), halfHeight));
        let eUnderlinePoint = nodeCenter.shift(new Offset(halfWidth * (1 - progress), halfHeight));
        this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, this.underlineStyle);
      },
      this.duration,
      doneCallback
    );
  }
  _nodeHalfSize(node) {
    let nodeCenter = this.viewport.nodeDisplayCenter(node);
    let icon = this.icons.getIconFor(node);
    let { scaledWidth, scaledHeight } = this.viewport.scaledImageSize(icon.image, icon.rescale);
    return {nodeCenter: nodeCenter, halfWidth: scaledWidth / 2, halfHeight: scaledHeight / 2}
  }
};
