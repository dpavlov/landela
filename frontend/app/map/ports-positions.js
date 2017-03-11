import Circle from '../geometry/circle';

export default class PortsPositions {
  constructor(sNode, eNode) {
    this.sNode = sNode;
    this.eNode = eNode;
  }

  onLine() {
    let sNodePortsOrbit = new Circle(this.sNode.center, 60);
    let eNodePortsOrbit = new Circle(this.eNode.center, 60);

    let sLinkControlOrbit = new Circle(this.sNode.center, 120);
    let eLinkControlOrbit = new Circle(this.eNode.center, 120);

    let sPortPosition = sNodePortsOrbit.pointOn(sNodePortsOrbit.angleTo(this.eNode.center));
    let ePortPosition = eNodePortsOrbit.pointOn(eNodePortsOrbit.angleTo(this.sNode.center));

    let sLinkControlPosition = sLinkControlOrbit.pointOn(sLinkControlOrbit.angleTo(this.eNode.center));
    let eLinkControlPosition = eLinkControlOrbit.pointOn(eLinkControlOrbit.angleTo(this.sNode.center));

    return {
      sp: sPortPosition,
      ep: ePortPosition,
      slc: sLinkControlPosition,
      elc: eLinkControlPosition
    };
  }

}
