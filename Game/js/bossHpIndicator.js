import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";

export class BossHPIndicator extends GameObject {
    constructor(ui, npc) {
        super();
        this.ui = ui;
        this.npc = npc;

        this.indicatorSize = new Vec2(300, 40);
        this.progressSize = new Vec2(160, 40);
        this.progressPosition = new Vec2(140, -40);

        this.onUIPosition = new Vec2(ui.size.x - this.indicatorSize.x - 60, ui.size.y - this.indicatorSize.y);
    }
    update(input, deltaTime) {
        this.position = new Vec2(this.ui.position.x + this.onUIPosition.x / this.ui.game.player.camera.scale.x, -this.ui.position.y + this.onUIPosition.y / this.ui.game.player.camera.scale.y);
        this.size = new Vec2(this.indicatorSize.x / this.ui.game.player.camera.scale.x, this.indicatorSize.y / this.ui.game.player.camera.scale.y);
        this.progressSize = new Vec2(160 / this.ui.game.player.camera.scale.x, 40 / this.ui.game.player.camera.scale.y);
        this.progressPosition = new Vec2(140 / this.ui.game.player.camera.scale.x, -40 / this.ui.game.player.camera.scale.y);
    }
    draw(c) {
        this.drawProgressBar(c);
        this.drawPercentageBar(c);
        this.drawBossArc(c);
    }
    drawProgressBar(c) {
        c.fillStyle = "rgb(48, 28, 8)";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.strokeStyle = "rgb(71, 45, 13)";
        c.lineWidth = 5;
        c.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.lineWidth = 3;
        c.strokeStyle = "rgb(196, 160, 99)";
        c.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    drawPercentageBar(c) {
        // c.fillstyle = "yellow";
        // c.fillRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
        c.fillStyle = "rgb(48, 28, 8)";
        c.fillRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
        c.strokeStyle = "rgb(71, 45, 13)";
        c.lineWidth = 5;
        c.strokeRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
        c.lineWidth = 3;
        c.strokeStyle = "rgb(196, 160, 99)";
        c.strokeRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
    }
    drawBossArc(c) {
        c.fillStyle = "rgb(40, 2, 17)";
        c.strokeStyle = "rgb(71, 45, 13)";
        c.lineWidth = 5;

        c.beginPath();
        c.arc(this.position.x + this.size.x, this.position.y, 50, 0, 2 * Math.PI);
        c.fill();
        
        c.beginPath();
        c.arc(this.position.x + this.size.x, this.position.y, 50, 0, 2 * Math.PI);
        c.stroke();

        c.strokeStyle = "rgb(196, 160, 99)";
        c.lineWidth = 3;
        c.beginPath();
        c.arc(this.position.x + this.size.x, this.position.y, 50, 0, 2 * Math.PI);
        c.stroke();
    }
}