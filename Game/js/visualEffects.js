import { VisualEffect } from "./visualEffect.js";
import { Vec2 } from "./vec2.js";

export class DraedonInitiatingBeam extends VisualEffect {
    constructor(game) {
        super(game);
        this.lifetime = 3000;
        
        this.position = this.game.map.codebreaker.position.copy();
        this.size = new Vec2(100, 100);
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);
    }
    draw(c) {
        c.fillStyle = "red";
        c.fillRect(this.topleft().x, this.topleft().y, this.size.x, this.size.y);
    }
}