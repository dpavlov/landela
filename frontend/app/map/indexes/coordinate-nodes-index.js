import Quadtree from '../../utils/quadtree';

export default class CoordinateNodesIndex {
	constructor(map) {
		let bounds = this._bounds(map);
		this.quadtree = new Quadtree(bounds);
		for (var index = 0; index < map.nodes.length; index ++) {
			this.quadtree.insert(map.nodes[index]);
		}
	}
	_bounds(map) {
		let area = { xMin: Number.MAX_VALUE, yMin: Number.MAX_VALUE, xMax: Number.MIN_VALUE, yMax: Number.MIN_VALUE };
		for (var index = 0; index < map.nodes.length; index ++) {
			if (area.xMin > map.nodes[index].center.x) {
				area.xMin = map.nodes[index].center.x;
			}
			if (area.yMin > map.nodes[index].center.y) {
				area.yMin = map.nodes[index].center.y;
			}
			if (area.xMax < map.nodes[index].center.x) {
				area.xMax = map.nodes[index].center.x;
			}
			if (area.yMax < map.nodes[index].center.y) {
				area.yMax = map.nodes[index].center.y;
			}
		}
		return { x: area.xMin, y: area.yMin, width: area.xMax - area.xMin, height: area.yMax - area.yMin };
	}
	find(point, scale) {
		return this.quadtree.find(point, scale);
	}
}
