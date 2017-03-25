import Map from '../../map/map';
import Layer from '../../map/layer';
import Site from '../../map/site';
import Node from '../../map/node';
import Link, { LinkControl } from '../../map/link';
import Port from '../../map/port';
import { SITE_CREATED, SITE_REMOVED, SITE_MOVED, SITE_RESIZED, SITE_NAME_CHANGED, SITE_ADDRESS_CHANGED } from '../../map/events/event-types';
import { NODE_DETTACHED, NODE_ATTACHED, NODE_CREATED, NODE_MOVED, NODE_REMOVED, NODE_NAME_CHANGED, NODE_TYPE_CHANGED } from '../../map/events/event-types';
import { PORT_CREATED, LINK_CREATED } from '../../map/events/event-types';

import Point from '../../geometry/point';
export default class MapUpdater {
  constructor(map) {
    this.map = map;
  }
  update(event) {
    console.log(JSON.stringify(event));
    if (event.ts > this.map._version) {
      let layer = event.path[0];
      let { parent,  target } = this.findTargetByPath(this.map, [... event.path]);
      if (Symbol.for(event.type) === SITE_CREATED) {
        let sCenter = new Point(event.args.center.x, event.args.center.y);
        let site = new Site(event.args.id, event.args.name, event.args.address, sCenter, event.args.width, event.args.height);
        this.map.layer(layer).addSites([site], true);
      } else if (Symbol.for(event.type) === SITE_NAME_CHANGED) {
        target.name = event.args;
      } else if (Symbol.for(event.type) === SITE_ADDRESS_CHANGED) {
        target.address = event.args;
      } else if (Symbol.for(event.type) === SITE_REMOVED) {
        this.map.layer(layer).remove(target, true);
      } else if (Symbol.for(event.type) === SITE_MOVED) {
        target.center = new Point(event.args.x, event.args.y);
      } else if (Symbol.for(event.type) === SITE_RESIZED) {
        target.center = new Point(event.args.center.x, event.args.center.y);
        target.width = event.args.width;
        target.height = event.args.height;
      } else if (Symbol.for(event.type) === NODE_ATTACHED) {
        let siteResult = this.findTargetByPath(this.map, [... event.args.site]);
        let nodeResult = this.findTargetByPath(this.map, [... event.args.node]);
        this.map.layer(layer).attachNode(siteResult.target, nodeResult.target, true);
      } else if (Symbol.for(event.type) === NODE_DETTACHED) {
        let siteResult = this.findTargetByPath(this.map, [... event.args.site]);
        let nodeResult = this.findTargetByPath(this.map, [... event.args.node]);
        this.map.layer(layer).dettachNode(siteResult.target, nodeResult.target, true);
      } else if (Symbol.for(event.type) === NODE_CREATED) {
        let nCenter = new Point(event.args.center.x, event.args.center.y);
        let node = new Node(event.args.id, event.args.name, event.args.type, nCenter);
        this.map.layer(layer).addNodes([node], true);
      } else if (Symbol.for(event.type) === NODE_NAME_CHANGED) {
        target.name = event.args;
      } else if (Symbol.for(event.type) === NODE_TYPE_CHANGED) {
        target.type = event.args;
      } else if (Symbol.for(event.type) === NODE_REMOVED) {
        this.map.layer(layer).remove(target, true);
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
        this.map.layer(layer).addLinks([link], true);
      }
    }
    return this.map;
  }
  findTargetByPath(map, path) {
    var childId = path[0];
    path.splice(0, 1);
    let children = this.children(map);
    return this.findChildren(childId, children, path, map);
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
      return obj.layers();
    } else if (obj instanceof Layer) {
      return [... obj.nodes, ...obj.sites, ...obj.links];
    } else if (obj instanceof Site) {
      return obj.nodes;
    } else if (obj instanceof Node) {
      return obj.ports;
    } else if (obj instanceof Link) {
      return [obj.sControlPoint, obj.eControlPoint];
    }
  }
}
