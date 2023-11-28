import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class NPC extends GameObject {
    constructor(game) {
        super();
        this.game = game;

        this.immortal = false;
        this.friendly = false;

        this.maxhp = 5;
        this.hp = this.maxhp;

        this.image = null;
    }
    update(input, deltaTime) {

    }
    draw(c) {

    }
}