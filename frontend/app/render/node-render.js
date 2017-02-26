import Offset from '../geometry/offset';

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

      this.text(node.name, nodeCenter.shift(new Offset(0, scaledHeight / 2 + 5)))

    	for (var iNodePort = 0; iNodePort < node.ports.length; iNodePort++) {
          var port = node.ports[iNodePort];
          var portCenter = this.viewport.portDisplayCenter(node, port);
          this.circle(portCenter, this.viewport.withScale(5));
      }

    }
    _selectIcon(node) {
      if (node.isSelected()) {
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
    circle(center, radius) {
    	this.ctx.beginPath();
      	this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
      	this.ctx.lineWidth = 1;
      	this.ctx.strokeStyle = '#c0e2f7';
      	this.ctx.stroke();
    }
    text(t, s) {
    	this.ctx.font= this.viewport.withScale(16) + "px Tahoma";
    	this.ctx.fillStyle = "#c0e2f7";
      this.ctx.textAlign="center";
    	this.ctx.fillText(t, s.x, s.y);
    }
};
