import Size from '../geometry/size';
import Offset from '../geometry/offset';
export default class IOCanvas {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.lineDefaultStyle = { lineWidth: 1, strokeStyle: '#000000', lineCap: 'butt' };
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
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  size() {
    return new Size(this.canvas.width, this.canvas.height);
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
    this.ctx.lineWidth = compiledStyle.lineWidth;
    this.ctx.strokeStyle = compiledStyle.strokeStyle;
    this.ctx.lineCap = compiledStyle.lineCap;
    this.ctx.beginPath();
    this.ctx.moveTo(sPoint.x, sPoint.y);
    this.ctx.lineTo(ePoint.x, ePoint.y);
    this.ctx.stroke();
  }
  bezier(sPoint, ePoint, c1Point, c2Point, style) {
    let compiledStyle = Object.assign(this.lineDefaultStyle, style || {})
    this.ctx.lineWidth = compiledStyle.lineWidth;
    this.ctx.strokeStyle = compiledStyle.strokeStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(sPoint.x, sPoint.y);
    this.ctx.bezierCurveTo(c1Point.x, c1Point.y, c2Point.x, c2Point.y, ePoint.x, ePoint.y);
    this.ctx.stroke();
  }
  rectangle(top, w, h, style) {
    let _style = style || {};
    let compiledStyle = Object.assign(this.rectangleDefaultStyle, _style)
    if (_style.strokeStyle) {
      this.ctx.beginPath();
      this.ctx.lineWidth = compiledStyle.lineWidth;
      this.ctx.strokeStyle = compiledStyle.strokeStyle;
      this.ctx.rect(top.x, top.y, w, h);
      this.ctx.stroke();
    }
    if (_style.fillStyle) {
      this.ctx.lineWidth = compiledStyle.lineWidth;
      this.ctx.strokeStyle = compiledStyle.strokeStyle;
      this.ctx.fillStyle = compiledStyle.fillStyle;
      this.ctx.fillRect(top.x, top.y, w, h);
    }
  }
  roundedRectangle(top, width, height, radius, style) {
    let _style = style || {};
    let compiledStyle = Object.assign(this.rectangleDefaultStyle, _style)
    let r = {tl: radius || 5, tr: radius || 5, br: radius || 5, bl: radius || 5};
    if (_style.fillStyle) {
      this.ctx.fillStyle = compiledStyle.fillStyle;
    }
    if (_style.strokeStyle) {
      this.ctx.lineWidth = compiledStyle.lineWidth;
      this.ctx.strokeStyle = compiledStyle.strokeStyle;
    }
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
      this.ctx.fill();
    }
    if (_style.strokeStyle) {
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
  textLines(text, font, maxWidth, lineHeight) {
    var lines = text.split("\n"), actual = [], maxLineWidth = 0;
    for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
        var line = '';
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this.measureText(font, testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                let lineMetrics = this.measureText(font, line)
                maxLineWidth = lineMetrics.width > maxLineWidth ? lineMetrics.width : maxLineWidth;
                actual.push({text: line, offset: new Offset(0, lineHeight * actual.length)});
                line = words[n] + ' ';
            }
            else {
                line = testLine;
            }
        }
        actual.push({text: line, offset: new Offset(0, lineHeight * actual.length)});
        let lineMetrics = this.measureText(font, line)
        maxLineWidth = lineMetrics.width > maxLineWidth ? lineMetrics.width : maxLineWidth;
    }
    return { lines: actual, maxLineWidth: maxLineWidth };
  }
  circle(center, radius, style) {
    let _style = style || {};
    let compiledStyle = Object.assign(this.lineDefaultStyle, style || {})
    if (_style.fillStyle) {
      this.ctx.fillStyle = compiledStyle.fillStyle;
    }
    if (_style.strokeStyle) {
      this.ctx.lineWidth = compiledStyle.lineWidth;
      this.ctx.strokeStyle = compiledStyle.strokeStyle;
    }
    this.ctx.beginPath();
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    if (_style.fillStyle) {
      this.ctx.fill();
    }
    if (_style.strokeStyle) {
      this.ctx.stroke();
    }
  }
  arrowHead(from, to, len, style) {
    let compiledStyle = Object.assign(this.lineDefaultStyle, style || {})
    var angle = Math.atan2(to.y - from.y, to.x - from.x);
    this.ctx.beginPath();
    this.ctx.lineWidth = compiledStyle.lineWidth;
    this.ctx.strokeStyle = compiledStyle.strokeStyle;
    this.ctx.lineCap = compiledStyle.lineCap;
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(to.x - len * Math.cos(angle - Math.PI / 4), to.y - len * Math.sin(angle - Math.PI / 4));
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(to.x - len * Math.cos(angle + Math.PI / 4), to.y - len * Math.sin(angle + Math.PI / 4));
    this.ctx.stroke();
  }
}
