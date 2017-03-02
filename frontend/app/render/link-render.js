export default class LinkRender {
  constructor(settings, viewport, ctx) {
    this.settings = settings;
    this.ctx = ctx;
    this.viewport = viewport;
  }
  render(link) {
      var sPortCenter = this.viewport.portDisplayCenter(link.sPort);
      var ePortCenter = this.viewport.portDisplayCenter(link.ePort);
      this.line(sPortCenter.x, sPortCenter.y, ePortCenter.x, ePortCenter.y);
  }

  line(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#c0e2f7';
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
  }
};
