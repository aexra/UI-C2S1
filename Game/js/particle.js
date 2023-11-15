import { Vec2 } from "./vec2";
import { Vec4 } from "./vec4";

export class Particle {
    constructor(size, color, velocity, gravity, filter) {
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.gravity = gravity;
        this.filter = filter;
    }
    update(deltaTime) {
        
    }
    draw(c) {
        
    }
}