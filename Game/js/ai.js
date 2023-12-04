import { states } from './npcs.js'
import { Vec2 } from './vec2.js';

export class ThanatosAI {
    constructor(head) {
        this.head = head;
        this.game = head.game;
        this.segments = head.segments;

        this.maxAngleSpeed = 1;

        this.cursorChaseSpeed = 1;
        this.chaseSpeed = 11;
    }
    update(input, deltaTime) {
        switch(this.head.state) {
            case states.idle:
                this.updateIdle(input, deltaTime);
                break;
            case states.followCursor:
                this.updateChaseCursor(input, deltaTime);
                break;
            case states.chasePlayer:
                this.updateChasePlayer(input, deltaTime);
                break;
        }
    }
    switch(state) {
        this.head.state = state;
    }
    rotateTo(diff, alpha) {
        console.log(alpha);
        if (this.head.direction + alpha < 0) {
            alpha = Math.max(this.head.direction + alpha, -this.maxAngleSpeed + this.head.direction);
        } else {
            alpha = Math.min(this.head.direction + alpha, this.maxAngleSpeed + this.head.direction);
        }
        this.head.direction = alpha;
        this.head.directionalVector = new Vec2(Math.cos(alpha) * (diff.x < 0? -1 : 1), Math.sin(alpha) * (diff.x < 0? -1 : 1));
    }
    updateIdle(input, deltaTime) {

    }
    updateChasePlayer(input, deltaTime) {

    }
    updateChaseCursor(input, deltaTime) {
        var diff = Vec2.minus(new Vec2(input.mpx, input.mpy), this.head.position);
        var alpha = Math.atan(diff.y / diff.x)
        console.log(alpha);
        if (alpha) this.rotateTo(diff, alpha);
        this.head.velocity = Math.min(diff.length(), this.cursorChaseSpeed);
    }
}