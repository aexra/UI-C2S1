import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";

export class Particle {
    constructor(emitter, position, size, color, velocity, gravity, lifeTime, filter) {
        this.emitter = emitter;
        this.position = position;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.gravityModifier = gravity;
        this.lifeTime = lifeTime;
        this.filter = filter;

        this.lifeTimer = 0;
        this.gravity = 9.8 / 1000;
    }
    update(deltaTime) {
        this.lifeTimer += deltaTime;
        if (this.lifeTimer >= this.lifeTime) {
            this.emitter.deleteParticle(this);
        }
        
        this.velocity.y += this.gravity * this.gravityModifier;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    draw(c) {
        c.save();
        c.fillStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z}, ${this.color.alpha})`;
        c.filter = this.filter;
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.restore();
    }
}