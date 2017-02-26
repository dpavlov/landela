import Port from './port';

export default class Node {
    constructor(id, name, type, center) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.center = center;
        this.state = NodeState.NORMAL;
        this.ports = [];
    }
    withPorts(ports) {
      this.ports = this.ports.concat(ports.map(function(p) {
        return new Port(p.id, p.name, p.center, this)
      }.bind(this)));
      return this;
    }
    bounds(size) {
      let nSize = size || [128, 128];
			return { x: this.center.x - nSize[0]/2, y: this.center.y - nSize[1] / 2, width: nSize[0], height: nSize[1] };
    }
    isSelected() {
      return this.state === NodeState.SELECTED;
    }
    select() {
      this.state = NodeState.SELECTED;
    }
    deselect() {
      this.state = NodeState.NORMAL;
    }
    move(offset) {
      this.center = this.center.shift(offset.yInverse());
    }
};

export class NodeState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
