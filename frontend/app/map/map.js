export default class Map {
    constructor(id, name, nodes) {
        this.id = id;
        this.name = name;
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
};
