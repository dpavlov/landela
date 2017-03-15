export default class Port {
    constructor(id, name, center) {
        this.id = id;
        this.name = name;
        this.center = center;
        this.node = null;
        this.state = PortState.NORMAL;
    }
    attachNode(node) {
      this.node = node;
      return this;
    }
    bounds(size) {
      let center = this.absCenter();
      let nSize = size || [14, 14];
			return { x: center.x - nSize[0]/2, y: center.y - nSize[1] / 2, width: nSize[0], height: nSize[1] };
    }
    absCenter() {
      return this.node.site
        ? this.node.site.center.add(this.node.center.add(this.center))
        : this.node.center.add(this.center);
    }
    isSelected() {
      return this.state === PortState.SELECTED;
    }
    select() {
      this.state = PortState.SELECTED;
    }
    deselect() {
      this.state = PortState.NORMAL;
    }
    move(offset) {
      this.center = this.center.shift(offset.yInverse());
    }
};

export class PortState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
