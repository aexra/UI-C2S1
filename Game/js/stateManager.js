export class StateManager {
    constructor(origin) {
        this.origin = origin;
        this.states = {};
    }
    addState(name, state) {
        this.states[name] = state;
    }
}
