import { Vec2 } from './vec2.js';
import * as AIStates from './aistates.js';

export class ThanatosAI {
    constructor(head) {
        this.head = head;
        this.game = head.game;
        this.segments = head.segments;

        this.maxStirAngle = 0.02;
        this.maxStirSpeed = 4;

        this.chaseSpeed = 18;

        this.states = {
            "idle": new AIStates.Idle(this),
            "chase": new AIStates.Chase(this),
            "chaseCursor": new AIStates.ChaseCursor(this),
        };
        this.state = this.states["chase"];

        this.head.openHeadAndRandomSegments();
    }
    update(input, deltaTime) {
        this.state.update(input, deltaTime);
    }
    switch(state) {
        this.state = states[state];
        this.state.onSwitch();
    }
    followPoint(p) {
        var diff = Vec2.minus(new Vec2(p.x, p.y), this.head.position);

        var angle = Math.atan(diff.y / Math.abs(diff.x));
        angle += diff.x < 0? Math.PI - angle * 2 : 0;

        this.head.velocity = Math.min(diff.length(), this.chaseSpeed);
        
        if (angle) this.rotateTo(diff, angle);
    }
    rotateTo(diff, angle) {
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
            if (dangle < -this.maxStirAngle) {
                angle += -this.maxStirAngle-dangle;
            }
        } else {
            if (dangle > this.maxStirAngle) {
                angle -= dangle-this.maxStirAngle;
            }
        }

        this.head.direction = angle - Math.floor(angle / (Math.PI * 2)) * Math.PI * 2;
        this.head.directionalVector = new Vec2(Math.cos(angle), Math.sin(angle));
    }
}