import Point from '../geometry/point';
import Observable from '../utils/observable';
export default class Link extends Observable {
  constructor(id, sPort, ePort, slcCenter, elcCenter) {
    super();
    this.id = id;
    this.sPort = sPort;
    this.ePort = ePort;
    this.sControlPoint = new LinkControl(sPort, slcCenter);
    this.eControlPoint = new LinkControl(ePort, elcCenter);
    this.state = LinkState.NORMAL;
  }
  isSelected() {
    return this.state === LinkState.SELECTED;
  }
  select() {
    this.state = LinkState.SELECTED;
  }
  deselect() {
    this.state = LinkState.NORMAL;
  }
};

export class LinkControl {
  constructor(port, center) {
    this.port = port;
    this.center = center;
  }
  move(offset) {
    this.center = this.center.shift(offset.yInverse());
  }
}

export class LinkState {
  static NORMAL = 0
  static SELECTED = 1
}
