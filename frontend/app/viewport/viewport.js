import Point from '../geometry/point';
import Offset from '../geometry/offset';
import CoordinateSystem from '../geometry/coordinate-system';

export default class Viewport {
    constructor(width, height) {
    	this._scale = 1.0;
    	this._offset = new Offset(0, 0);
      this.width = width;
      this.height = height;
      this.onZoomHandlers = [];
      this.coordinateSystem = new CoordinateSystem(width / 2, height / 2);
    }
    bounds() { return { width: this.width, height: this.height }; }
    offset() { return this._offset; }
    scale() { return this._scale; }
    state() { return { bounds: this.bounds(), scale: this.scale(), offset: this.offset() }; }
    isScaleInRange(range) { return range[0] <= this._scale && range[1] >= this._scale; }
    subscribe(handler) {
      this.onZoomHandlers.push(handler);
    }
    unSubscribe(handler) {
      var index = this.onZoomHandlers.indexOf(handler);
      if (index > -1) {
          this.onZoomHandlers.splice(index, 1);
      }
    }
    _fireEvent(scale, offset, bounds) {
      for(var index = 0; index < this.onZoomHandlers.length; index ++) {
        this.onZoomHandlers[index].call(window, scale, offset, bounds);
      }
    }
    zoom(delta) {
    	this._scale = this._scale + delta;

    	var screenCenter = new Point(this.width / 2, this.height / 2);

    	var screenCenterBeforeScale = this.coordinateSystem.realCoordinates(screenCenter);

    	this.coordinateSystem.scale(this._scale);

    	var screenCenterAfterScale = this.coordinateSystem.realCoordinates(screenCenter)

    	var screenCenterDelta = screenCenterBeforeScale.subtract(screenCenterAfterScale);

    	this.move(new Offset(-screenCenterDelta.x, screenCenterDelta.y).withMultiplier(this._scale));

      this._fireEvent(this._scale, this._offset, this.bounds());
    }
    up(delta) {
    	this.move(new Offset(0, delta));
    }
    down(delta) {
    	this.move(new Offset(0, -delta));
    }
    left(delta) {
        this.move(new Offset(delta, 0));
    }
    right(delta) {
    	this.move(new Offset(-delta, 0));
    }
    move(offset) {
    	this._offset = this._offset.add(offset);
    	this.coordinateSystem.offset(this._offset);
    	this._fireEvent(this._scale, this._offset, this.bounds());
    }
    moveTo(center) {
      this._offset = new Offset(center.x * this._scale, center.y * this._scale);
      this.coordinateSystem.offset(this._offset);
      this._fireEvent(this._scale, this._offset, this.bounds());
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
		    this.coordinateSystem.center(width / 2, height / 2);
        this._fireEvent(this._scale, this._offset, this.bounds());
    }
    toRealPosition(point) {
      return this.coordinateSystem.realCoordinates(point);
    }
    toDispPosition(point) {
      return this.coordinateSystem.displayCoordinates(point);
    }
    siteDisplayCenter(site) {
      return this.coordinateSystem.displayCoordinates(site.center);
    }
    nodeDisplayCenter(node) {
      if (node.site) {
        let siteCoordinateSystem = new CoordinateSystem(node.site.center.x, node.site.center.y, this.coordinateSystem);
        return siteCoordinateSystem.displayCoordinates(node.center);
      } else {
        return this.coordinateSystem.displayCoordinates(node.center);
      }
    }
    nodeDisplayBounds(node) {
      let center = this.nodeDisplayCenter(node);
      return { x: center.x - this.withScale(64), y: center.y - this.withScale(64), width: this.withScale(128), height: this.withScale(128) };
    }
    portDisplayCenter(port) {
      if (port.node.site) {
        let siteCoordinateSystem = new CoordinateSystem(port.node.site.center.x, port.node.site.center.y, this.coordinateSystem);
        let nodeCoordinateSystem = new CoordinateSystem(port.node.center.x, port.node.center.y, siteCoordinateSystem);
        return nodeCoordinateSystem.displayCoordinates(port.center);
      } else {
        let nodeCoordinateSystem = new CoordinateSystem(port.node.center.x, port.node.center.y, this.coordinateSystem);
        return nodeCoordinateSystem.displayCoordinates(port.center);
      }
    }
    withScale(value) {
      return this.coordinateSystem.withScale(value);
    }
    scaledImageSize(image, imageScale) {
      return {
        scaledWidth: this.withScale(image.width) * (imageScale || 1),
        scaledHeight: this.withScale(image.height) * (imageScale || 1),
      }
    }
};
