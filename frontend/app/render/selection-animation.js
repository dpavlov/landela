import Offset from '../geometry/offset';
import Animation from '../utils/animation';
import Site from '../map/site';
import Node from '../map/node';

export default class SelectionAnimation {
  constructor(viewport, ioCanvas, icons) {
    this.icons = icons;
    this.ioCanvas = ioCanvas;
    this.viewport = viewport;
    this.duration = 500;
    this.underlineStyle = { lineWidth: 3, strokeStyle: 'yellow' };
  }
  select(target, updateCallback, doneCallback) {
    if (target instanceof Node) {
      this._selectNode(target, updateCallback, doneCallback)
    } else if (target instanceof Site) {
      this._selectSite(target, updateCallback, doneCallback)
    } else {
      doneCallback();
    }
  }
  deselect(target, updateCallback, doneCallback) {
    if (target instanceof Node) {
      this._deselectNode(target, updateCallback, doneCallback)
    }  else if (target instanceof Site) {
      this._deselectSite(target, updateCallback, doneCallback)
    } else {
      doneCallback();
    }
  }
  _selectNode(node, updateCallback, doneCallback) {
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
  _selectSite(site, updateCallback, doneCallback) {
    let { siteCenter, halfWidth, halfHeight } = this._siteHalfSize(site);
    let paddingBottom = this.viewport.withScale(5);
    let centerUnderlinePoint = siteCenter.shift(new Offset(0, halfHeight + paddingBottom));
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
  _deselectNode(node, updateCallback, doneCallback) {
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
  _deselectSite(site, updateCallback, doneCallback) {
    let { siteCenter, halfWidth, halfHeight } = this._siteHalfSize(site);
    let paddingBottom = this.viewport.withScale(5);
    let sUnderlinePoint = siteCenter.shift(new Offset(- halfWidth, halfHeight + paddingBottom));
    let eUnderlinePoint = siteCenter.shift(new Offset(halfWidth, halfHeight + paddingBottom));
    this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, this.underlineStyle);
    Animation.animate(
      (progress) => {
        updateCallback();
        let sUnderlinePoint = siteCenter.shift(new Offset(- halfWidth * (1 - progress), halfHeight + paddingBottom));
        let eUnderlinePoint = siteCenter.shift(new Offset(halfWidth * (1 - progress), halfHeight + paddingBottom));
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
  _siteHalfSize(site) {
    let siteCenter = this.viewport.siteDisplayCenter(site);
    let scaledWidth = this.viewport.withScale(site.width);
    let scaledHeight = this.viewport.withScale(site.height);
    return {siteCenter: siteCenter, halfWidth: scaledWidth / 2, halfHeight: scaledHeight / 2}
  }
};
