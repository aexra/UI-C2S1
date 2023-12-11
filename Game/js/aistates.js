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
        console.log("default");
    }
}

export class Idle extends AIState {
    constructor(ai) {
        super(ai);
    }
    onSwitch() {
        console.log("idle");
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
        console.log("chase");
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
        console.log("chaseCursor");
    }
}

export class ChainDashAttack extends AIState {
    constructor(ai) {
        super(ai);

        this.dashCount = 0;
        this.dashDistance = 2000;
        this.minDistanceToDash = 500;

        this.dashSpeed = 32;
        this.dashStirAngle = 0;
        
        this.stirSpeed = 18;
        this.stirStirAngle = 0.06;

        this.chaseSpeed = 24;
        this.chaseStirAngle = 0.03;

        this.states = {
            chase: 0,
            dash: 1,
            stir: 2
        };
        this.state = this.states.chase;

        this.aimpos = null;
    }
    update(input, deltaTime) {
        this.updateState(input, deltaTime);
        this.updateAim(input, deltaTime);
    }
    updateState(input, deltaTime) {
        if (this.state != this.states.dash) {
            if (Math.abs(this.ai.getAngleFromHeadToPoint(this.player.position)) > 0.1) {
                this.state = this.states.stir;
                return;
            } else {
                this.state = this.states.chase;
            }
        } else {
            if (Vec2.minus(this.npc.position, this.aimpos).length() < 300) {
                this.state = this.states.stir;
                this.aimpos = null;
            } else {
                // console.log(Vec2.minus(this.npc.position, this.aimpos).length());
            }
            return;
        }
        if (Vec2.minus(this.player.position, this.npc.position).length() < this.minDistanceToDash) {
            this.state = this.states.dash;
            this.aimpos = this.calcAimPos();
            // console.log(this.aimpos);
        }
    }
    calcAimPos() {
        var angle = this.ai.getAngleToPoint(this.player.position);
        if (!angle) return this.npc.direction;
        // console.log(angle);
        return new Vec2(
            this.npc.position.x + Math.cos(angle) * this.dashDistance,
            this.npc.position.y + Math.sin(angle) * this.dashDistance
        );
    }
    updateAim(input, deltaTime) {
        if (this.state == this.states.dash) {
            this.ai.followPoint(this.aimpos, this.dashSpeed, this.dashStirAngle);
            return;
        }
        if (this.state == this.states.stir) {
            this.ai.followPoint(this.player.position, this.stirSpeed, this.stirStirAngle);
            return;
        }
        if (this.state == this.states.chase) {
            this.ai.followPoint(this.player.position, this.chaseSpeed, this.chaseStirAngle);
            return;
        }
    }
    onSwitch() {
        console.log("chainDashAttack");
    }
}