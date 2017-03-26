import Point from '../geometry/point';
import Observable from '../utils/observable';
export default class Link extends Observable {
  constructor(id, sPort, ePort, slcCenter, elcCenter) {
    super();
    this.id = id;
    this.sPort = sPort;
    this.ePort = ePort;
    this.lineType = LineType.BEZIER;
    this.controlPoints = [new LinkControl(sPort, slcCenter), new LinkControl(ePort, elcCenter)];
    this.state = LinkState.NORMAL;
  }
  sControlPoint() {
    return this.controlPoints[0];
  }
  eControlPoint() {
    return this.controlPoints[this.controlPoints.length - 1];
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

export class LineType {
  static BEZIER = 0
  static SEGMENTS = 1
}

export class LinkState {
  static NORMAL = 0
  static SELECTED = 1
}
