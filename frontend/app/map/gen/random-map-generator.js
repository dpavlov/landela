import Map from '../../map/map';
import Node from '../../map/node';
import Site from '../../map/site';
import Port from '../../map/port';
import Link from '../../map/link';

import PortsPositions from '../../map/ports-positions';

import Point from '../../geometry/point';
import ErdosRenyi from './erdos-renyi'

export default class RandomMapGenerator {
  static generate(bounds, nodesCount, linkProbability) {
    let g = ErdosRenyi.np(nodesCount, linkProbability);
    let nodes = {};

    g.nodes.forEach(n => nodes[n.id] = RandomMapGenerator.node(n.id, bounds));
    let links = g.edges.map(l => {
      let sNode = nodes[l.source];
      let eNode = nodes[l.target];
      let sPortId = sNode.id + '-p-' + RandomMapGenerator.number(1, 100);
      let ePortId = eNode.id + '-p-' + RandomMapGenerator.number(1, 100);

      var positions = new PortsPositions(sNode, eNode).onLine();

      let sPort = new Port(sPortId, 'port', positions.sp);
  		let ePort = new Port(ePortId, 'port', positions.ep);
      sNode.attachPort(sPort);
      eNode.attachPort(ePort);

      return new Link(sNode.id + '-' + eNode.id, sPort, ePort, positions.slc, positions.elc);
    });

    return new Map('m1', 'Network',
		  [],
      Object.keys(nodes).map(k => nodes[k]),
      links
    );
  }

  static node(id, bounds) {
    let name = RandomMapGenerator.name(id);
    let type = RandomMapGenerator.type();
    let pos = Point.random(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    return new Node(id, name, type, pos);
  }

  static name(id) {
    return id + '.example.com';
  }

  static type() {
    return ['router','switch','host','notebook','firewall','database','basestation'][RandomMapGenerator.number(0, 6)];
  }

  static number(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}
