import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class AnimatedSprite extends GameObject {
    constructor(images, fps, pos) {
        super();
        this.singleFrame = false;
        this.images = images;
        this.position = pos;
        
        this.fps = fps;
        this.interval = 1000 / fps;
        this.timer = 0;

        this.frameIdx = 0;
    }
    update(input, deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= this.interval) {
            this.timer = 0;
            this.nextFrame();
        }
    }
    draw(c) {
        c.drawImage(this.images[this.frameIdx], this.position.x, this.position.y);
    }
    setFPS(fps) {
        this.fps = fps;
        this.interval = 1000 / fps;
    }
    nextFrame() {
        if (this.frameIdx == this.images.length - 1) {
            this.frameIdx = 0;
        }
        else this.frameIdx++;
    }
}