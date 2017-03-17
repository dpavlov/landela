import Observable from '../utils/observable';
import { SITE_CREATED, NODE_CREATED, LINK_CREATED, NODE_MOVED } from './events/event-types';

export default class Map extends Observable {
  constructor(id, name, sites, nodes, links) {
    super();
    this.id = id;
    this.name = name;
    this.sites = this.subscribeAll(this, sites);
    this.nodes = this.subscribeAll(this, nodes);
    this.links = this.subscribeAll(this, links);
    this._version = 0;
  }
  version(v) {
    this._version = v;
  }
  onEvent = (obj, ...args) => this.notify(obj, ...args);
  addSites(sites, silent = false) {
    for (var i = 0; i < sites.length; i ++) {
      sites[i].subscribe(this);
      this.sites.push(sites[i]);
      if (!silent) {
        this.notify(sites[i], SITE_CREATED);
      }
    }
  }
  addNodes(nodes, silent = false) {
    for (var i = 0; i < nodes.length; i ++) {
      nodes[i].subscribe(this);
      this.nodes.push(nodes[i]);
      if (!silent) {
        this.notify(nodes[i], NODE_CREATED);
      }
    }
  }
  attachNode(site, node, silent = false) {
    node.center = node.center.subtract(site.center);
    site.attachNode(node, silent);
    let index = this.nodes.indexOf(node);
    if (index >= 0) {
      node.unsubscribe(this);
      this.nodes.splice(index, 1);
    }
  }
  dettachNode(site, node, silent = false) {
    node.center = node.center.add(site.center);
    site.dettachNode(node, silent);
    this.addNodes([node], true);
  }
  addLinks(links, silent = false) {
    for (var i = 0; i < links.length; i ++) {
      links[i].subscribe(this);
      this.links.push(links[i]);
      if (!silent) {
        this.notify(links[i], LINK_CREATED);
      }
    }
  }
  ports() {
    let ports = [];
    for (var nIndex = 0; nIndex < this.nodes.length; nIndex ++) {
      let node = this.nodes[nIndex];
      for (var pIndex = 0; pIndex < node.ports.length; pIndex ++) {
        ports.push(node.ports[pIndex]);
      }
    }
    return ports;
  }
  siteNodes() {
    let nodes = [];
    for (var sIndex = 0; sIndex < this.sites.length; sIndex ++) {
      let site = this.sites[sIndex];
      for (var nIndex = 0; nIndex < site.nodes.length; nIndex ++) {
        nodes.push(site.nodes[nIndex]);
      }
    }
    return nodes;
  }
  linkControls() {
    let controls = [];
    for (var lIndex = 0; lIndex < this.links.length; lIndex ++) {
      let link = this.links[lIndex];
      controls.push(link.sControlPoint);
      controls.push(link.eControlPoint);
    }
    return controls;
  }
};
