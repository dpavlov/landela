import Map from '../map';
import Layer from '../layer';
import Site from '../site';
import Node from '../node';
import Id from '../id';

import Point from '../../geometry/point';

export default class EmptyMapGenerator {
  static generate() {
    let l1 = new Layer('equipments', 'Equipments', [
      new Site(Id.one(), 'Landela Site', 'Landela Location', new Point(0, 0), 250, 250).attachNodes([
        new Node(Id.zero(), 'landela', 'control-center', new Point(0, 0))
      ])
    ]);
    let l2 = new Layer('sites', 'Sites', [],
      [
        new Node(Id.one(), 'site', 'site', new Point(0, 0))
      ]
    );
    let l3 = new Layer('cities', 'Cities', [],
      [
        new Node(Id.generate(), 'city', 'small-city', new Point(0, 0))
      ]
    );

    l1.upLayer = l2;
    l2.downLayer = l1;
    l2.upLayer = l3;
    l3.downLayer = l2;

    return new Map([l3, l2, l1]);
  }
}
