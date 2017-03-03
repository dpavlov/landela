export default class Map {
    constructor(id, name, sites, nodes, links) {
        this.id = id;
        this.name = name;
        this.sites = sites;
        this.nodes = nodes;
        this.links = links;
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
