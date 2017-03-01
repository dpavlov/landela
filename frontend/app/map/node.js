import Port from './port';

export default class Node {
    constructor(id, name, type, center) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.center = center;
        this.site = null;
        this.state = NodeState.NORMAL;
        this.ports = [];
    }
    attachPorts(ports) {
      ports.forEach(p => this.attachPort(p))
      this.ports = this.ports.concat(ports);
      return this;
    }
    attachPort(port) {
      port.attachNode(this);
      this.ports.push(port);
      return this;
    }
    attachSite(site) {
      this.site = site;
      return this;
    }
    bounds(size) {
      let nSize = size || [128, 128];
      if (this.site) {
           return { x: this.site.center.x + this.center.x - nSize[0]/2, y: this.site.center.y + this.center.y - nSize[1] / 2, width: nSize[0], height: nSize[1] };
      } else {
			     return { x: this.center.x - nSize[0]/2, y: this.center.y - nSize[1] / 2, width: nSize[0], height: nSize[1] };
      }
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
