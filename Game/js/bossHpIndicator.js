import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class BossHPIndicator extends GameObject {
    constructor(ui, npc) {
        super();
        this.ui = ui;
        this.npc = npc;

        this.indicatorSize = new Vec2(300, 60);
        this.progressSize = new Vec2(100, 40);
        this.progressPosition = new Vec2(200, -40);

        this.onUIPosition = new Vec2(ui.size.x - this.indicatorSize.x, ui.size.y - this.indicatorSize.y);
    }
    update(input, deltaTime) {
        this.position = new Vec2(this.ui.position.x + this.onUIPosition.x / this.ui.game.player.camera.scale.x, -this.ui.position.y + this.onUIPosition.y / this.ui.game.player.camera.scale.y);
        this.size = new Vec2(this.indicatorSize.x / this.ui.game.player.camera.scale.x, this.indicatorSize.y / this.ui.game.player.camera.scale.y);
        this.progressSize = new Vec2(100 / this.ui.game.player.camera.scale.x, 40 / this.ui.game.player.camera.scale.y);
        this.progressPosition = new Vec2(200 / this.ui.game.player.camera.scale.x, -40 / this.ui.game.player.camera.scale.y);
    }
    draw(c) {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.fillstyle = "yellow";
        c.fillRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
    }
}