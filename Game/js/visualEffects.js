import { VisualEffect } from "./visualEffect.js";
import { Vec2 } from "./vec2.js";

export class DraedonInitiatingBeam extends VisualEffect {
    constructor(game) {
        super(game);
        this.lifetime = 3000;
        
        this.position = this.game.map.codebreaker.position.copy();
        this.size = new Vec2(100, 100);

        this.keyframes = [800, 1000, 2500, 3000];
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);

        if (this.lifetimer <= this.keyframes[0]) {

        }
        else if (this.lifetimer <= this.keyframes[1]) {

        }
        else if (this.lifetimer <= this.keyframes[2]) {

        }
        else if (this.lifetimer <= this.keyframes[3]) {
            
        }
    }
    draw(c) {
        c.fillStyle = "red";
        c.fillRect(this.topleft().x, this.topleft().y, this.size.x, this.size.y);
    }
}