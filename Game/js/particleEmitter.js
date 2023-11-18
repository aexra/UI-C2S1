import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";
import { Particle } from "./particle.js";
import { Random } from "./misc.js";
import { GameObject } from "./gameObject.js";

export class ParticleEmitter extends GameObject {
    constructor() {
        super();
        this.d = new Vec2();
        this.frequency = 2;
        this.lifeTime = new Vec2(0.1, 1);
        this.angle = 90;
        this.direction = new Vec2(0, 1);
        this.particleSize = new Vec2(1, 1);
        this.color = new Vec4(255, 255, 255, 1);
        this.particleInitialSpeed = new Vec2(0, 0);  // два значения - рандом из
        this.particleGravityModifier = 1;
        this.acceleration = 0;
        this.filter = 'none';

        // это любое изображение, которое будет использовано в качестве частицы
        // filter будет изменять его цвет
        this.shape = null;

        // если shape представляет не одно изображение, а тайлсет, то это анимация
        this.nframes = 1;
        this.frameSize = new Vec2();
        this.fps = 0;

        // если shape это изображение, но нужны только определенные тайлы
        this.frames = [];

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
                // this.stop();
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
        
        var particle = new Particle();
        particle.emitter = this;
        particle.position = this.position.copy();
        particle.size = this.particleSize.copy(); 
        particle.velocity = velocity; 
        particle.gravityMod = this.particleGravityModifier;
        particle.setLifeTime(Random.randf(this.lifeTime.x, this.lifeTime.y, 2) * 1000);
        particle.setColor(this.color.copy());
        particle.acceleration = this.acceleration.copy();
        particle.filter = this.filter;
        particle.shape = this.shape;
        particle.setFrames(this.nframes, this.frameSize, this.fps);
        if (this.frames.length !== 0) particle.setFrameCrop(this.frames[Random.randi(0, this.frames.length - 1)]);
        this.particles.push(particle);
    }
    deleteParticle(particle) {
        this.particles.splice(this.particles.indexOf(particle), 1);
    }
    setFrequency(f) {
        this.frequency = f;
        this.interval = 1000 / f; 
    }
    setFrames(n, size, fps) {
        this.nframes = n;
        this.frameSize = size;
        this.fps = fps;
    }
    addFrameCrop(cp, cs) {
        this.frames.push([cp, cs]);
    }
}