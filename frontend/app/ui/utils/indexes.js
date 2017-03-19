import Point from '../../geometry/point';
import Bezier from '../../utils/bezier';

import Node from '../../map/node';
import Site from '../../map/site';
import Port from '../../map/port';
import Link from '../../map/link';
import LinkControl from '../../map/link';

import CoordinateIndex from '../../map/indexes/coordinate-index';

export default class Indexes {
	constructor(viewport, network, icons) {

    this.sites = new CoordinateIndex(network.sites, site => site.bounds());

    let allNodes = network.nodes.concat(network.siteNodes());
    this.nodes = new CoordinateIndex(allNodes, node => node.bounds(icons.sizeFor(node)));

    let allPorts = network.ports();
    this.ports = new CoordinateIndex(allPorts, port => port.bounds());

    this.links = new CoordinateIndex(network.links, link => {
      let sPortCenter = viewport.portDisplayCenter(link.sPort);
      let ePortCenter = viewport.portDisplayCenter(link.ePort);
      let cp1 = new Point(sPortCenter.x + link.sControlPoint.center.x, sPortCenter.y - link.sControlPoint.center.y);
      let cp2 = new Point(ePortCenter.x + link.eControlPoint.center.x, ePortCenter.y - link.eControlPoint.center.y);
      let curve = new Bezier(sPortCenter, cp1, cp2, ePortCenter);
      return curve.bounds();
    }, (point, link) => {
      let sPortCenter = viewport.portDisplayCenter(link.sPort);
      let ePortCenter = viewport.portDisplayCenter(link.ePort);
      let cp1 = new Point(sPortCenter.x + link.sControlPoint.center.x, sPortCenter.y - link.sControlPoint.center.y);
      let cp2 = new Point(ePortCenter.x + link.eControlPoint.center.x, ePortCenter.y - link.eControlPoint.center.y);
      let curve = new Bezier(sPortCenter, cp1, cp2, ePortCenter);
      var p = curve.project(point);
      return Math.abs(p.x - point.x) < 5 && Math.abs(p.y - point.y) < 5;
    });

    let allLinkControls = network.linkControls();
    this.linkControls = new CoordinateIndex(allLinkControls, control => {
      var portCenter = control.port.absCenter();
      let wControlPoint = 10;
      let hControlPoint = 10;
      return {
        x: portCenter.x + control.center.x - wControlPoint / 2,
        y: portCenter.y + control.center.y - hControlPoint / 2,
        width: wControlPoint,
        height: hControlPoint
      };
    });
	}
  update(target) {
		this.remove(target);
    if (target instanceof Node) {
      this.nodes.insert(target);
    } else if (target instanceof Site) {
      this.sites.insert(target);
    }
  }
	remove(target) {
		if (target instanceof Node) {
			this.nodes.remove(target);
		} else if (target instanceof Site) {
			this.sites.remove(target);
		}
	}
	addLinks(links) {
		for (var i = 0; i < links.length; i ++) {
			this.links.insert(links[i]);
			this.linkControls.insert(links[i].sControlPoint);
			this.linkControls.insert(links[i].eControlPoint);
		}
	}
	addPorts(ports) {
		for (var i = 0; i < ports.length; i ++) {
			this.ports.insert(ports[i]);
		}
	}f
	findSiteByPoint(point) {
		return this.sites.find(point);
	}
	bounds() {
		let b = [this.sites.bounds, this.nodes.bounds];
		let area = { xMin: Number.MAX_VALUE, yMin: Number.MAX_VALUE, xMax: Number.MIN_VALUE, yMax: Number.MIN_VALUE };
		for (var i = 0; i < b.length; i++) {
			if (area.xMin > b[i].x) area.xMin = b[i].x;
			if (area.yMin > b[i].y) area.yMin = b[i].y;
			if (area.xMax < b[i].x + b[i].width) area.xMax = b[i].x + b[i].width;
			if (area.yMax < b[i].y + b[i].height) area.yMax = b[i].y + b[i].height;
		}
		return { x: area.xMin, y: area.yMin, width: area.xMax - area.xMin, height: area.yMax - area.yMin };
	}
	visit(visitor) {
		this.sites.visit(visitor);
		this.nodes.visit(visitor);
		this.ports.visit(visitor);
		this.links.visit(visitor);
		this.linkControls.visit(visitor);
	}
  findByPoint(point) {
    let linkControl = this.linkControls.find(point.real);
		if (linkControl) {
			return linkControl;
		} else {
      let port = this.ports.find(point.real);
      if (port) {
        return port;
      } else {
        let node = this.nodes.find(point.real);
        if (node) {
          return node;
        } else {
          let link = this.links.find(point.disp);
          if (link) {
            return link;
          } else {
            let site = this.sites.find(point.real);
            if (site) {
              return site;
            } else {
              return null;
            }
          }
        }
      }
  	}
  }
}
