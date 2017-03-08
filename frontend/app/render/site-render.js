import Offset from '../geometry/offset';
import Point from '../geometry/point';

export default class SiteRender {
  constructor(settings, viewport, ioCanvas, nodeRender) {
    this.settings = settings;
    this.ioCanvas = ioCanvas;
    this.viewport = viewport;
    this.nodeRender = nodeRender;
  }
  render(site) {
    var siteCenter = this.viewport.siteDisplayCenter(site);
    let w = this.viewport.withScale(site.width);
    let h = this.viewport.withScale(site.height);
    let radius = this.viewport.withScale(20);
    let sitePoint = siteCenter.shift(new Offset(- w / 2, - h / 2));
    let siteStyle = { lineWidth: 1, strokeStyle: '#c0e2f7' };
    this.ioCanvas.roundedRectangle(sitePoint, w, h, radius, siteStyle);

    let labelPaddingLeft = this.viewport.withScale(20);
    let labelPaddingBottom = this.viewport.withScale(10);

    let labelPoint = siteCenter.shift(new Offset(- w / 2 + labelPaddingLeft, h / 2 - labelPaddingBottom));

    let labelFont = this.viewport.withScale(16) + "px Times";

    let textWidth = Math.min(
      this.ioCanvas.measureText(labelFont, site.name).width + this.viewport.withScale(10),
      w  - this.viewport.withScale(35)
    );
    let textHeight = this.viewport.withScale(30);
    let labelBackgroundPoint = labelPoint.shift(new Offset(- this.viewport.withScale(3), - this.viewport.withScale(22)));
    let labelBackgroundStyle = {fillStyle: "#9c27b0"};
    this.ioCanvas.rectangle(labelBackgroundPoint, textWidth, textHeight, labelBackgroundStyle);

    let labelStyle = { font: labelFont, fillStyle: "#c0e2f7", textAlign: "left" };

    this.ioCanvas.text(site.name, labelPoint, labelStyle);

    for (var iNode = 0; iNode < site.nodes.length; iNode++) {
        var node = site.nodes[iNode];
        this.nodeRender.render(node);
    }

    if (site.isSelected()) {
      let halfWidth = w / 2;
      let halfHeight = h / 2;
      let paddingBottom = this.viewport.withScale(5);
      let sUnderlinePoint = siteCenter.shift(new Offset(- halfWidth, halfHeight + paddingBottom));
      let eUnderlinePoint = siteCenter.shift(new Offset(halfWidth, halfHeight + paddingBottom))
      let underlineStyle = { lineWidth: 3, strokeStyle: 'yellow' };
      this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, underlineStyle);
    }
  }
};
