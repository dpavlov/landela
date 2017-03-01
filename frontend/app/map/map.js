export default class Map {
    constructor(id, name, sites, nodes) {
        this.id = id;
        this.name = name;
        this.sites = sites;
        this.nodes = nodes;
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
};
