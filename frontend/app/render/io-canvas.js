export default class IOCanvas {
  constructor(ctx) {
    this.ctx = ctx;
  }
  text(_text, sPoint, font, align, color) {
    if (align) {
      this.ctx.textAlign = align;
    }
    if (font) {
      this.ctx.font = font;
    }
    if (color)  {
      this.ctx.fillStyle = color;
    }
    this.ctx.fillText(_text, sPoint.x, sPoint.y);
  }
  line(sPoint, ePoint, color) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(sPoint.x, sPoint.y);
    this.ctx.lineTo(ePoint.x, ePoint.y);
    if (color) {
      this.ctx.strokeStyle = color;
    }
    this.ctx.stroke();
  }
}
