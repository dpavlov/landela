export default class NodeTypes {
  constructor() {
    this.nodeTypes = {};
  }
  exists(name) {
    return name in this.nodeTypes;
  }
  lookup(name) {
    return this.nodeTypes[name];
  }
  add(nodeType) {
    this.nodeTypes[nodeType.name] = nodeType;
  }
  all() {
    return Object.keys(this.nodeTypes);
  }
}

export class NodeType {
  constructor(name, label, code, icons = {}) {
    this.name = name;
    this.label = label;
    this.code = code;
    this.icons = icons;
  }
  addIcon(src, image, rescale, range) {
    this.icons[src] = {image, rescale, range};
  }
}
