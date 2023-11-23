import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class UI extends GameObject {
    constructor(game) {
        super();
        this.game = game;
        this.globalOffset = new Vec2(0, 0);
        this.margin = new Vec2(20, 20);
        this.size = new Vec2(game.canvasSize.x - this.margin.x * 2, game.canvasSize.y - this.margin.y * 2);

        this.minimap = {
            size: new Vec2(280, 280),
            position: new Vec2(this.margin.x + this.size.x - 280, this.margin.y),
            scale: 280 / game.size.x,
        };
    }
    update(input, deltaTime) {
        this.position = this.game.player.camera.pos;
    }
    draw(c) {
        this.drawHotbar(c);
        this.drawMinimap(c);
    }
    drawHotbar(c) {

    }
    drawMinimap(c) {
        c.save();

        c.fillStyle = "rgba(255, 255, 255, 1)";
        c.fillRect(-this.position.x + this.minimap.position.x, -this.position.y + this.minimap.position.y, this.minimap.size.x, this.minimap.size.y);

        c.restore();
    }
}