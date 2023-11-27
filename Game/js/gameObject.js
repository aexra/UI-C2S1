import { Vec2 } from "./vec2.js";

export class GameObject {
    constructor() {
        this.position = new Vec2();
        this.size = new Vec2();

        this.onmousel = function(s){};
        this.onmouser = function(s){};
    }
    translate(by) {
        this.position.translate(by);
        return this;
    }
    translateTo(to) {
        this.position.translateTo(to);
        return this;
    }
}