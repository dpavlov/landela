export default class MapSet {
    constructor(sites, nodes, links, ports) {
      this._sites = sites || [];
      this._nodes = nodes || [];
      this._links = links || [];
      this._ports = ports || [];
    }
    site(site) {
      this._sites.push(site);
    }
    node(node) {
      this._nodes.push(node);
    }
    link(link) {
      this._links.push(link);
    }
    port(port) {
      this._nodes.push(port);
    }
    sites() {
      return this._sites;
    }
    nodes() {
      return this._nodes;
    }
    links() {
      return this._links;
    }
    ports() {
      return this._ports;
    }
    hasNodes() {
      return this._nodes.length !== 0;
    }
    cleanNodes() {
      return this._nodes = [];
    }
    hasAtLeastNNodes(n) {
      return this._nodes.length >= n;
    }
    hasMoreThenNNodes(n) {
      return this._nodes.length > n;
    }
    isEmpty() {
      return this._sites.length === 0 && this._nodes.length === 0 && this._links.length === 0 && this._ports.length === 0;
    }
    removeSite(site) {
      let index = this._sites.indexOf(site);
      if (index > -1) {
        this._sites.splice(index, 1);
      }
    }
    removeNode(node) {
      let index = this._nodes.indexOf(node);
      if (index > -1) {
        this._nodes.splice(index, 1);
      }
    }
    removeLink(link) {
      let index = this._links.indexOf(link);
      if (index > -1) {
        this._links.splice(index, 1);
      }
    }
    removePort(port) {
      let index = this._ports.indexOf(port);
      if (index > -1) {
        this._ports.splice(index, 1);
      }
    }
};
