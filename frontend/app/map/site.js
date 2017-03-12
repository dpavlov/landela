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
    resize(direction, offset) {
      switch (direction) {
        case 'left':
          if(this.width - offset.xOffset >= 200) {
            let lDelta = offset.yReset().half();
            this.move(lDelta);
            this.modeNodes(lDelta);
            this.width = this.width - offset.xOffset;
          }
          break;
        case 'right':
          if(this.width + offset.xOffset >= 200) {
            let rDelta = offset.yReset().half();
            this.move(rDelta);
            this.modeNodes(rDelta);
            this.width = this.width + offset.xOffset;
          }
          break;
        case 'top':
          if(this.height - offset.yOffset >= 200) {
            let tDelta = offset.xReset().half();
            this.move(tDelta);
            this.modeNodes(tDelta);
            this.height = this.height - offset.yOffset;
          }
          break;
        case 'bottom':
          if(this.height + offset.yOffset >= 200) {
            let bDelta = offset.xReset().half();
            this.move(bDelta);
            this.modeNodes(bDelta);
            this.height = this.height + offset.yOffset;
          }
          break;
      }
    }
    modeNodes(offset) {
      for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].move(offset.inverse());
      }
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
