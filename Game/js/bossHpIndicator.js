import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class BossHPIndicator extends GameObject {
    constructor(ui, npc) {
        super();
        this.ui = ui;
        this.npc = npc;

        this.size = new Vec2(300, 80);
        this.onUIPosition = new Vec2(ui.size.x - this.size.x, ui.size.y - this.size.y);
    }
    update(input, deltaTime) {
        this.position = new Vec2(this.ui.position.x + this.onUIPosition.x, -this.ui.position.y + this.onUIPosition.y);
    }
    draw(c) {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}