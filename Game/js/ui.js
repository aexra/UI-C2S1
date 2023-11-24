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
            size: new Vec2(280, 26),
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

        c.translate(this.position.x + this.lifebar.position.x, -this.position.y + this.lifebar.position.y);

        c.fillStyle = 'rgba(185, 151, 59, 1)';
        c.beginPath();
        c.roundRect(0, 0, this.lifebar.size.x, this.lifebar.size.y, 5);
        c.fill();

        c.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        c.lineWidth = 5;
        c.beginPath();
        c.roundRect(0, 0, this.lifebar.size.x, this.lifebar.size.y, 5);
        c.stroke();
        
        c.fillStyle = 'rgba(167, 120, 49, 1)';
        c.fillRect(6, 6, 268, 14);

        var lifeSections = 15;
        var lifeGap = 3;
        var lifeSize = 268 / lifeSections - lifeGap + 0.18;

        for (var i = 0; i < lifeSections; i++) {
            c.fillStyle = 'rgba(154, 110, 45, 1)';
            c.fillRect(6 + i * lifeSize + i * lifeGap, 7, lifeSize, 13);

            c.strokeStyle = 'rgba(150, 148, 103, 1)';
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(6 + i * lifeSize + i * lifeGap, 7);
            c.lineTo(6 + i * lifeSize + i * lifeGap + lifeSize, 7);
            c.stroke();

            c.strokeStyle = 'rgba(122, 93, 50, 1)';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(6 + i * lifeSize + i * lifeGap, 19);
            c.lineTo(6 + i * lifeSize + i * lifeGap + lifeSize, 19);
            c.stroke();
        }

        for (var i = 0; i < Math.floor(this.game.player.hp / this.game.player.maxHP * lifeSections); i++) {
            c.fillStyle = 'rgba(221, 189, 62, 1)';
            c.fillRect(6 + i * lifeSize + i * lifeGap, 7, lifeSize, 13);

            c.strokeStyle = 'rgba(240, 239, 166, 1)';
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(6 + i * lifeSize + i * lifeGap, 7);
            c.lineTo(6 + i * lifeSize + i * lifeGap + lifeSize, 7);
            c.stroke();

            c.strokeStyle = 'rgba(205, 115, 61, 1)';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(6 + i * lifeSize + i * lifeGap, 19);
            c.lineTo(6 + i * lifeSize + i * lifeGap + lifeSize, 19);
            c.stroke();
        }

        c.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        c.lineWidth = 2;
        c.beginPath();
        c.roundRect(5, 5, this.lifebar.size.x - 10, this.lifebar.size.y - 10, 3);
        c.stroke();

        c.restore();
    }
    drawMinimap(c) {
        c.save();

        // рисуем серый квадрат
        c.fillStyle = "rgba(23, 23, 23, 1)";
        c.fillRect(this.position.x + this.minimap.position.x, -this.position.y + this.minimap.position.y, this.minimap.size.x, this.minimap.size.y);

        // рисуем проджектайлы игрока
        c.fillStyle = "rgba(0, 220, 0, 1)";
        for (var i = 0; i < this.game.projectiles.length; i++) {
            c.fillRect(
                this.position.x + this.minimap.position.x + this.game.projectiles[i].position.x * this.minimap.scale - 1,
                -this.position.y + this.minimap.position.y + this.game.projectiles[i].position.y * this.minimap.scale - 1,
                2, 2
            );
        }

        // рисуем белую точку - игрока
        c.fillStyle = "rgba(255, 255, 255, 1)";
        c.fillRect(this.position.x + this.minimap.position.x + this.game.player.position.x * this.minimap.scale - 2,
            -this.position.y + this.minimap.position.y + this.game.player.position.y * this.minimap.scale - 2, 4, 4);

        // c.strokeStyle = "rgba(100, 100, 100, 1)";
        // c.lineWidth = 2;
        // c.strokeRect(-this.position.x + this.minimap.position.x - 2, -this.position.y + this.minimap.position.y - 2, this.minimap.size.x + 4, this.minimap.size.y + 4);

        c.drawImage(this.minimap.border, this.position.x + this.minimap.position.x - 10, -this.position.y + this.minimap.position.y - 17, this.minimap.size.x + 30, this.minimap.size.y + 34)

        c.restore();
    }
}