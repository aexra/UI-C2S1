import { GameObject } from "./gameObject.js";
import { Light } from "./light.js";
import { Vec2 } from "./vec2.js";
import { Vec4 } from "./vec4.js";

export class Particle extends GameObject {
    constructor(lighted=false) {
        super();
        this.emitter = null;
        this.color = new Vec4();
        this.velocity = new Vec2();
        this.gravityMod = 1;
        this.lifeTime = 0;
        this.acceleration = new Vec2();
        this.filter = 'none';
        this.shape = null;

        this.rotationSpeed = 0;
        this.rotation = 0;
        
        this.lights = [];
        if (lighted) {
            this.lights.push(new Light(this.position, 14, 0));
        }

        this.nframes = 1;
        this.frameSize = new Vec2();
        this.fps = 0;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.frame = 0;
        this.frameCropPos;
        this.frameCropSize;

        this.lifeTimer = 0;
        this.gravity = 9.8 / 1000;
        this.startFadingTime = this.lifeTime? this.lifeTime * 0.3 : 0;
        this.alpha = this.color? this.color.alpha : 1;
        this.dropAlpha = this.alpha / this.startFadingTime;
    }
    update(deltaTime) {
        this.lifeTimer += deltaTime;
        this.frameTimer += deltaTime;

        // animation
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            this.frame = this.nframes - 1 == this.frame? 0 : this.frame + 1;
        }

        if (this.lifeTimer >= this.startFadingTime) {
            this.alpha -= this.dropAlpha * deltaTime;
            this.alpha = Math.max(this.alpha, 0);
        }
        if (this.lifeTimer >= this.lifeTime) {
            this.emitter.deleteParticle(this);
        }
        
        this.velocity.y += this.gravity * this.gravityMod;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        if (this.velocity.x * (this.velocity.x + this.acceleration.x) < 0) {
            this.velocity = new Vec2(0, 0);
        }
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // lights
        for (var light of this.lights) {
            light.position = this.position.copy();
        }

        // костыль
        if (Vec2.minus(this.emitter.game.player.position, this.position).length() > 60) {
            for (var light of this.lights) {
                light.intensity = 1;
            }
        }

        // поворот
        if (this.rotationSpeed != 0) {
            this.rotation += this.rotationSpeed;
        }
    }
    draw(c) {
        c.save();
        c.fillStyle = `rgba(${this.color.x}, ${this.color.y}, ${this.color.z}, ${this.alpha})`;
        c.filter = this.filter;
        c.globalAlpha = this.alpha;
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        var relpos = new Vec2(-this.size.x / 2 + (this.size.x % 2 == 0? 0 : 1), -this.size.y / 2 + (this.size.y % 2 == 0? 0 : 1));
        if (this.shape === null) {
            c.fillRect(relpos.x, relpos.y, this.size.x, this.size.y);
        } else {
            if (this.nframes !== 1) {
                c.drawImage(this.shape, 0, this.frameSize.y * this.frame, this.frameSize.x, this.frameSize.y, relpos.x, relpos.y, this.size.x, this.size.y);
            } else {
                if (this.frameCropPos !== null) {
                    c.drawImage(this.shape, this.frameCropPos.x, this.frameCropPos.y, this.frameCropSize.x, this.frameCropSize.y, relpos.x, relpos.y, this.size.x, this.size.y);
                } else {
                    c.drawImage(this.shape, relpos.x, relpos.y, this.size.x, this.size.y);
                }
            }
        }
        c.restore();
    }
    setLifeTime(lt) {
        this.lifeTime = lt;
        this.startFadingTime = lt * 0.3;
    }
    setColor(col) {
        this.color = col;
        this.alpha = col.alpha;
        this.dropAlpha = this.alpha / (this.lifeTime - this.startFadingTime);
    }
    setFrames(n, size, fps) {
        this.nframes = n;
        this.frameSize = size;
        this.fps = fps;
        this.frameInterval = 1000 / this.fps;
    }
    setFrameCrop(info) {
        this.frameCropPos = info[0];
        this.frameCropSize = info[1];
    }
}