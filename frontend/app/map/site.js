import Bounds from '../geometry/bounds';
import Size from '../geometry/size';

import Observable from '../utils/observable';
import { SITE_MOVED, SITE_RESIZED, NODE_MOVED } from './events/event-types';

export default class Site extends Observable {
  constructor(id, name, center, width, height) {
    super();
    this.id = id;
    this.name = name;
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
  attachNode(node) {
    node.attachSite(this);
    this.nodes.push(node);
    node.subscribe(this);
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
};

export class SiteState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
