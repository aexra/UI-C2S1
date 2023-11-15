import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";

export class ParticleEmitter {
    constructor(origin, d, f, t, r, dir, ps, pc, pv, pg, filter) {
        this.origin = origin;
        this.d = d || new Vec2();
        this.frequency = f || 0.5 * 1000;
        this.lifeTime = t || new Vec2(0.1, 1);
        this.radius = r || 90;
        this.direction = dir || new Vec2(0, 1);
        this.particleSize = ps || new Vec2(1, 1);
        this.particleColor = pc || new Vec4(255, 255, 255, 1);
        this.particleVelocity = pv || new Vector2(0, 0);
        this.particleGravityModifier = pg || 1;
        this.filter = filter || 'none';

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

    }
    draw(c) {

    }
}