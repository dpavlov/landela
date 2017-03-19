import Map from '../map';
import Site from '../site';
import Node from '../node';
import Id from '../id';

import Point from '../../geometry/point';

export default class EmptyMapGenerator {
  static generate(layer) {
    if (layer === 'equipments') {
      return new Map('equipments', 'Equipments',
  		[
        new Site(Id.one(), 'Landela Site', 'Landela Location', new Point(0, 0), 250, 250).attachNodes([
          new Node(Id.zero(), 'landela', 'control-center', new Point(0, 0))
        ])
  		],
      [
  		],
      [
  		]);
    } else if (layer === 'sites') {
      return new Map('sites', 'Sites',
    		[],
        [
          new Node(Id.generate(), 'site', 'site', new Point(0, 0))
        ],
        []
      );
    } else if (layer === 'cities') {
      return new Map('cities', 'Cities',
    		[],
        [
          new Node(Id.generate(), 'city', 'small-city', new Point(0, 0))
        ],
        []
      );
    }
  }
}
