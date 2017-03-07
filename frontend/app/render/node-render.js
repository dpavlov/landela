import Offset from '../geometry/offset';
import Point from '../geometry/point';

import Animation from '../utils/animation';

export default class NodeRender {
  constructor(viewport, ctx, icons) {
    this.ctx = ctx;
    this.icons = icons;
    this.viewport = viewport;
  }
  render(node) {
    var nodeCenter = this.viewport.nodeDisplayCenter(node);

    let icon = this._selectIcon(node);

    let { scaledWidth, scaledHeight } = this.viewport.scaledImageSize(icon.image, icon.rescale);

    this.ctx.drawImage(icon.image, nodeCenter.x - scaledWidth / 2, nodeCenter.y - scaledHeight / 2, scaledWidth, scaledHeight);

    this.text(node.name, nodeCenter.shift(new Offset(0, scaledHeight / 2 + this.viewport.withScale(15))))

    for (var iNodePort = 0; iNodePort < node.ports.length; iNodePort++) {
      var port = node.ports[iNodePort];
      var portCenter = this.viewport.portDisplayCenter(port);
      let pSide = this.viewport.withScale(14)
      this.roundRect(port, portCenter.x - pSide / 2, portCenter.y - pSide / 2, pSide, pSide, this.viewport.withScale(4));
    }

    if (node.isSelected()) {
      let halfWidth = scaledWidth / 2;
      let underlinePos = nodeCenter.add(new Point(0, halfWidth));
      this.line(
        underlinePos.subtract(new Point(halfWidth, 0)),
        underlinePos.add(new Point(halfWidth, 0))
      );
    }

  }
  animateNodeDeselect(node, update, done) {
    let nodeCenter = this.viewport.nodeDisplayCenter(node);
    let icon = this._selectIcon(node);
    let { scaledWidth, scaledHeight } = this.viewport.scaledImageSize(icon.image, icon.rescale);
    let halfWidth = scaledWidth / 2;
    let underlinePos = nodeCenter.add(new Point(0, scaledHeight / 2));
    this.line(
      underlinePos.subtract(new Point(halfWidth, 0)),
      underlinePos.add(new Point(halfWidth, 0))
    );
    Animation.animate(
      (progress) => {
        update();
        this.line(
          underlinePos.subtract(new Point(halfWidth * (1 - progress), 0)),
          underlinePos.add(new Point(halfWidth * (1 - progress), 0))
        );
      },
      500,
      done
    );
  }
  animateNodeSelect(node, update, done) {
    let nodeCenter = this.viewport.nodeDisplayCenter(node);
    let icon = this._selectIcon(node);
    let { scaledWidth, scaledHeight } = this.viewport.scaledImageSize(icon.image, icon.rescale);
    let halfWidth = scaledWidth / 2;
    let underlinePos = nodeCenter.add(new Point(0, scaledHeight / 2));
    this.line(underlinePos, underlinePos);
    Animation.animate(
      (progress) => {
        update();
        this.line(
          underlinePos.subtract(new Point(halfWidth * progress, 0)),
          underlinePos.add(new Point(halfWidth * progress, 0))
        );
      },
      500,
      done
    );
  }
  _selectIcon(node) {
    if (node.isSelected() && this.icons[node.type + ".selected"]) {
      return this._selectIconForCurrentScale(this.icons[node.type + ".selected"]);
    } else {
      return this._selectIconForCurrentScale(this.icons[node.type + ".normal"]);
    }
  }
  _selectIconForCurrentScale(icons) {
    let src = Object.keys(icons);
    for (var i = 0; i < src.length; i++) {
      let iconProps = icons[src[i]];
      if (this.viewport.isScaleInRange(iconProps.scaleRange)) {
        return iconProps;
      }
    }
    return icons[src[0]];
  }
  line(s, e) {
    this.ctx.beginPath();
    this.ctx.moveTo(s.x, s.y);
    this.ctx.lineTo(e.x, e.y);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'yellow';
    this.ctx.stroke();
  }
  text(t, s) {
    this.ctx.font= this.viewport.withScale(16) + "px Times";
    this.ctx.fillStyle = "#c0e2f7";
    this.ctx.textAlign="center";
    this.ctx.fillText(t, s.x, s.y);
  }
  roundRect(port, x, y, width, height, r) {
    let radius = {tl: r, tr: r, br: r, bl: r};
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius.tl, y);
    this.ctx.lineTo(x + width - radius.tr, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.ctx.lineTo(x + width, y + height - radius.br);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.ctx.lineTo(x + radius.bl, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.ctx.lineTo(x, y + radius.tl);
    this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    this.ctx.closePath();
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = port.isSelected() ? '#FFCC03' : '#000000';
    this.ctx.strokeStyle = port.isSelected() ? '#FFCC03' : '#c0e2f7';
    this.ctx.fill();
  }
};
