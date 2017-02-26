import Point from './point';
import Offset from './offset';

export default class CoordinateSystem {
    constructor(xCenter, yCenter, parent) {
    	this.parent = parent;
    	this._offset = new Offset(0, 0);
    	this._children = [];

    	if (parent) parent.child(this);

      this.center(xCenter, yCenter);
      this._scale = parent ? parent.withScale(1.0) : 1.0;
    }
    child(cs) {
    	this._children.push(cs);
    }
    offset(newOffset) {
        this._offset = newOffset;
    }
    center(xCenter, yCenter) {
    	this.zero = new Point(xCenter, yCenter);
    }
    scale(newScale) {
    	this._upScale(newScale);
	    this._downScale(newScale);
    }
    _upScale(newScale) {
    	this._scale = newScale;
	   	if (this.parent) this.parent._upScale(newScale);
    }
    _downScale(newScale) {
    	this._scale = newScale;
	    for (var i = 0; i < this._children.length; i++) {
	    	this._children[i]._downScale(newScale);
	    }
    }
    withScale(v) { return v * this._scale }
    displayCoordinates(real) {
    	if (this.parent) {
    		var newZero = this.parent.displayCoordinates(this.zero);
    		return new Point(newZero.x + real.x * this._scale, newZero.y - real.y * this._scale).shift(this._offset);
    	} else {
    		return new Point(this.zero.x + real.x * this._scale, this.zero.y - real.y * this._scale).shift(this._offset);
    	}
    }
    realCoordinates(disp) {
    	var scaleDown = 1 / this._scale;
    	if (this.parent) {
    		var newZero = this.parent.realCoordinates(this.zero);
    		return new Point((disp.x - newZero.x) * scaleDown, (newZero.y - disp.y) * scaleDown).shift(this._offset.xInverse().withMultiplier(scaleDown));
    	} else {
    		return new Point((disp.x - this.zero.x) * scaleDown, (this.zero.y - disp.y) * scaleDown).shift(this._offset.xInverse().withMultiplier(scaleDown));
    	}
    }
};
