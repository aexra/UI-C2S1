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

        this.gradient = null;
    }
    update(input, deltaTime) {
        this.position = new Vec2(this.ui.position.x + this.onUIPosition.x / this.ui.game.player.camera.scale.x, -this.ui.position.y + this.onUIPosition.y / this.ui.game.player.camera.scale.y);
        this.size = new Vec2(this.indicatorSize.x / this.ui.game.player.camera.scale.x, this.indicatorSize.y / this.ui.game.player.camera.scale.y);
        this.progressSize = new Vec2(160 / this.ui.game.player.camera.scale.x, 40 / this.ui.game.player.camera.scale.y);
        this.progressPosition = new Vec2(140 / this.ui.game.player.camera.scale.x, -40 / this.ui.game.player.camera.scale.y);
    }
    draw(c) {
        this.gradient = c.createLinearGradient(this.position.x, this.position.y + this.size.y, this.position.x + this.size.x, this.position.y);
        this.gradient.addColorStop(0, "rgb(158, 34, 47)");
        this.gradient.addColorStop(0.5, "rgb(221, 53, 67)");
        this.gradient.addColorStop(1, "rgb(158, 34, 47)");

        this.drawProgressBar(c);
        this.drawPercentageBar(c);
        this.drawBossArc(c);
    }
    drawProgressBar(c) {
        // this is box
        c.fillStyle = "rgb(48, 28, 8)";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.strokeStyle = "rgb(71, 45, 13)";
        c.lineWidth = 5 / this.ui.game.player.camera.scale.x;
        c.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.lineWidth = 3 / this.ui.game.player.camera.scale.x;
        c.strokeStyle = "rgb(196, 160, 99)";
        c.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // this is remaining hp box
        var kremain = this.npc.hp / this.npc.maxHP;
        c.fillStyle = this.gradient;
        c.fillRect(
            this.position.x + 4 / this.ui.game.player.camera.scale.x + this.size.x * (1 - kremain), 
            this.position.y + 4 / this.ui.game.player.camera.scale.x,
            this.size.x * kremain - 8 / this.ui.game.player.camera.scale.x, 
            this.size.y - 8 / this.ui.game.player.camera.scale.x
        );

        // this is caret

    }
    drawPercentageBar(c) {
        c.fillStyle = "rgb(48, 28, 8)";
        c.fillRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
        c.strokeStyle = "rgb(71, 45, 13)";
        c.lineWidth = 5 / this.ui.game.player.camera.scale.x;
        c.strokeRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
        c.lineWidth = 3 / this.ui.game.player.camera.scale.x;
        c.strokeStyle = "rgb(196, 160, 99)";
        c.strokeRect(this.position.x + this.progressPosition.x, this.position.y + this.progressPosition.y, this.progressSize.x, this.progressSize.y);
    
        c.font = `${32 / this.ui.game.player.camera.scale.x}px andy`;
        c.textBaseline = 'top';
        c.fillStyle = 'rgb(196, 160, 99)';
        c.fillText(
            `${(this.npc.hp / this.npc.maxHP * 100).toPrecision(4)}%`, 
            this.position.x + this.progressPosition.x + 10 / this.ui.game.player.camera.scale.x, 
            this.position.y + this.progressPosition.y + 6 / this.ui.game.player.camera.scale.x
        );
    }
    drawBossArc(c) {
        c.fillStyle = "rgb(40, 2, 17)";
        c.strokeStyle = "rgb(71, 45, 13)";
        c.lineWidth = 5 / this.ui.game.player.camera.scale.x;

        var radius = 50 / this.ui.game.player.camera.scale.x;

        c.beginPath();
        c.arc(this.position.x + this.size.x, this.position.y, radius, 0, 2 * Math.PI);
        c.fill();
        
        c.beginPath();
        c.arc(this.position.x + this.size.x, this.position.y, radius, 0, 2 * Math.PI);
        c.stroke();

        c.strokeStyle = "rgb(196, 160, 99)";
        c.lineWidth = 3 / this.ui.game.player.camera.scale.x;
        c.beginPath();
        c.arc(this.position.x + this.size.x, this.position.y, radius, 0, 2 * Math.PI);
        c.stroke();

        c.drawImage(
            this.npc.minimapicon.normal, 
            this.position.x + this.size.x - radius / 2 - 3 / this.ui.game.player.camera.scale.x, 
            this.position.y - radius / 2 - 6 / this.ui.game.player.camera.scale.x, 
            38 * 1.5 / this.ui.game.player.camera.scale.x, 
            42 * 1.5 / this.ui.game.player.camera.scale.x
        );
    }
}