import Quadtree from '../../utils/quadtree';

export default class CoordinateIndex {
	constructor(objs, boundsLookupFn, checkIntersectionFn) {
		let bounds = this._bounds(objs, boundsLookupFn);
		this.quadtree = new Quadtree(bounds, boundsLookupFn, checkIntersectionFn);
		for (var index = 0; index < objs.length; index ++) {
			this.quadtree.insert(objs[index]);
		}
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
			if (area.xMax < objBounds.x) {
				area.xMax = objBounds.x;
			}
			if (area.yMax < objBounds.y) {
				area.yMax = objBounds.y;
			}
		}
		return { x: area.xMin, y: area.yMin, width: area.xMax - area.xMin, height: area.yMax - area.yMin };
	}
	find(point) {
		return this.quadtree.find(point);
	}
}
