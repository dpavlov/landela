export default class Link {
    constructor(id, sPort, ePort) {
        this.id = id;
        this.sPort = sPort;
        this.ePort = ePort;
        this.state = LinkState.NORMAL;
    }
    isSelected() {
      return this.state === LinkState.SELECTED;
    }
    select() {
      this.state = LinkState.SELECTED;
    }
    deselect() {
      this.state = LinkState.NORMAL;
    }
};

export class LinkState {
  static NORMAL = {value: 0, name: "Normal", code: "N"}
  static SELECTED = {value: 0, name: "Normal", code: "N"}
}
