import { Vec2 } from './vec2.js';
import * as AIStates from './aistates.js';
import { Random } from './misc.js';

export class ThanatosAI {
    constructor(head) {
        this.head = head;
        this.game = head.game;
        this.segments = head.segments;

        this.states = {
            "default": AIStates.Default,
            "idle": AIStates.Idle,
            "chase": AIStates.Chase,
            "chaseCursor": AIStates.ChaseCursor,
            "chainDashAttack": AIStates.ChainDashAttack,
        };
        this.state = null;
        this.switch("default");

        this.head.openHeadAndRandomSegments();
    }
    update(input, deltaTime) {
        this.state.update(input, deltaTime);
    }
    switch(state) {
        this.state = new this.states[state](this);
        this.state.onSwitch();
    }
    getAngleToPoint(p) {
        var diff = Vec2.minus(new Vec2(p.x, p.y), this.head.position);

        var angle = Math.atan(diff.y / Math.abs(diff.x));
        angle += diff.x < 0? Math.PI - angle * 2 : 0;

        return angle;
    }
    getAngleFromHeadToPoint(p) {
        return this.getAngleToPoint(p) - this.head.direction;
    }
    followPoint(p, speed=14, maxStirAngle=0.02) {
        var diff = Vec2.minus(new Vec2(p.x, p.y), this.head.position);

        var angle = this.getAngleToPoint(p);

        this.head.velocity = Math.min(diff.length(), speed);
        // this.head.velocity = speed;
        
        if (angle) this.rotateTo(diff, angle, maxStirAngle);
    }
    rotateTo(diff, angle, maxStirAngle=0.02) {
        var dangle = angle - this.head.direction;

        if (dangle < 0) {
            if (dangle < -Math.PI) {
                angle = Math.PI * 2 + angle;
            }
            var dangle = angle - this.head.direction;
        } else {
            if (dangle > Math.PI) {
                angle = Math.PI * 2 - angle;
            }
            var dangle = angle - this.head.direction;
        }

        if (dangle < 0) {
            if (dangle < -maxStirAngle) {
                angle += -maxStirAngle-dangle;
            }
        } else {
            if (dangle > maxStirAngle) {
                angle -= dangle-maxStirAngle;
            }
        }

        this.head.direction = angle - Math.floor(angle / (Math.PI * 2)) * Math.PI * 2;
        this.head.directionalVector = new Vec2(Math.cos(angle), Math.sin(angle));
    }
    setRandomAttackState() {
        var attacks = [
            "chainDashAttack",
        ];
        this.switch(attacks[Random.randi(0, attacks.length - 1)]);
    }
}