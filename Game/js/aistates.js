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

        this.initialFollowPoint = new Vec2(36000, 3000);
    }
    update(input, deltaTime) {
        this.ai.followPoint(this.initialFollowPoint);

        if (Vec2.minus(this.npc.position, this.initialFollowPoint).length() <= 300) {
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

        this.chasingInterval = 6000;
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
        this.dashesPerPhase = 7;
        this.dashDistance = 2000;
        this.minDistanceToDash = 800;

        this.dashSpeed = 40;
        this.dashStirAngle = 0;
        
        this.stirSpeed = 24;
        this.stirStirAngle = 0.03;

        this.chaseSpeed = 30;
        this.chaseStirAngle = 0.01;

        this.states = {
            chase: 0,
            dash: 1,
            stir: 2
        };
        this.state = this.states.chase;

        this.aimpos = null;

        this.transitionSound = new Audio("../resources/game/npcs/sounds/thanatos/thanatos_transition.ogg");
        this.transitionSound.volume = Config.audio.sfx;
    }
    update(input, deltaTime) {
        this.updateState(input, deltaTime);
        this.updateAim(input, deltaTime);
    }
    updateState(input, deltaTime) {
        if (this.state != this.states.dash) {
            if (Math.abs(this.ai.getAngleFromHeadToPoint(this.player.position)) > 0.2) {
                this.state = this.states.stir;
                return;
            } else {
                this.state = this.states.chase;
            }
        } else {
            if (Vec2.minus(this.npc.position, this.aimpos).length() < 300) {
                // dash stop
                this.state = this.states.stir;
                this.aimpos = null;
                if (this.dashCount >= this.dashesPerPhase) this.ai.switch("chase");
            }
            return;
        }
        if (Vec2.minus(this.player.position, this.npc.position).length() < this.minDistanceToDash) {
            // dash start
            this.state = this.states.dash;
            this.aimpos = this.calcAimPos();
            this.dashCount++;
        }
    }
    calcAimPos() {
        var angle = this.ai.getAngleToPoint(this.player.position);
        if (!angle) return this.npc.direction;
        
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
        this.transitionSound.play();
    }
}