import { Vec2 } from "./vec2.js";
import { Random, Config } from "./misc.js";

class AIState {
    constructor(ai) {
        this.ai = ai;
        this.npc = ai.head;
        this.game = ai.game;
        this.player = ai.game.player;
    }
    update(input, deltaTime) {

    }
    onSwitch() {

    }
}

export class Default extends AIState {
    constructor(ai) {
        super(ai);

        this.initialFollowPoint = new Vec2(38000, 2000);
    }
    update(input, deltaTime) {
        this.ai.followPoint(this.initialFollowPoint);

        if (this.npc.position.equal(this.initialFollowPoint)) {
            this.ai.switch("chase");
        }
    }
    onSwitch() {
        console.log("default thanatos state set");
    }
}

export class Idle extends AIState {
    constructor(ai) {
        super(ai);
    }
    onSwitch() {
        console.log("idle thanatos state set");
    }
}

export class Chase extends AIState {
    constructor(ai) {
        super(ai);

        this.chasingInterval = 10000;
        this.chasingTimer = 0;
    }
    update(input, deltaTime) {
        this.chasingTimer += deltaTime;

        if (this.chasingTimer >= this.chasingInterval) {
            this.ai.setRandomAttackState();
        }
        
        this.ai.followPoint(this.player.position);
    }
    onSwitch() {
        console.log("chase thanatos state set");
    }
}

export class ChaseCursor extends AIState {
    constructor(ai) {
        super(ai);
    }
    update(input, deltaTime) {
        this.ai.followPoint(new Vec2(input.mpx, input.mpy));
    }
    onSwitch() {
        console.log("chaseCursor thanatos state set");
    }
}

export class ChainDashAttack extends AIState {
    constructor(ai) {
        super(ai);

        this.dashCount = 0;
        
        this.dashSpeed = 20;
        this.dashStirAngle = 0;
        
        this.stirSpeed = 2;
        this.stirStirAngle = 0.1;

        this.chaseSpeed = 14;
        this.chaseStirAngle = 0.03;
    }
    update(input, deltaTime) {
        this.ai.followPoint(this.player.position);
    }
    onSwitch() {
        console.log("chainDashAttack thanatos state set");
    }
}