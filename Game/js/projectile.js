import { Vec2 } from "./vec2.js";

export class Projectile {
    constructor(weapon, ix, iy) {
        this.weapon = weapon;

        this.baseSpeed = 1;
        this.speedMultiplier = 1;

        this.baseDamage = 1;
        this.damageMultiplier = 1;

        this.image;
        this.width;
        this.height;
        this.position = new Vec2(weapon.player.position.x + weapon.player.width / 2, weapon.player.position.y + weapon.player.height / 2);
        this.initialpos = new Vec2(ix, iy);
        this.spawnRadius = 100;

        this.initialAngleRad = -Math.atan((this.position.y - this.initialpos.y) / (this.initialpos.x - this.position.x)) + (this.initialpos.x < this.position.x? Math.PI : 0);
        this.rotationAngleRad = this.initialAngleRad;
        this.position.x += this.spawnRadius * Math.cos(this.initialAngleRad);
        this.position.y += this.spawnRadius * Math.sin(this.initialAngleRad);
    }
    update(input, deltaTime) {

    }
    draw(context) {
        
    }
}