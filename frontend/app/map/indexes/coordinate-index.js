import Quadtree from '../../utils/quadtree';

export default class CoordinateIndex {
	constructor(objs, boundsLookupFn, checkIntersectionFn) {
		let bounds = this._bounds(objs, boundsLookupFn);
		this.quadtree = new Quadtree(bounds, boundsLookupFn, checkIntersectionFn);
		for (var index = 0; index < objs.length; index ++) {
			this.quadtree.insert(objs[index]);
		}
		this.bounds = bounds;
	}
	_bounds(objs, boundsLookupFn) {
		let area = { xMin: Number.MAX_VALUE, yMin: Number.MAX_VALUE, xMax: Number.MIN_VALUE, yMax: Number.MIN_VALUE };
		for (var index = 0; index < objs.length; index ++) {
			let objBounds = boundsLookupFn(objs[index]);
			if (area.xMin > objBounds.x) {
				area.xMin = objBounds.x;
			}
			if (area.yMin > objBounds.y) {
				area.yMin = objBounds.y;
			}
			if (area.xMax < objBounds.x + objBounds.width) {
				area.xMax = objBounds.x + objBounds.width;
			}
			if (area.yMax < objBounds.y + objBounds.height) {
				area.yMax = objBounds.y + objBounds.height;
			}
		}
		return { x: area.xMin, y: area.yMin, width: area.xMax - area.xMin, height: area.yMax - area.yMin };
	}
	visit(visitor) {
		this.quadtree.visit(visitor);
	}
	insert(obj) {
		return this.quadtree.insert(obj);
	}
	remove(obj) {
		return this.quadtree.remove(obj);
	}
	find(point) {
		return this.quadtree.find(point);
	}
}
