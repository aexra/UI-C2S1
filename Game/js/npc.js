import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";
import { Collision } from "./misc.js";

export class NPC extends GameObject {
    constructor(game) {
        super();
        this.game = game;

        this.immortal = false;
        this.friendly = false;

        this.maxhp = 5;
        this.hp = this.maxhp;

        this.image = null;

        this.immunityInterval = 150;
        this.immunityTimer = 0;
    }
    update(input, deltaTime) {
        if (this.immunityTimer != 0) {
            this.immunityTimer += deltaTime;
        }
        if (this.immunityTimer >= this.immunityInterval) {
            this.immunityTimer = 0;
        }
    }
    draw(c) {

    }
    drawNPC(c) {

    }
    drawHP(c) {

    }
    drawDamageTaken(c) {

    }
    drawHitbox(c) {
        c.save();

        c.fillStyle = "rgba(140, 0, 0, 0.4)";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        c.restore();
    }
    checkPojectilesCollisions() {
        for (var projectile of this.game.projectiles) {
            if (Collision.collideBox(this.position, this.size, 0, 
                projectile.hitbox.position, 
                projectile.hitbox.size, 
                projectile.rotationAngleRad)) 
                {
                return projectile;
            }
        }
        return null;
    }
    onHit(damage, iscrit) {
        this.game.createDI(this.position, damage, iscrit);
    }
    hit(damage, iscrit) {
        if (this.immunityTimer == 0) {
            this.onHit(damage, iscrit);
            this.immunityTimer++;
        }
    }
}