import PortsPositions from '../../map/ports-positions';

import Port from '../../map/port';
import Link from '../../map/link';
import Id from '../../map/id';

export default class LinksBuilder {
	constructor(viewport) {
      this.viewport = viewport;
  }
  build(linksType, nodes) {
    let result = { links: [], ports: [] };
    if (nodes.length > 1) {
			if (linksType === "point-to-point") {
        this.buildLine(result, nodes);
			} else if (linksType === "point-to-multipoint") {
        this.buildTree(result, nodes);
			} else if (linksType === "ring") {
        this.buildRing(result, nodes);
			}
		}
    return result;
  }

  buildLine(result, nodes) {
    var from = nodes[0];
    for (var i = 1; i < nodes.length; i++) {
      var to = nodes[i];

      let sPortId = Id.generate();
      let ePortId = Id.generate();

      var positions = new PortsPositions(this.viewport.nodeDisplayCenter(from), this.viewport.nodeDisplayCenter(to)).onLine();

      let sPort = new Port(sPortId, 'port', positions.sp);
      let ePort = new Port(ePortId, 'port', positions.ep);
      from.attachPort(sPort);
      to.attachPort(ePort);

      let link = new Link(Id.generate(), sPort, ePort, positions.slc, positions.elc);

      result.links.push(link);
      result.ports.push(sPort);
      result.ports.push(ePort);

      from = to;
    }
  }

  buildTree(result, nodes) {
    var from = nodes[0];
    for (var i = 1; i < nodes.length; i++) {
      var to = nodes[i];

      let sPortId = Id.generate();
      let ePortId = Id.generate();

      var positions = new PortsPositions(this.viewport.nodeDisplayCenter(from), this.viewport.nodeDisplayCenter(to)).onLine();

      let sPort = new Port(sPortId, 'port', positions.sp);
      let ePort = new Port(ePortId, 'port', positions.ep);
      from.attachPort(sPort);
      to.attachPort(ePort);

      let link = new Link(Id.generate(), sPort, ePort, positions.slc, positions.elc);

      result.links.push(link);
      result.ports.push(sPort);
      result.ports.push(ePort);
    }
  }

  buildRing(result, nodes) {
    var from = nodes[0];
    let ring = [ ... nodes, from];
    for (var i = 1; i < ring.length; i++) {
      var to = ring[i];

      let sPortId = Id.generate();
      let ePortId = Id.generate();

      var positions = new PortsPositions(this.viewport.nodeDisplayCenter(from), this.viewport.nodeDisplayCenter(to)).onLine();

      let sPort = new Port(sPortId, 'port', positions.sp);
      let ePort = new Port(ePortId, 'port', positions.ep);
      from.attachPort(sPort);
      to.attachPort(ePort);

      let link = new Link(Id.generate(), sPort, ePort, positions.slc, positions.elc);

      result.links.push(link);
      result.ports.push(sPort);
      result.ports.push(ePort);

      from = to;
    }
  }
}
