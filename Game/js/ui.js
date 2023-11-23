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

        c.fillStyle = "rgba(23, 23, 23, 1)";
        c.fillRect(-this.position.x + this.minimap.position.x, -this.position.y + this.minimap.position.y, this.minimap.size.x, this.minimap.size.y);
        
        c.fillStyle = "rgba(255, 255, 255, 1)";
        c.fillRect(-this.position.x + this.minimap.position.x + this.game.player.position.x * this.minimap.scale - 2, -this.position.y + this.minimap.position.y + this.game.player.position.y * this.minimap.scale - 2, 4, 4);

        c.strokeStyle = "rgba(100, 100, 100, 1)";
        c.lineWidth = 2;
        c.strokeRect(-this.position.x + this.minimap.position.x - 2, -this.position.y + this.minimap.position.y - 2, this.minimap.size.x + 4, this.minimap.size.y + 4);

        c.restore();
    }
}