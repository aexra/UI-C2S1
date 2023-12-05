import { states } from './npcs.js'
import { Vec2 } from './vec2.js';

export class ThanatosAI {
    constructor(head) {
        this.head = head;
        this.game = head.game;
        this.segments = head.segments;

        this.maxStirAngle = 0.1;
        this.maxStirSpeed = 4;

        this.cursorChaseSpeed = 8;
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
        
        this.head.direction = alpha;
        this.head.directionalVector = new Vec2(Math.cos(alpha), Math.sin(alpha));
    }
    updateIdle(input, deltaTime) {

    }
    updateChasePlayer(input, deltaTime) {

    }
    updateChaseCursor(input, deltaTime) {
        var diff = Vec2.minus(new Vec2(input.mpx, input.mpy), this.head.position);

        var alpha = Math.atan(diff.y / Math.abs(diff.x));
        alpha += diff.x < 0? Math.PI - alpha * 2 : 0;
        console.log(alpha);

        if (alpha) this.rotateTo(diff, alpha);


        this.head.velocity = Math.min(diff.length(), this.cursorChaseSpeed);
    }
}