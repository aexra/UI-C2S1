import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";
import { Particle } from "./particle.js";
import { Random } from "./misc.js";

export class ParticleEmitter {
    constructor(position, d, f, t, a, dir, ps, pc, pv, pg, acc, filter) {
        this.position = position;
        this.d = d || new Vec2();
        this.frequency = f || 2;
        this.lifeTime = t || new Vec2(0.1, 1);
        this.angle = a || 90;
        this.direction = dir || new Vec2(0, 1);
        this.particleSize = ps || new Vec2(1, 1);
        this.particleColor = pc || new Vec4(255, 255, 255, 1);
        this.particleInitialSpeed = pv || new Vec2(0, 0);  // два значения - рандом из
        this.particleGravityModifier = pg || 1;
        this.acceleration = acc || 0;
        this.filter = filter || 'none';

        this.particles = [];
        this.interval = 1000 / this.frequency;
        this.timer = 0;

        this.emitting = false;
    }
    emit() {
        this.emitting = true;
    }
    stop() {
        this.emitting = false;
    }
    update(deltaTime) {
        if (this.emitting) {
            this.timer += deltaTime;
            if (this.emitting && this.timer > this.interval) {
                this.timer = 0;
                this.createParticle();
            }
        }
        
        for (let particle of this.particles) {
            particle.update(deltaTime);
        }
    }
    draw(c) {
        for (let particle of this.particles) {
            particle.draw(c);
        }
        // c.fillRect(this.position.x, this.position.y, 50, 50);
    }
    createParticle() {
        var randomAngle = Random.randi(-this.angle / 2, this.angle / 2);
        var currentAngle = Math.atan(this.direction.y / this.direction.x);
        var angle = (randomAngle * Math.PI / 180) + currentAngle;
        var boost = Random.randi(this.particleInitialSpeed.x, this.particleInitialSpeed.y);

        var velocity = new Vec2(boost * Math.cos(angle), boost * Math.sin(angle));
        this.acceleration = new Vec2(this.acceleration *= Math.cos(angle), this.acceleration *= Math.sin(angle));
        
        this.particles.push(new Particle(
            this, 
            new Vec2(this.position.x, this.position.y), 
            this.particleSize.copy(), 
            this.particleColor.copy(), 
            velocity,
            this.particleGravityModifier, 
            Random.randf(this.lifeTime.x, this.lifeTime.y, 2) * 1000, 
            this.acceleration,
            this.filter
        ));
    }
    deleteParticle(particle) {
        this.particles.splice(this.particles.indexOf(particle), 1);
    }
    setFrequency(f) {
        this.frequency = f;
        this.interval = 1000 / f; 
    }
}