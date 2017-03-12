import Point from './point';
export default class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  angleTo(point) {
     return Math.atan2(point.y - this.center.y, point.x - this.center.x);
  }
  pointOn(angle) {
    var x = 0 + this.radius * Math.cos(angle);
    var y = 0 + this.radius * Math.sin(angle);
    return new Point(x, y);
  }
  absPointsOn(total) {
    let points = [];
    let angle = 2 * Math.PI / total;
    for (var i = 0; i < total; i ++) {
      var x = this.center.x + this.radius * Math.cos(angle * i);
      var y = this.center.y + this.radius * Math.sin(angle * i);
      points.push(new Point(x, y));
    }
    return points;
  }
}
