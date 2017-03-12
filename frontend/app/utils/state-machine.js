export default class StateMachine {
  constructor(initState, transitions) {
    this._state = initState;
    this.transitions = transitions;
  }
  is(state) {
    return this._state === state;
  }
  isAnyOf(states) {
    for (var i = 0; i < states.length; i++ ) {
      if(this._state === states[i]) {
        return true;
      }
    }
    return false;
  }
  on(event) {
    for (var i = 0; i < this.transitions.length; i++ ) {
      let transition = this.transitions[i];
      if (event === transition.event) {
        if (transition.from === '*' || transition.from === this._state) {
          return new StateMachine(transition.to, this.transitions);
        }
      }
    }
    return this;
  }
}
