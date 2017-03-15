import Circle from '../geometry/circle';

export default class PortsPositions {
  constructor(sNodeCenter, eNodeCenter) {
    this.sNodeCenter = sNodeCenter;
    this.eNodeCenter = eNodeCenter;
  }

  onLine(viewport) {
    let sNodePortsOrbit = new Circle(this.sNodeCenter, 60);
    let eNodePortsOrbit = new Circle(this.eNodeCenter, 60);

    let sLinkControlOrbit = new Circle(this.sNodeCenter, 120);
    let eLinkControlOrbit = new Circle(this.eNodeCenter, 120);

    let sPortPosition = sNodePortsOrbit.pointOn(sNodePortsOrbit.angleTo(this.eNodeCenter));
    let ePortPosition = eNodePortsOrbit.pointOn(eNodePortsOrbit.angleTo(this.sNodeCenter));

    let sLinkControlPosition = sLinkControlOrbit.pointOn(sLinkControlOrbit.angleTo(this.eNodeCenter));
    let eLinkControlPosition = eLinkControlOrbit.pointOn(eLinkControlOrbit.angleTo(this.sNodeCenter));

    return {
      sp: sPortPosition.yInverse(),
      ep: ePortPosition.yInverse(),
      slc: sLinkControlPosition.yInverse(),
      elc: eLinkControlPosition.yInverse()
    };
  }

}
