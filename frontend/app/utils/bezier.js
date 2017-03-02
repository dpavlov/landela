export default class Bezier {
  constructor(p1, p2, p3, p4) {
    this.points = [p1, p2, p3, p4];
    this.order = this.points.length - 1;
    this.dims = ['x','y'];
    this.dimlen = this.dims.length;
    var a = this.align(this.points, { p1: this.points[0], p2: this.points[this.order] });
    this._linear = true;
    for(var i = 0; i < a.length; i++) {
      if(Math.abs(a[i].y) > 0.0001) {
        this._linear = false;
        break;
      }
    }
    this._t1 = 0;
    this._t2 = 1;
    this._lut = [];
    this.update();
  }
  update() {
    // one-time compute derivative coordinates
    this.dpoints = [];
    for(var p = this.points, d = p.length, c = d-1; d > 1; d--, c--) {
      var list = [];
      for(var j=0, dpt; j<c; j++) {
        dpt = {
          x: c * (p[j+1].x - p[j].x),
          y: c * (p[j+1].y - p[j].y)
        };
        list.push(dpt);
      }
      this.dpoints.push(list);
      p = list;
    };
    this.computedirection();
  }
  computedirection() {
    var points = this.points;
    var angle = this.angle(points[0], points[this.order], points[1]);
    this.clockwise = angle > 0;
  }
  compute(t) {
    if(t === 0) { return this.points[0]; }
    if(t === 1) { return this.points[this.order]; }

    var p = this.points;
    var mt = 1 - t;
    var mt2 = mt * mt,
        t2 = t * t,
        a = mt2 * mt,
        b = mt2 * t * 3,
        c = mt * t2 * 3,
        d = t * t2;
    return {
      x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
      y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y
    };
  }
  getLUT(steps) {
    steps = steps || 100;
    if (this._lut.length === steps) { return this._lut; }
    this._lut = [];
    for(var t = 0; t <= steps; t++) {
      this._lut.push(this.compute(t / steps));
    }
    return this._lut;
  }
  project(point) {
    var LUT = this.getLUT(), l = LUT.length-1,
        closest = this.closest(LUT, point),
        mdist = closest.mdist,
        mpos = closest.mpos;
    if (mpos === 0 || mpos === l) {
      var t = mpos / l, pt = this.compute(t);
      pt.t = t;
      pt.d = mdist;
      return pt;
    }
    var ft, t, p, d,
        t1 = (mpos - 1) / l,
        t2 = (mpos + 1) / l,
        step = 0.1 / l;
    mdist += 1;
    for(t = t1,ft = t; t < t2 + step; t += step) {
      p = this.compute(t);
      d = this.dist(point, p);
      if (d < mdist) {
        mdist = d;
        ft = t;
      }
    }
    p = this.compute(ft);
    p.t = ft;
    p.d = mdist;
    return p;
  }
  get(t) {
      return this.compute(t);
  }
  extrema() {
    var dims = this.dims,
        result = {},
        roots = [],
        p, mfn;
    dims.forEach(function(dim) {
        mfn = function(v) { return v[dim]; };
        p = this.dpoints[0].map(mfn);
        result[dim] = this.droots(p);
        if(this.order === 3) {
          p = this.dpoints[1].map(mfn);
          result[dim] = result[dim].concat(this.droots(p));
        }
        result[dim] = result[dim].filter(function(t) { return (t >= 0 && t <= 1); });
        roots = roots.concat(result[dim].sort());
    }.bind(this));
    roots = roots.sort().filter(function(v, idx) { return (roots.indexOf(v) === idx); });
    result.values = roots;
    return result;
  }
  bbox() {
      var extrema = this.extrema(), result = {};
      this.dims.forEach(function(d) {
        result[d] = this.minmax(d, extrema[d]);
      }.bind(this));
      return result;
  }
  bounds() {
    let bbox = this.bbox();
    return {
      x: bbox.x.min,
      y: bbox.y.max,
      width: bbox.x.max - bbox.x.min,
      height: bbox.y.max - bbox.y.min
    }
  }
  droots(p) {
      if (p.length === 3) {
        var a = p[0],
            b = p[1],
            c = p[2],
            d = a - 2 * b + c;
        if (d !== 0) {
          var m1 = - Math.sqrt(b * b - a * c),
              m2 = -a + b,
              v1 = -(m1 + m2) / d,
              v2 = -(-m1 + m2) / d;
          return [v1, v2];
        }
        else if(b !== c && d === 0) {
          return [(2 * b - c)/(2 * (b - c))];
        }
        return [];
      }
      if(p.length === 2) {
        var a = p[0], b = p[1];
        if(a !== b) {
          return [a / (a - b)];
        }
        return [];
      }
  }
  minmax(d, list) {
      if(!list) return { min:0, max:0 };
      var min = Number.MAX_SAFE_INTEGER, max = Number.MIN_SAFE_INTEGER, t, c;
      if(list.indexOf(0) === -1) { list = [0].concat(list); }
      if(list.indexOf(1) === -1) { list.push(1); }
      for(var i = 0, len = list.length; i < len; i++) {
        t = list[i];
        c = this.get(t);
        if(c[d] < min) { min = c[d]; }
        if(c[d] > max) { max = c[d]; }
      }
      return { min: min, mid: (min + max)/2, max: max, size: max - min };
  }
  angle(o, v1, v2) {
    var dx1 = v1.x - o.x,
        dy1 = v1.y - o.y,
        dx2 = v2.x - o.x,
        dy2 = v2.y - o.y,
        cross = dx1 * dy2 - dy1 * dx2,
        dot = dx1 * dx2 + dy1 * dy2;
    return Math.atan2(cross, dot);
  }
  align(points, line) {
    var tx = line.p1.x,
        ty = line.p1.y,
        a = - Math.atan2(line.p2.y - ty, line.p2.x - tx);
    return points.map(function(v){
      return {
        x: (v.x - tx) * Math.cos(a) - (v.y - ty) * Math.sin (a),
        y: (v.x - tx) * Math.sin(a) + (v.y - ty) * Math.cos (a)
      };
    });
  }
  closest(LUT, point) {
    var mdist = Math.pow(2,63), mpos, d;
    LUT.forEach(function(p, idx) {
      d = this.dist(point, p);
      if (d < mdist) {
        mdist = d;
        mpos = idx;
      }
    }.bind(this));
    return { mdist:mdist, mpos:mpos };
  }
  dist(p1, p2) {
    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
