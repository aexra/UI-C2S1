import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";

export class Particle {
    constructor(emitter, position, size, color, velocity, gravity, lifeTime, acceleration, filter, shape) {
        this.emitter = emitter;
        this.position = position;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.gravityModifier = gravity;
        this.lifeTime = lifeTime;
        this.acceleration = acceleration;
        this.filter = filter;
        this.shape = shape || null;

        this.lifeTimer = 0;
        this.gravity = 9.8 / 1000;
        this.startFadingTime = lifeTime * 0.3;
        this.alpha = color.alpha;
        this.dropAlpha = this.alpha / this.startFadingTime;
    }
    update(deltaTime) {
        this.lifeTimer += deltaTime;

        if (this.lifeTimer >= this.startFadingTime) {
            this.alpha -= this.dropAlpha * deltaTime;
        }
        if (this.lifeTimer >= this.lifeTime) {
            this.emitter.deleteParticle(this);
        }
        
        this.velocity.y += this.gravity * this.gravityModifier;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        if (this.velocity.x * (this.velocity.x + this.acceleration.x) < 0) {
            this.velocity = new Vec2(0, 0);
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    draw(c) {
        c.save();
        c.fillStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z}, ${this.alpha})`;
        c.filter = this.filter;
        if (this.shape === null) {
            c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        } else {
            c.drawImage(shape, this.position.x, this.position.y, this.size.x, this.size.y);
        }
        c.restore();
    }
}