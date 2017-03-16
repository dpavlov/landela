export default class Observable {
  constructor() {
    this.observers = [];
  }
  subscribe(obj) {
    this.observers.push(obj);
    return this;
  }
  subscribeAll(observer, objs) {
    for (var i = 0; i < objs.length; i ++) {
      objs[i].subscribe(observer);
    }
    return objs;
  }
  unsubscribe(obj) {
    let index = this.observers.indexOf(obj);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
    return this;
  }
  notify(...args) {
    for (var i = 0; i < this.observers.length; i++) {
      this.observers[i].onEvent(this, ...args);
    }
  }
};
