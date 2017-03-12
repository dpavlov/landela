import Offset from '../geometry/offset';
import Point from '../geometry/point';

import Animation from '../utils/animation';

export default class NodeRender {
  constructor(viewport, ioCanvas, icons, portRender) {
    this.viewport = viewport;
    this.ioCanvas = ioCanvas;
    this.icons = icons;
    this.portRender = portRender;
  }
  render(node) {
    var nodeCenter = this.viewport.nodeDisplayCenter(node);

    let icon = this.icons.getIconFor(node);

    let { scaledWidth, scaledHeight } = this.viewport.scaledImageSize(icon.image, icon.rescale);

    let iconPoint = nodeCenter.shift(new Offset(- scaledWidth / 2, - scaledHeight / 2));

    this.ioCanvas.image(icon.image, iconPoint, scaledWidth, scaledHeight);
    this.label(node, nodeCenter, scaledWidth, scaledHeight);

    if (node.isSelected()) {
      let halfWidth = scaledWidth / 2;
      let halfHeight = scaledHeight / 2;
      let sUnderlinePoint = nodeCenter.shift(new Offset(- halfWidth, halfHeight));
      let eUnderlinePoint = nodeCenter.shift(new Offset(halfWidth, halfHeight))
      let underlineStyle = { lineWidth: 3, strokeStyle: 'yellow' };
      this.ioCanvas.line(sUnderlinePoint, eUnderlinePoint, underlineStyle);
    }

    for (var iNodePort = 0; iNodePort < node.ports.length; iNodePort++) {
      var port = node.ports[iNodePort];
      this.portRender.render(port);
    }
  }

  label(node, nodeCenter, scaledWidth, scaledHeight) {
    let labelStyle = {
      font: this.viewport.withScale(16) + "px Times",
      fillStyle: "#c0e2f7",
      textAlign: "center"
    };
    if (node.type === 'small-network') {
      this.ioCanvas.text(node.name, nodeCenter, { ... labelStyle,  fillStyle: "#9c27b0"});
    } else {
      let labelPoint = nodeCenter.shift(new Offset(0, scaledHeight / 2 + this.viewport.withScale(15)));
      this.ioCanvas.text(node.name, labelPoint, labelStyle)
    }
  }
};
