export default class IOCanvas {
  constructor(ctx) {
    this.ctx = ctx;
    this.lineDefaultStyle = { lineWidth: 1, strokeStyle: '#000000' };
    this.textDefaultStyle = {
      font: "16 px Tahoma",
      textAlign: "left",
      fillStyle: "rgba(255,255,255, 1)"
    };
    this.rectangleDefaultStyle = {
      lineWidth: 1,
      strokeStyle: '#ffffff',
      fillStyle: 'rgba(0,0,0, 1)'
    };
  }
  text(_text, sPoint, style) {
    let compiledStyle = Object.assign(this.textDefaultStyle, style || {})
    this.ctx.textAlign = compiledStyle.textAlign;
    this.ctx.font = compiledStyle.font;
    this.ctx.fillStyle = compiledStyle.fillStyle;
    this.ctx.fillText(_text, sPoint.x, sPoint.y);
  }
  line(sPoint, ePoint, style) {
    let compiledStyle = Object.assign(this.lineDefaultStyle, style || {})
    this.ctx.beginPath();
    this.ctx.moveTo(sPoint.x, sPoint.y);
    this.ctx.lineTo(ePoint.x, ePoint.y);
    this.ctx.lineWidth = compiledStyle.lineWidth;
    this.ctx.strokeStyle = compiledStyle.strokeStyle;
    this.ctx.stroke();
  }
  bezier(sPoint, ePoint, c1Point, c2Point, style) {
    let compiledStyle = Object.assign(this.lineDefaultStyle, style || {})
    this.ctx.beginPath();
    this.ctx.moveTo(sPoint.x, sPoint.y);
    this.ctx.bezierCurveTo(c1Point.x, c1Point.y, c2Point.x, c2Point.y, ePoint.x, ePoint.y);
    this.ctx.lineWidth = compiledStyle.lineWidth;
    this.ctx.strokeStyle = compiledStyle.strokeStyle;
    this.ctx.stroke();
  }
  rectangle(top, w, h, style) {
    let compiledStyle = Object.assign(this.rectangleDefaultStyle, style || {})
    this.ctx.fillStyle = compiledStyle.fillStyle;
    this.ctx.fillRect(top.x, top.y, w, h);
  }
  roundedRectangle(top, width, height, radius, style) {
    let _style = style || {};
    let compiledStyle = Object.assign(this.rectangleDefaultStyle, style || {})
    let r = {tl: radius || 5, tr: radius || 5, br: radius || 5, bl: radius || 5};
    this.ctx.beginPath();
    this.ctx.moveTo(top.x + r.tl, top.y);
    this.ctx.lineTo(top.x + width - r.tr, top.y);
    this.ctx.quadraticCurveTo(top.x + width, top.y, top.x + width, top.y + r.tr);
    this.ctx.lineTo(top.x + width, top.y + height - r.br);
    this.ctx.quadraticCurveTo(top.x + width, top.y + height, top.x + width - r.br, top.y + height);
    this.ctx.lineTo(top.x + r.bl, top.y + height);
    this.ctx.quadraticCurveTo(top.x, top.y + height, top.x, top.y + height - r.bl);
    this.ctx.lineTo(top.x, top.y + r.tl);
    this.ctx.quadraticCurveTo(top.x, top.y, top.x + r.tl, top.y);
    this.ctx.closePath();
    if (_style.fillStyle) {
      this.ctx.fillStyle = compiledStyle.fillStyle;
      this.ctx.fill();
    }
    if (_style.strokeStyle) {
      this.ctx.lineWidth = compiledStyle.lineWidth;
      this.ctx.strokeStyle = compiledStyle.strokeStyle;
      this.ctx.stroke();
    }
  }
  image(src, top, width, height) {
    this.ctx.drawImage(src, top.x, top.y, width, height);
  }
  measureText(font, text) {
    let origin = this.ctx.font;
    this.ctx.font = font;
    let m = this.ctx.measureText(text);
    this.ctx.font = origin;
    return m;
  }
}
