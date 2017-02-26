export default class NodeSet {
    constructor(nodes) {
        this._nodes = nodes || [];
    }
    add(node) {
      if (!(node.id in this._nodes)) {
        this._nodes[node.id] = node;
      }
    }
    nodes() {
      return Object.keys(this._nodes).map((k) => { return this._nodes[k]; });
    }
    remove(node) {
      delete this._nodes[node.id];
    }
};
