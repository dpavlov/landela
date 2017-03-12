import Map from '../map';
import Node from '../node';
import Site from '../site';
import Port from '../port';
import Link from '../link';

import Point from '../../geometry/point';

export default class SimpleMapGenerator {
  static generate() {

    let sPort = new Port('11', 'port-1', new Point(50, 50));
		let ePort = new Port('41', 'port-1', new Point(-50, -50));

    return new Map('m1', 'Network',
		[
			new Site('1', 'Unated States Of America, New York, 2079 Hart Country Lane', new Point(650, 500), 300, 400).attachNodes([
				new Node('12', 'r1.example.com', 'router', new Point(0, 0))
			]),
			new Site('2', '1783 Romrog Way', new Point(-500, 350), 300, 250).attachNodes([
				new Node('21', 'r2.example.com', 'router', new Point(50, 50))
			])
		], [
			new Node('1', 'r3.example.com', 'router', new Point(100, 100)).attachPorts(
				[
					sPort,
					new Port('12', 'port-2', new Point(-50, -50))
				]
			),
			new Node('2', 'r4.example.com', 'router', new Point(100, 300)),
			new Node('3', 'r5.example.com', 'router', new Point(350, 100)),
			new Node('4', 'r6.example.com', 'router', new Point(400, 400)).attachPorts([
				new Port('42', 'port-2', new Point(50, 50)),
				ePort
			])
		], [
			new Link('l1', sPort, ePort, new Point(50, 50), new Point(-50, -50))
		]);
  }
}
