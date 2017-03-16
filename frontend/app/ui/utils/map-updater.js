import Map from '../../map/map';
import Site from '../../map/site';
import Node from '../../map/node';
import Link, { LinkControl } from '../../map/link';
import Port from '../../map/port';
import { SITE_CREATED, SITE_MOVED, NODE_CREATED, NODE_MOVED, PORT_CREATED, LINK_CREATED } from '../../map/events/event-types';
import Point from '../../geometry/point';
export default class MapUpdater {
  constructor(map) {
    this.map = map;
  }
  update(event) {
    if (event.ts > this.map._version) {
      let { parent,  target } = this.findTargetByPath(this.map, [... event.path]);
      if (Symbol.for(event.type) === SITE_CREATED) {
        let sCenter = new Point(event.args.center.x, event.args.center.y);
        let site = new Site(event.args.id, event.args.name, sCenter, event.args.width, event.args.height);
        this.map.addSites([site], true);
      } else if (Symbol.for(event.type) === SITE_MOVED) {
        target.center = new Point(event.args.x, event.args.y);
      } else if (Symbol.for(event.type) === NODE_CREATED) {
        let nCenter = new Point(event.args.center.x, event.args.center.y);
        let node = new Node(event.args.id, event.args.name, event.args.type, nCenter);
        this.map.addNodes([node], true);
      } else if (Symbol.for(event.type) === NODE_MOVED) {
        target.center = new Point(event.args.x, event.args.y);
      } else if (Symbol.for(event.type) === PORT_CREATED) {
        let port = new Port(event.args.id, event.args.name, new Point(event.args.center.x, event.args.center.y));
        parent.attachPort(port, true);
      } else if (Symbol.for(event.type) === LINK_CREATED) {
        let sPortResult = this.findTargetByPath(this.map, [... event.args.sPort]);
        let ePortResult = this.findTargetByPath(this.map, [... event.args.ePort]);
        let scp = new Point(event.args.sControlPoint.x, event.args.sControlPoint.y);
        let ecp = new Point(event.args.eControlPoint.x, event.args.eControlPoint.y);
        let link = new Link(event.args.id, sPortResult.target, ePortResult.target, scp, ecp);
        this.map.addLinks([link], true);
      }
    }
    return this.map;
  }
  findTargetByPath(current, path) {
    if (current.id === path[0]) {
      if (path.length === 1) {
        return { parent: null, target: current }
      } else {
        var childId = path[1];
        path.splice(0, 2);
        let children = this.children(current);
        return this.findChildren(childId, children, path, current);
      }
    } else {
      return {parent: null, target: null};
    }
  }

  findChildren(currentId, children, path, parent) {
    for (var index = 0; index < children.length; index ++) {
      if (children[index].id === currentId) {
        if (path.length === 0) {
          return {parent: parent, target: children[index]};
        } else {
          let childId = path[0];
          path.splice(0, 1);
          return this.findChildren(childId, this.children(children[index]), path, children[index])
        }
      }
    }
    return {parent: parent, target: null};
  }

  children(obj) {
    if (obj instanceof Map) {
      return [...obj.nodes, ...obj.sites, ...obj.links];
    } else if (obj instanceof Site) {
      return obj.nodes;
    } else if (obj instanceof Node) {
      return obj.ports;
    } else if (obj instanceof Link) {
      return [obj.sControlPoint, obj.eControlPoint];
    }
  }
}
