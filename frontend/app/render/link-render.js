export default class LinkRender {
  constructor(settings, viewport, ctx) {
    this.settings = settings;
    this.ctx = ctx;
    this.viewport = viewport;
  }
  render(link) {
      let sPortCenter = this.viewport.portDisplayCenter(link.sPort);
      let ePortCenter = this.viewport.portDisplayCenter(link.ePort);
      let scpCenter = link.sControlPoint.center.withMultiplier(this.viewport.scale());
      let ecpCenter = link.eControlPoint.center.withMultiplier(this.viewport.scale());
      this.curve(
        link.isSelected(),
        sPortCenter.x, sPortCenter.y,
        ePortCenter.x, ePortCenter.y,
        scpCenter.x, scpCenter.y,
        ecpCenter.x, ecpCenter.y
      );
      if (link.isSelected()) {
        let wControlPoint = this.viewport.withScale(10);
        let hControlPoint = this.viewport.withScale(10);
        this.line(sPortCenter.x, sPortCenter.y, sPortCenter.x + scpCenter.x, sPortCenter.y - scpCenter.y);
        this.rectangle(sPortCenter.x + scpCenter.x - wControlPoint / 2, sPortCenter.y - scpCenter.y - hControlPoint / 2, wControlPoint, hControlPoint);
        this.line(ePortCenter.x, ePortCenter.y, ePortCenter.x + ecpCenter.x, ePortCenter.y - ecpCenter.y);
        this.rectangle(ePortCenter.x + ecpCenter.x - wControlPoint / 2, ePortCenter.y - ecpCenter.y - hControlPoint / 2, wControlPoint, hControlPoint);
      }
  }
  rectangle(x, y, w, h) {
    this.ctx.fillStyle = "#222222";
    this.ctx.fillRect(x, y, w, h);
  }
  line(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#000000';
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
  }
  curve(isSelected, x1, y1, x2, y2, cpx1, cpy1, cpx2, cpy2) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = isSelected ? 'yellow' : '#c0e2f7';
      this.ctx.moveTo(x1, y1);
      this.ctx.bezierCurveTo(x1 + cpx1, y1 - cpy1, x2 + cpx2, y2 - cpy2, x2, y2);
      this.ctx.stroke();
  }
};
