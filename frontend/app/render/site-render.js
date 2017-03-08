import Offset from '../geometry/offset';
import Point from '../geometry/point';

export default class SiteRender {
  constructor(settings, viewport, ctx, nodeRender) {
    this.settings = settings;
    this.ctx = ctx;
    this.viewport = viewport;
    this.nodeRender = nodeRender;
  }
  render(site) {
    var siteCenter = this.viewport.siteDisplayCenter(site);
    let w = this.viewport.withScale(site.width);
    let h = this.viewport.withScale(site.height);
    this.roundRect(siteCenter.x - w / 2, siteCenter.y - h / 2, w, h, this.viewport.withScale(20));
    this.text(site.name, new Point(siteCenter.x - w / 2 + this.viewport.withScale(20), siteCenter.y + h / 2 - this.viewport.withScale(10)));
    for (var iNode = 0; iNode < site.nodes.length; iNode++) {
        var node = site.nodes[iNode];
        this.nodeRender.render(node);
    }

  }
  text(t, s) {
    this.ctx.font= this.viewport.withScale(16) + "px Times";
    this.ctx.fillStyle = "#c0e2f7";
    this.ctx.textAlign="left";
    this.ctx.fillText(t, s.x, s.y);
  }
  roundRect(x, y, width, height, r) {
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
    this.ctx.strokeStyle = '#c0e2f7';
    this.ctx.stroke();
  }
};
