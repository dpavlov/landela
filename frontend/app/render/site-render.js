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
    let siteCenter = this.viewport.siteDisplayCenter(site);
    let siteSize = site.size(this.viewport.scale());
    let siteTopLeftPoint = siteCenter.shift(new Offset(- siteSize.halfWidth(), - siteSize.halfHeight()));

    let radius = this.viewport.withScale(this.settings.radius);
    let siteStyle = { lineWidth: this.settings.lineWidth, strokeStyle: this.settings.strokeStyle };

    this.ioCanvas.roundedRectangle(siteTopLeftPoint, siteSize.width, siteSize.height, radius, siteStyle);

    let fontSize = this.viewport.withScale(14);
    let labelFont = fontSize + "px Times";
    let labelStyle = { font: labelFont, fillStyle: "#c0e2f7", textAlign: "left" };
    let labelPadding = {
      left: this.viewport.withScale(5),
      right: this.viewport.withScale(5),
      top: this.viewport.withScale(5),
      bottom: this.viewport.withScale(5)
    }

    let maxLabelWidth = siteSize.width - 2 * radius - labelPadding.left - labelPadding.right;

    let textHeight = fontSize + this.viewport.withScale(2);
    let lineHeight = textHeight + this.viewport.withScale(2);

    let {lines, maxLineWidth} = this.ioCanvas.textLines(site.name, labelFont, maxLabelWidth, textHeight);

    let topLeft = this.labelBackground(siteCenter, siteSize, radius, labelPadding, maxLineWidth, lineHeight, lines.length);
    this.label(topLeft, labelPadding, lines, lineHeight, textHeight, labelStyle);

    for (var iNode = 0; iNode < site.nodes.length; iNode++) {
        var node = site.nodes[iNode];
        this.nodeRender.render(node);
    }
  }
  labelBackground(siteCenter, siteSize, radius, labelPadding, maxLineWidth, lineHeight, linesTotal) {
    let backgroundWidth = labelPadding.left + maxLineWidth + labelPadding.right;
    let backgroundHeight = labelPadding.top + lineHeight * linesTotal + labelPadding.bottom;
    let labelBackgroundTolLeftPoint = siteCenter.shift(new Offset( - siteSize.halfWidth() + radius, siteSize.halfHeight() - backgroundHeight));

    let labelBackgroundStyle = {fillStyle: "#9c27b0"};

    this.ioCanvas.rectangle(labelBackgroundTolLeftPoint, backgroundWidth, backgroundHeight, labelBackgroundStyle);

    return labelBackgroundTolLeftPoint;
  }

  label(topLeft, labelPadding, lines, lineHeight, textHeight, labelStyle) {
    let labelStartPoint = topLeft.shift(new Offset(labelPadding.left,labelPadding.top));
    lines.forEach(line => {
      let pos = labelStartPoint.shift(line.offset).shift(new Offset(0, lineHeight - textHeight * 0.25));
      this.ioCanvas.text(line.text, pos, labelStyle);
    });
  }
};
