import { Vec2 } from "./vec2.js";

export class Sprite {
    constructor(pos, size, src) {
        this.position = pos;
        this.size = size;
        this.src = src;

        this.image = new Image();
        this.image.src = this.src;
    }
}