import Bounds from '../geometry/bounds';
import Size from '../geometry/size';

import Observable from '../utils/observable';
import { SITE_MOVED, SITE_RESIZED, NODE_MOVED, NODE_ATTACHED, NODE_REMOVED, SITE_NAME_CHANGED, SITE_ADDRESS_CHANGED } from './events/event-types';

export default class Site extends Observable {
  constructor(id, name, address, center, width, height) {
    super();
    this.id = id;
    this.name = name;
    this.address = address;
    this.center = center;
    this.width = width;
    this.height = height;
    this.nodes = [];
    this.state = SiteState.NORMAL;
  }
  attachNodes(nodes) {
    nodes.forEach(n => this.attachNode(n))
    return this;
  }
  attachNode(node, silent = false) {
    if (!node.isAttached()) {
      node.attachSite(this);
      this.nodes.push(node);
      node.subscribe(this);
      if (!silent) {
        this.notify(node, NODE_ATTACHED);
      }
    }
    return this;
  }
  dettachNode(node, silent = false) {
    if (node.isAttached()) {
      node.detach(silent);
      let index = this.nodes.indexOf(node);
      if (index >= 0) {
        node.unsubscribe(this);
        this.nodes.splice(index, 1);
      }
    }
    return this;
  }
  removeNode(node, silent = false) {
    let index = this.nodes.indexOf(node);
    if (index >= 0) {
      node.unsubscribe(this);
      this.nodes.splice(index, 1);
      if (!silent) {
        this.notify(node, NODE_REMOVED);
      }
    }
  }
  removeNodes(silent = false) {
    [... this.nodes].forEach(n => this.removeNode(n, silent));
    return this;
  }
  onEvent = (obj, ...args) => this.notify(obj, ...args);
  bounds() {
    return Bounds.fromCenter(this.center, new Size(this.width, this.height));
  }
  size(mul) {
    return new Size(this.width * (mul || 1), this.height * (mul || 1));
  }
  isSelected() {
    return this.state === SiteState.SELECTED;
  }
  select() {
    this.state = SiteState.SELECTED;
  }
  deselect() {
    this.state = SiteState.NORMAL;
  }
  move(offset) {
    this.center = this.center.shift(offset.yInverse());
  }
  moved() {
    this.notify(SITE_MOVED);
  }
  resized() {
    this.notify(SITE_RESIZED);
    this.nodes.forEach(node => node.moved());
  }
  changed(propName, oldValue) {
    if (propName === 'name') {
      this.notify(SITE_NAME_CHANGED);
    } else if (propName === 'address') {
      this.notify(SITE_ADDRESS_CHANGED);
    }
  }
};

export class SiteState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
