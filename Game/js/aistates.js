import { Vec2 } from "./vec2.js";
import { Random, Config } from "./misc.js";

class AIState {
    constructor(ai) {
        this.ai = ai;
        this.game = ai.game;
        this.player = ai.game.player;
    }
    update(input, deltaTime) {

    }
    onSwitch() {
        
    }
}

export class Idle extends AIState {
    constructor(ai) {
        super(ai);
    }
}

export class Chase extends AIState {
    constructor(ai) {
        super(ai);
    }
    update(input, deltaTime) {
        this.ai.followPoint(this.player.position);
    }
}

export class ChaseCursor extends AIState {
    constructor(ai) {
        super(ai);
    }
    update(input, deltaTime) {
        this.ai.followPoint(new Vec2(input.mpx, input.mpy));
    }
}