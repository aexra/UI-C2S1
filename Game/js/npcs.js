import { AnimatedSprite } from "./animatedSprite.js";
import { NPC } from "./npc.js";

const states = {
    0: idle,
    1: hitted,
};

export class Dummy extends NPC {
    constructor(game) {
        super(game);
        this.states = "idle";
        
    }
    update(input, deltaTime) {
        this.hp = this.maxhp;
    }
    draw(c) {

    }
}