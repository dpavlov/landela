export default class LinkRender {
  constructor(settings, viewport, ctx) {
    this.settings = settings;
    this.ctx = ctx;
    this.viewport = viewport;
  }
  render(link) {
      var sPortCenter = this.viewport.portDisplayCenter(link.sPort);
      var ePortCenter = this.viewport.portDisplayCenter(link.ePort);
      this.curve(
        sPortCenter.x, sPortCenter.y,
        ePortCenter.x, ePortCenter.y,
        link.sControlPoint.x, link.sControlPoint.y,
        link.eControlPoint.x, link.eControlPoint.y
      );
      let wControlPoint = 10;
      let hControlPoint = 10;
      this.line(sPortCenter.x, sPortCenter.y, sPortCenter.x + link.sControlPoint.x, sPortCenter.y + link.sControlPoint.y);
      this.rectangle(sPortCenter.x + link.sControlPoint.x - wControlPoint / 2, sPortCenter.y + link.sControlPoint.y - hControlPoint / 2, wControlPoint, hControlPoint);
      this.line(ePortCenter.x, ePortCenter.y, ePortCenter.x + link.eControlPoint.x, ePortCenter.y + link.eControlPoint.y);
      this.rectangle(ePortCenter.x + link.eControlPoint.x - wControlPoint / 2, ePortCenter.y + link.eControlPoint.y - hControlPoint / 2, wControlPoint, hControlPoint);
  }
  rectangle(x, y, w, h) {
    this.ctx.fillStyle = "#222222";
    this.ctx.fillRect(x, y, w, h);
  }
  line(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#000000';
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
  }
  curve(x1, y1, x2, y2, cpx1, cpy1, cpx2, cpy2) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#c0e2f7';
      this.ctx.moveTo(x1, y1);
      this.ctx.bezierCurveTo(x1 + cpx1, y1 + cpy1, x2 + cpx2, y2 + cpy2, x2, y2);
      this.ctx.stroke();
  }
};
