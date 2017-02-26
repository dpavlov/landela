export default class Node {
    constructor(id, name, type, center, ports) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.center = center;
        this.state = NodeState.NORMAL;
        this.ports = ports ? ports : [];
    }
    isSelected() {
      return this.state === NodeState.SELECTED;
    }
    select() {
      this.state = NodeState.SELECTED;
    }
    deselect() {
      this.state = NodeState.NORMAL;
    }
};

export class NodeState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
