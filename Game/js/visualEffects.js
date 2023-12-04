import { VisualEffect } from "./visualEffect.js";
import { Vec2 } from "./vec2.js";

export class DraedonInitiatingBeam extends VisualEffect {
    constructor(game) {
        super(game);
        this.lifetime = 4000;
        
        this.position = this.game.map.codebreaker.position.copy();
        this.size = new Vec2(0, 10000);
        this.position.y -= this.size.y / 2 + 60;

        this.keyframes = [
            {
                frame: 1000,
                width: 50,
                dw: 50
            },
            {
                frame: 1200,
                width: 200,
                dw: 200 - 50
            },
            {
                frame: 2500,
                width: 180,
                dw: 180 - 200
            },
            {
                frame: 3000,
                width: 0,
                dw: 0 - 180
            }
        ];
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);

        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.lifetimer <= this.keyframes[i].frame) {
                this.size.x += this.keyframes[i].dw / (this.keyframes[i].frame - (i == 0? 0 : this.keyframes[i-1].frame)) * deltaTime;
                break;
            }
        }
    }
    draw(c) {
        c.save();
        c.fillStyle = "#fff";
        c.filter = "drop-shadow(0 0 50px #fff)";
        c.fillRect(this.topleft().x, this.topleft().y, this.size.x, this.size.y);
        c.restore();
    }
}

export class ThanatosSpawnScreen extends VisualEffect {
    constructor(game) {
        super(game);
        this.lifetime = 2000;
        
        this.size = game.player.camera.size.copy();
        this.position = game.player.camera.pos.reverse();
        
        this.alpha = 0;

        this.keyframes = [
            {
                frame: 100,
                da: 0.7
            },
            {
                frame: 1900,
                da: 0
            },
            {
                frame: 2000,
                da: -0.7
            }
        ];
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);
        this.position = this.game.player.camera.pos.copy().reverse();
        this.size = this.game.player.camera.size.copy().multiply(1 / this.game.player.camera.scale.x);

        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.lifetimer <= this.keyframes[i].frame) {
                this.alpha += this.keyframes[i].da / (this.keyframes[i].frame - (i == 0? 0 : this.keyframes[i-1].frame)) * deltaTime;
                break;
            }
        }
    }
    draw(c) {
        c.save();
        c.fillStyle = "#000";
        c.globalAlpha = this.alpha;
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.font = `50px andy`;
        c.fillStyle = 'red';
        c.textBaseline = 'top';
        c.fillText("Exo 01: Thanatos", this.position.x + this.size.x / 2 - 170, this.position.y + this.size.y / 2);
        c.restore();
    }
}