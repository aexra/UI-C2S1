import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class UI extends GameObject {
    constructor(game) {
        super();
        this.game = game;
        this.globalOffset = new Vec2(0, 0);
        this.margin = new Vec2(30, 20);
        this.size = new Vec2(game.canvasSize.x - this.margin.x * 2, game.canvasSize.y - this.margin.y * 2);
        this.gap = new Vec2(10, 20);

        this.lifebar = {
            size: new Vec2(280, 40),
            position: new Vec2(this.margin.x + this.size.x - 280, this.margin.y),
        };
        this.minimap = {
            size: new Vec2(280, 280),
            position: new Vec2(this.margin.x + this.size.x - 280, this.margin.y + this.lifebar.size.y + this.gap.y),
            scale: 280 / game.size.x,
            border: document.getElementById("minimap"),
        };
    }
    update(input, deltaTime) {
        this.position = new Vec2(-this.game.player.camera.pos.x, this.game.player.camera.pos.y);
    }
    draw(c) {
        this.drawHotbar(c);
        this.drawLifebar(c);
        this.drawMinimap(c);
    }
    drawHotbar(c) {

    }
    drawLifebar(c) {
        c.save();
        
        c.fillStyle = 'rgba(160, 0, 0, 1)';
        c.fillRect(this.position.x + this.lifebar.position.x, -this.position.y + this.lifebar.position.y, 40, 40);

        c.restore();
    }
    drawMinimap(c) {
        c.save();

        c.fillStyle = "rgba(23, 23, 23, 1)";
        c.fillRect(this.position.x + this.minimap.position.x, -this.position.y + this.minimap.position.y, this.minimap.size.x, this.minimap.size.y);
        
        c.fillStyle = "rgba(255, 255, 255, 1)";
        c.fillRect(this.position.x + this.minimap.position.x + this.game.player.position.x * this.minimap.scale - 2, -this.position.y + this.minimap.position.y + this.game.player.position.y * this.minimap.scale - 2, 4, 4);

        // c.strokeStyle = "rgba(100, 100, 100, 1)";
        // c.lineWidth = 2;
        // c.strokeRect(-this.position.x + this.minimap.position.x - 2, -this.position.y + this.minimap.position.y - 2, this.minimap.size.x + 4, this.minimap.size.y + 4);

        c.drawImage(this.minimap.border, this.position.x + this.minimap.position.x - 10, -this.position.y + this.minimap.position.y - 17, this.minimap.size.x + 30, this.minimap.size.y + 34)

        c.restore();
    }
}