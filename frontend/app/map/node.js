import Port from './port';
import Point from '../geometry/point';
import Observable from '../utils/observable';
import { NODE_MOVED, NODE_DETTACHED, PORT_CREATED, NODE_NAME_CHANGED, NODE_TYPE_CHANGED } from './events/event-types';

export default class Node extends Observable {
  constructor(id, name, type, center) {
    super();
    this.id = id;
    this.name = name;
    this.type = type;
    this.center = center;
    this.site = null;
    this.state = NodeState.NORMAL;
    this.ports = [];
  }
  onEvent = (obj, ...args) => this.notify(obj, ...args);
  attachPorts(ports) {
    ports.forEach(p => this.attachPort(p))
    return this;
  }
  attachPort(port, silent = false) {
    port.attachNode(this);
    this.ports.push(port);
    port.subscribe(this);
    if (!silent) {
      this.notify(port, PORT_CREATED);
    }
    return this;
  }
  attachSite(site) {
    this.site = site;
    return this;
  }
  isAttached() {
    return this.site !== null;
  }
  detach(silent = false) {
    if (!silent) {
      this.notify(this, NODE_DETTACHED);
    }
    this.site = null;
    return this;
  }
  bounds(size) {
    let nSize = size || [128, 128];
    if (this.site) {
      return { x: this.site.center.x + this.center.x - nSize[0]/2, y: this.site.center.y + this.center.y + nSize[1] / 2, width: nSize[0], height: nSize[1] };
    } else {
      return { x: this.center.x - nSize[0]/2, y: this.center.y + nSize[1] / 2, width: nSize[0], height: nSize[1] };
    }
  }
  absCenter() {
    return this.site ? this.site.center.add(this.center) : this.center;
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
  moveTo(x, y) {
    this.center = new Point(x, y);
  }
  moved() {
    this.notify(NODE_MOVED);
  }
  changed(propName, oldValue) {
    if (propName === 'name') {
      this.notify(NODE_NAME_CHANGED);
    }
    if (propName === 'type') {
      this.notify(NODE_TYPE_CHANGED);
    }
  }
};

export class NodeState {
  static NORMAL = 0
  static SELECTED = 1
}
