import Node from './node';
import Site from './site';

import Observable from '../utils/observable';

import { SITE_CREATED, SITE_REMOVED, NODE_CREATED, LINK_CREATED, NODE_MOVED, NODE_REMOVED } from './events/event-types';

export default class Layer extends Observable {
  constructor(id, name, sites = [], nodes = [], links = []) {
    super();
    this.id = id;
    this.name = name;
    this.upLayer = null
    this.downLayer = null;
    this.sites = this.subscribeAll(this, sites);
    this.nodes = this.subscribeAll(this, nodes);
    this.links = this.subscribeAll(this, links);
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
    var ports = [];
    for (var nIndex = 0; nIndex < this.nodes.length; nIndex ++) {
      let node = this.nodes[nIndex];
      for (var pIndex = 0; pIndex < node.ports.length; pIndex ++) {
        ports.push(node.ports[pIndex]);
      }
    }
    for (var sIndex = 0; sIndex < this.sites.length; sIndex ++) {
      let site = this.sites[sIndex];
      ports = ports.concat(site.ports());
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
      for (var cpIndex = 0; cpIndex < this.links.controlPoints; cpIndex ++)
      controls.push(this.links.controlPoints[cpIndex]);
    }
    return controls;
  }
  remove(target, silent = false) {
    if (target instanceof Node) {
      if (target.site) {
        target.site.removeNode(target, silent);
      } else {
        let index = this.nodes.indexOf(target);
        if (index >= 0) {
          target.unsubscribe(this);
          this.nodes.splice(index, 1);
          if (!silent) {
            this.notify(target, NODE_REMOVED);
          }
        }
      }
    } else if (target instanceof Site) {
      let index = this.sites.indexOf(target);
      if (index >= 0) {
        target.removeNodes();
        target.unsubscribe(this);
        this.sites.splice(index, 1);
        if (!silent) {
          this.notify(target, SITE_REMOVED);
        }
      }
    }
  }
};
