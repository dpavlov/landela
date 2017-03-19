import { SITE_CREATED, SITE_MOVED, SITE_RESIZED, SITE_REMOVED, SITE_NAME_CHANGED, SITE_ADDRESS_CHANGED } from '../../map/events/event-types';
import { NODE_ATTACHED, NODE_DETTACHED, NODE_CREATED, NODE_MOVED, NODE_REMOVED } from '../../map/events/event-types';
import { PORT_CREATED, LINK_CREATED } from '../../map/events/event-types';

export default class EventsFactory {
  static create(args) {
    let map = args[0];
    let eventType = args[args.length - 1];
    let target = args[args.length - 2];
		let path = args.splice(0, args.length - 1).map(t => t.id);
    let event = { ts: new Date().getTime(), type: Symbol.keyFor(eventType), path: path };
    if (eventType === SITE_CREATED) {
      return { ... event, args: {
        id: target.id,
        name: target.name,
        address: target.address,
        center: target.center.copy(),
        width: target.width,
        height: target.height
      } };
    } else if (eventType === SITE_REMOVED) {
      return { ... event, args: [map.id, target.id]};
    } else if (eventType === SITE_NAME_CHANGED) {
      return { ... event, args: target.name };
    } else if (eventType === SITE_ADDRESS_CHANGED) {
      return { ... event, args: target.address};
    } else if (eventType === SITE_MOVED) {
      return {  ... event, args: target.center.copy() };
    } else if (eventType === SITE_RESIZED) {
      return {  ... event, args: {center: target.center.copy(), width: target.width, height: target.height } };
    } else if (eventType === NODE_ATTACHED) {
      return {  ... event, args: { site: [map.id, target.site.id], node: [map.id, target.id] } };
    } else if (eventType === NODE_DETTACHED) {
      return {  ... event, args: { site: [map.id, target.site.id], node: [map.id, target.site.id, target.id] } };
    } else if (eventType === NODE_CREATED) {
      return {  ... event, args: {
        id: target.id,
        name: target.name,
        type: target.type,
        center: target.center.copy(),
        site: target.site ? target.site.id : null,
        state: target.state
      } };
    } else if (eventType === NODE_REMOVED) {
      return { ... event, args: target.site ? [map.id, target.site.id, target.id] : [map.id, target.id]};
    } else if (eventType === NODE_MOVED) {
      return {  ... event, args: target.center.copy() };
    } else if (eventType === PORT_CREATED) {
      return {  ... event, args: {
        id: target.id,
        name: target.name,
        center: target.center.copy(),
        node: target.node.id,
        state: target.state,
      } };
    } else if (eventType === LINK_CREATED) {
      return {  ... event, args: {
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
      return event;
    }
  }
}
