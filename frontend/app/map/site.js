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
			return { x: this.center.x - this.width / 2, y: this.center.y - this.height / 2, width: this.width, height: this.height };
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
