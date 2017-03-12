import Bounds from '../geometry/bounds';
import Size from '../geometry/size';

export default class Site {
    constructor(id, name, center, width, height) {
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
      return this;
    }
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
};

export class SiteState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
