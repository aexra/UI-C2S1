import { Light } from "./light.js";
import { Vec2 } from "./vec2.js";

export class Projectile {
    constructor(weapon, ix, iy) {
        this.weapon = weapon;

        this.baseSpeed = 1;
        this.speedMultiplier = 1;

        this.baseDamage = 1;
        this.damageMultiplier = 1;

        this.image;
        this.size = new Vec2();
        this.position = new Vec2(weapon.player.position.x + weapon.player.size.x / 2, weapon.player.position.y + weapon.player.size.y / 2);
        this.initialpos = new Vec2(ix, iy);
        this.spawnRadius = 100;

        this.initialAngleRad = -Math.atan((this.position.y - this.initialpos.y) / (this.initialpos.x - this.position.x)) + (this.initialpos.x < this.position.x? Math.PI : 0);
        this.rotationAngleRad = this.initialAngleRad;
        this.position.x += this.spawnRadius * Math.cos(this.initialAngleRad);
        this.position.y += this.spawnRadius * Math.sin(this.initialAngleRad);

        this.hitbox = {
            position: this.position.copy(),
            size: this.size.copy(),
        };

        this.lights = [new Light(this.position, 360)];
    }
    update(input, deltaTime) {
        for (var light of this.lights) {
            light.posititon = this.position;
        }
    }
    draw(context) {
        
    }
}