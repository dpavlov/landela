import Offset from '../geometry/offset';
import Point from '../geometry/point';
import Size from '../geometry/size';
import Bounds from '../geometry/bounds';

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
    let siteStyle = { lineWidth: this.settings.lineWidth, strokeStyle: this.settings.strokeStyle, fillStyle: this.settings.fillStyle };

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

    let {lines, maxLineWidth} = this.ioCanvas.textLines(site.name + ' | ' + site.address, labelFont, maxLabelWidth, textHeight);

    let topLeft = this.labelBackground(siteCenter, siteSize, radius, labelPadding, maxLineWidth, lineHeight, lines.length);
    this.label(topLeft, labelPadding, lines, lineHeight, textHeight, labelStyle);

    let moveHandlerStyle = { fillStyle: 'rgba(250, 250, 250, 0.3)' };
    this.moveHandler(siteCenter, siteSize, radius, moveHandlerStyle);
    let handlerSize = new Size(this.viewport.withScale(5), this.viewport.withScale(50));
    this.rightResizeHandler(siteCenter, siteSize, handlerSize, moveHandlerStyle);
    this.leftResizeHandler(siteCenter, siteSize, handlerSize, moveHandlerStyle);
    this.topResizeHandler(siteCenter, siteSize, handlerSize.swap(), moveHandlerStyle);
    this.bottomResizeHandler(siteCenter, siteSize, handlerSize.swap(), moveHandlerStyle);

    for (var iNode = 0; iNode < site.nodes.length; iNode++) {
      var node = site.nodes[iNode];
      this.nodeRender.render(node);
    }

    if (site.isSelected()) {
      let paddingBottom = this.viewport.withScale(5);
      let sUnderlinePoint = siteCenter.shift(new Offset(- siteSize.halfWidth(), siteSize.halfHeight() + paddingBottom));
      let eUnderlinePoint = siteCenter.shift(new Offset(siteSize.halfWidth(), siteSize.halfHeight() + paddingBottom));
      let underlineStyle = { lineWidth: 3, strokeStyle: 'yellow' };
      this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, underlineStyle);
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

  isPointInMoveHandler(site, point) {
    let siteCenter = this.viewport.siteDisplayCenter(site);
    let siteSize = site.size(this.viewport.scale());
    let siteRadius = this.viewport.withScale(this.settings.radius);
    let radius = this.viewport.withScale(20);
    let center = siteCenter.shift(new Offset(-siteSize.halfWidth() + 1.5 * siteRadius, -siteSize.halfHeight() + 1.5 * siteRadius));
    return center.distanceTo(point) <= radius;
  }

  isPointInResizeHandler(site, point) {
    let siteCenter = this.viewport.siteDisplayCenter(site);
    let siteSize = site.size(this.viewport.scale());

    let handlerSize = new Size(this.viewport.withScale(5), this.viewport.withScale(50));

    let rightPoint = siteCenter.shift(new Offset(siteSize.halfWidth() - handlerSize.width, - handlerSize.halfHeight()));
    let leftPoint = siteCenter.shift(new Offset(-siteSize.halfWidth(), - handlerSize.halfHeight()));
    let topPoint = siteCenter.shift(new Offset(- handlerSize.swap().halfWidth(), - siteSize.halfHeight()));
    let bottomPoint = siteCenter.shift(new Offset(- handlerSize.swap().halfWidth(), siteSize.halfHeight() - handlerSize.swap().height));

    if (Bounds.fromTopLeft(rightPoint, handlerSize).in(point, false)) {
      return 'right';
    } else if (Bounds.fromTopLeft(leftPoint, handlerSize).in(point, false)) {
      return 'left';
    } else if (Bounds.fromTopLeft(topPoint, handlerSize.swap()).in(point, false)) {
      return 'top';
    } else if (Bounds.fromTopLeft(bottomPoint, handlerSize.swap()).in(point, false)) {
      return 'bottom';
    } else {
      return null;
    }
  }

  moveHandler(siteCenter, siteSize, siteRadius, style) {
    let radius = this.viewport.withScale(20);
    let center = siteCenter.shift(new Offset(-siteSize.halfWidth() + 1.5 * siteRadius, -siteSize.halfHeight() + 1.5 * siteRadius));
    this.ioCanvas.circle(center, radius, style);
    let arrowStyle = {lineWidth: this.viewport.withScale(2), strokeStyle: '#FFFFFF', lineCap: 'round'};
    let sOffset = this.viewport.withScale(5);
    let eOffset = this.viewport.withScale(15);
    let arrowLen = this.viewport.withScale(7);
    this.ioCanvas.arrowHead(center.shift(new Offset(sOffset, 0)), center.shift(new Offset(eOffset, 0)), arrowLen, arrowStyle);
    this.ioCanvas.arrowHead(center.shift(new Offset(-sOffset, 0)), center.shift(new Offset(-eOffset, 0)), arrowLen, arrowStyle);
    this.ioCanvas.arrowHead(center.shift(new Offset(0, sOffset)), center.shift(new Offset(0, eOffset)), arrowLen, arrowStyle);
    this.ioCanvas.arrowHead(center.shift(new Offset(0, -sOffset)), center.shift(new Offset(0, -eOffset)), arrowLen, arrowStyle);
    this.ioCanvas.circle(center, this.viewport.withScale(3), {lineWidth: this.viewport.withScale(0.3), strokeStyle: '#FFFFFF'});
  }

  rightResizeHandler(siteCenter, siteSize, handlerSize, style) {
    let rightPoint = siteCenter.shift(new Offset(siteSize.halfWidth() - handlerSize.width, - handlerSize.halfHeight()));
    this.ioCanvas.rectangle(rightPoint, handlerSize.width, handlerSize.height, style);
  }

  leftResizeHandler(siteCenter, siteSize, handlerSize, style) {
    let leftPoint = siteCenter.shift(new Offset(-siteSize.halfWidth(), - handlerSize.halfHeight()));
    this.ioCanvas.rectangle(leftPoint, handlerSize.width, handlerSize.height, style);
  }

  topResizeHandler(siteCenter, siteSize, handlerSize, style) {
    let topPoint = siteCenter.shift(new Offset(- handlerSize.halfWidth(), - siteSize.halfHeight()));
    this.ioCanvas.rectangle(topPoint, handlerSize.width, handlerSize.height, style);
  }

  bottomResizeHandler(siteCenter, siteSize, handlerSize, style) {
    let bottomPoint = siteCenter.shift(new Offset(- handlerSize.halfWidth(), siteSize.halfHeight() - handlerSize.height));
    this.ioCanvas.rectangle(bottomPoint, handlerSize.width, handlerSize.height, style);
  }
};
