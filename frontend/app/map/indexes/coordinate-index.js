import Quadtree from '../../utils/quadtree';

export default class CoordinateIndex {
	constructor(objs, boundsLookupFn, checkIntersectionFn) {
		let bounds = this._bounds(objs, boundsLookupFn);
		this.quadtree = new Quadtree(bounds, boundsLookupFn, checkIntersectionFn);
		for (var index = 0; index < objs.length; index ++) {
			this.quadtree.insert(objs[index]);
		}
		console.log(bounds);
		this.bounds = bounds;
	}
	_bounds(objs, boundsLookupFn) {
		let area = { xMin: Number.MAX_VALUE, yMin: Number.MAX_VALUE, xMax: Number.MIN_VALUE, yMax: Number.MIN_VALUE };
		for (var index = 0; index < objs.length; index ++) {
			let objBounds = boundsLookupFn(objs[index]);
			if (area.xMin > objBounds.x) {
				area.xMin = objBounds.x;
			}
			if (area.yMin > objBounds.y - objBounds.height) {
				area.yMin = objBounds.y - objBounds.height;
			}
			if (area.xMax < objBounds.x + objBounds.width) {
				area.xMax = objBounds.x + objBounds.width;
			}
			if (area.yMax < objBounds.y) {
				area.yMax = objBounds.y;
			}
		}
		return { x: area.xMin, y: area.yMax, width: area.xMax - area.xMin, height: area.yMax - area.yMin };
	}
	_updateBounds(obj) {
		let objBounds = this.quadtree.boundsLookupFn(obj);
		if (this.bounds.x > objBounds.x) {
			this.bounds.x = objBounds.x;
		}
		if (this.bounds.y < objBounds.y) {
			this.bounds.y = objBounds.y;
		}
		if (this.bounds.x - this.bounds.width > objBounds.x - objBounds.width) {
			this.bounds.width = objBounds.x - (objBounds.x - objBounds.width);
		}
		if (this.bounds.y - this.bounds.height > objBounds.y - objBounds.height) {
			this.bounds.height = objBounds.y - (objBounds.y - objBounds.height);
		}
	}
	visit(visitor) {
		this.quadtree.visit(visitor);
	}
	insert(obj) {
		this._updateBounds(obj);
		return this.quadtree.insert(obj);
	}
	remove(obj) {
		return this.quadtree.remove(obj);
	}
	find(point) {
		return this.quadtree.find(point);
	}
}
