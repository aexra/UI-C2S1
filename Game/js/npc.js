import { GameObject } from "./gameObject.js";
import { Vec2 } from "./vec2.js";
import { Collision } from "./misc.js";
import { Light } from "./light.js";

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

        this.lights = [new Light(this.position, 200)];

        this.collisionDamage = 0;
    }
    update(input, deltaTime) {
        this.updateImmunity(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updateLights(input, deltaTime) {
        for (var light of this.lights) {
            light.position = this.position;
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
    getHitbox() {
        if (this.hitbox) {
            return this.hitbox;
        } else {
            return {
                size: this.size.copy(),
                position: this.position.copy(),
            }
        }
    }
    drawHitbox(c) {
        c.save();

        // c.setTransform(1,0,0,1,0,0);
        c.globalAlpha = 1;
        c.fillStyle = "rgba(140, 0, 0, 0.4)";
        var hb = this.getHitbox();
        c.fillRect(hb.position.x - hb.size.x / 2, hb.position.y - hb.size.y / 2, hb.size.x, hb.size.y);

        c.restore();
    }
    checkPojectilesCollisions() {
        for (var projectile of this.game.projectiles) {
            if (Vec2.minus(this.position, projectile.position).length() >= 400) continue;
            if (
                Collision.collideBox(
                    this.position, 
                    this.size, 
                    projectile.hitbox.position, 
                    projectile.hitbox.size
                )
                ) 
                {
                return projectile;
            }
        }
        return null;
    }
    onHit(damage, iscrit) {
        this.game.createDI(this.position, damage, iscrit);
        this.hp -= damage;
    }
    hit(damage, iscrit) {
        if (this.immunityTimer == 0) {
            this.onHit(damage, iscrit);
            this.immunityTimer++;
        }
    }
    updateImmunity(input, deltaTime) {
        if (this.immunityTimer != 0) {
            this.immunityTimer += deltaTime;
        }
        if (this.immunityTimer >= this.immunityInterval) {
            this.immunityTimer = 0;
        }
    }
}