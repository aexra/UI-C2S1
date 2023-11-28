import { GameObject } from "./gameObject.js";
import { Random } from "./misc.js";
import { Vec2 } from "./vec2.js";

export class DamageIndicator extends GameObject {
    constructor(game, origin, damage) {
        super();
        this.game = game;
        this.position = origin.copy();
        this.size = new Vec2(100, 100);

        this.text = damage.toString()

        this.velocity = new Vec2(Random.randf(0, 0.5, 2), Random.randf(0, 0.5, 2));
        this.direction = new Vec2(Random.randf(-1, 1, 2), Random.randf(-1, 1, 2));
        this.acceleration = 0.004;

        this.alpha = 1;
        this.startfade = 800;
        this.lifetime = 1500;
        this.timer = 0;

        this.onfade = function(s){};

        this.start();
    }
    start() {

    }
    update(input, deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= this.startfade) {
            this.alpha -= 1 / (this.lifetime - this.startfade) * deltaTime;
        }
        if (this.timer >= this.lifetime) {
            this.onfade();
        }
        this.velocity.x -= this.acceleration;
        this.velocity.y -= this.acceleration;
        if (this.velocity.x < 0) this.velocity.x = 0;
        if (this.velocity.y < 0) this.velocity.y = 0;
        this.position.translate(new Vec2(this.direction.x * this.velocity.x * deltaTime, this.direction.y * this.velocity.y * deltaTime));
    }
    draw(c) {
        c.save();
        c.fillStyle = "white";
        c.globalAlpha = this.alpha;
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.restore();
    }
}