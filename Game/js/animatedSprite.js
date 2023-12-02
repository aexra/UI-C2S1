import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class AnimatedSprite extends GameObject {
    constructor(images, fps, pos, size) {
        super();
        this.singleFrame = false;
        this.images = images;
        this.position = pos;
        this.size = size;
        
        this.skipFirstDelay = false;

        this.fps = fps;
        this.interval = 1000 / fps;
        this.timer = 0;

        this.frameIdx = 0;

        this.onend = function(s){};
    }
    start() {
        if (this.skipFirstDelay) {
            this.timer = this.interval;
        }
    }
    update(input, deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= this.interval) {
            this.timer = 0;
            this.nextFrame();
        }

        if (input.keys.includes("lmb") && (input.mpx >= this.position.x - this.size.x / 2 && input.mpx <= this.position.x - this.size.x / 2 + this.size.x) && (input.mpy >= this.position.y - this.size.y / 2 && input.mpy <= this.position.y - this.size.y / 2 + this.size.y)) {
            this.onmousel(this);
        }
        if (input.keys.includes("rmb") && (input.mpx >= this.position.x - this.size.x / 2 && input.mpx <= this.position.x - this.size.x / 2 + this.size.x) && (input.mpy >= this.position.y - this.size.y / 2 && input.mpy <= this.position.y - this.size.y / 2 + this.size.y)) {
            this.onmouser(this);
        }
    }
    draw(c) {
        c.drawImage(this.images[this.frameIdx], this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);
    }
    setFPS(fps) {
        this.fps = fps;
        this.interval = 1000 / fps;
    }
    nextFrame() {
        if (this.frameIdx == this.images.length - 1) {
            this.frameIdx = 0;
            if (this.skipFirstDelay) {
                this.timer = this.interval;
            }
            this.onend(this);
        }
        else this.frameIdx++;
    }
}