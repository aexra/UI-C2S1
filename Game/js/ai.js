import { states } from './npcs.js'

export class ThanatosAI {
    constructor(head) {
        this.head = head;
        this.game = head.game;
        this.segments = head.segments;
    }
    update(input, deltaTime) {
        switch(this.head.state) {
            case states.idle:
                this.updateIdle(input, deltaTime);
                break;
        }
    }
    updateIdle(input, deltaTime) {

    }
}