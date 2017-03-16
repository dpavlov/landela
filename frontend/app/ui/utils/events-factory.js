import { SITE_CREATED, SITE_MOVED, NODE_CREATED, NODE_MOVED, PORT_CREATED, LINK_CREATED } from '../../map/events/event-types';

export default class EventsFactory {
  static create(args) {
    let map = args[0];
    let eventType = args[args.length - 1];
    let target = args[args.length - 2];
		let path = args.splice(0, args.length - 1).map(t => t.id);
    if (eventType === SITE_CREATED) {
      return {  ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path, args: {
        id: target.id,
        name: target.name,
        center: target.center.copy(),
        width: target.width,
        height: target.height
      } };
    } else if (eventType === SITE_MOVED) {
      return {  ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path, args: target.center.copy() };
    } else if (eventType === NODE_CREATED) {
      return {  ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path, args: {
        id: target.id,
        name: target.name,
        type: target.type,
        center: target.center.copy(),
        site: target.site ? target.site.id : null,
        state: target.state
      } };
    } else if (eventType === NODE_MOVED) {
      return {  ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path, args: target.center.copy() };
    } else if (eventType === PORT_CREATED) {
      return {  ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path, args: {
        id: target.id,
        name: target.name,
        center: target.center.copy(),
        node: target.node.id,
        state: target.state,
      } };
    } else if (eventType === LINK_CREATED) {
      return {  ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path, args: {
        id: target.id,
        sPort: target.sPort.node.site
          ? [map.id, target.sPort.node.site.id, target.sPort.node.id, target.sPort.id]
          : [map.id, target.sPort.node.id, target.sPort.id],
        ePort: target.ePort.node.site
          ? [map.id, target.ePort.node.site.id, target.ePort.node.id, target.ePort.id]
          : [map.id, target.ePort.node.id, target.ePort.id],
        sControlPoint: target.sControlPoint.center.copy(),
        eControlPoint: target.eControlPoint.center.copy(),
      } };
    } else {
      return { ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path };
    }
  }
}
