import { Vec2 } from "./vec2.js";

export class Weapon {
    constructor(player) {
        this.player = player;
        this.baseDamage = 1;
        this.damageMultiplier = 1;
        this.baseSpeed = 1;
        this.speedMultiplier = 1;
        this.baseCastDuration = 1;
        this.image = document.getElementById("terraBlade");
        this.size = new Vec2(46, 54);
        this.drawDistance = this.player.size.x / 2;

        this.recalc_params();
    }
    update(input, deltaTime) {

    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.size.x, this.size.y, this.player.rotation * (this.player.position.x + (this.player.rotation > 0? this.drawDistance : 0)), this.player.position.y, this.player.rotation * this.size.x, this.size.y);
    }
    recalc_params() {

    }
    onFire(input, deltaTime) {

    }
}