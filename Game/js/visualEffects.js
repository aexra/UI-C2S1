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
                frame: 800,
                width: 50,
                dw: 50
            },
            {
                frame: 1000,
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

        // if (this.lifetimer <= this.keyframes[0].frame) {
        //     this.size.x += (this.keyframes[0].width - this.size.x) / this.keyframes[0].frame * deltaTime;
        // }
        // else if (this.lifetimer <= this.keyframes[1].frame) {
        //     this.size.x += this.keyframes[0].width / this.keyframes[0].frame * deltaTime;
        // }
        // else if (this.lifetimer <= this.keyframes[2].frame) {

        // }
        // else if (this.lifetimer <= this.keyframes[3].frame) {
            
        // }
    }
    draw(c) {
        c.save();
        c.fillStyle = "#fff";
        c.filter = "drop-shadow(0 0 50px #fff)";
        c.fillRect(this.topleft().x, this.topleft().y, this.size.x, this.size.y);
        c.restore();
    }
}