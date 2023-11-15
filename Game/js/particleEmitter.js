import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";
import { Particle } from "./particle.js";

export class ParticleEmitter {
    constructor(position, d, f, t, r, dir, ps, pc, pv, pg, filter) {
        this.position = position;
        this.d = d || new Vec2();
        this.frequency = f || 2;
        this.lifeTime = t || new Vec2(0.1, 1);
        this.radius = r || 90;
        this.direction = dir || new Vec2(0, 1);
        this.particleSize = ps || new Vec2(1, 1);
        this.particleColor = pc || new Vec4(255, 255, 255, 1);
        this.particleVelocity = pv || new Vec2(0, 0);
        this.particleGravityModifier = pg || 1;
        this.filter = filter || 'none';

        this.particles = [];
        this.interval = 1000 / this.frequency;
        this.timer = 0;

        this.position = origin.position;

        this.emitting = false;
    }
    emit() {
        this.emitting = true;
    }
    stop() {
        this.emitting = false;
    }
    update(deltaTime) {
        this.timer += deltaTime;
        if (this.timer > this.interval) {
            this.timer = 0;
            this.createParticle();
        }
    }
    draw(c) {
        for (let particle of this.particles) {
            particle.draw(c);
        }
        c.save();
        c.fillStyle = 'rgba(255, 255, 255, 1)';
        c.fillRect(50, 50, 50, 50);
        c.restore();
    }
    createParticle() {
        this.particles.push(new Particle(this.particleSize, this.particleColor, this.particleVelocity, this.particleGravityModifier, this.filter));
    }
}