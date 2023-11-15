import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";

export class Particle {
    constructor(emitter, size, color, velocity, gravity, lifeTime, filter) {
        this.emitter = emitter;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.gravity = gravity;
        this.lifeTime = lifeTime;
        this.filter = filter;

        this.lifeTimer = 0;
    }
    update(deltaTime) {
        this.lifeTimer += deltaTime;
        if (this.lifeTimer >= this.lifeTime) {
            this.emitter.deleteParticle(this);
        }
    }
    draw(c) {
        c.save();
        c.filStyle = 'rgba(255, 255, 255, 1)';
        c.fillRect(this.emitter.position.x, this.emitter.position.y, 10, 10);
        c.restore();
    }
}