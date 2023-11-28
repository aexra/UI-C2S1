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

        this.immunityInterval = 150;
        this.immunityTimer = 0;
    }
    update(input, deltaTime) {

    }
    draw(c) {

    }
    drawNPC(c) {

    }
    drawHP(c) {

    }
    drawDamageTaken(c) {

    }
    drawHitbox(c) {
        c.save();

        c.fillStyle = "rgba(140, 0, 0, 0.4)";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        c.restore();
    }
}