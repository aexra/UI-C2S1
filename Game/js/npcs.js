import { AnimatedSprite } from "./animatedSprite.js";
import { NPC } from "./npc.js";
import { Vec2 } from "./vec2.js";
import { Collision } from "./misc.js";

const states = {
    idle: 0,
    hitted: 1,
};

export class Dummy extends NPC {
    constructor(game) {
        super(game);
        this.state = states.idle;

        this.size = new Vec2(32, 48);
        
        this.idleFrame = document.getElementById("dummy0");
        this.hittedAnimation = new AnimatedSprite([
            // document.getElementById("dummy1"),
            // document.getElementById("dummy2"),
            // document.getElementById("dummy3"),
            // document.getElementById("dummy4"),
            // document.getElementById("dummy5"),
            // document.getElementById("dummy6"),
            // document.getElementById("dummy7"),
            // document.getElementById("dummy8"),
            document.getElementById("dummy9"),
            document.getElementById("dummy10"),
            document.getElementById("dummy11"),
            document.getElementById("dummy12"),
            document.getElementById("dummy13"),
            document.getElementById("dummy14"),
            document.getElementById("dummy15"),
        ], 22, this.position, this.size);
        this.hittedAnimation.onend = (s) => {
            this.state = states.idle;
        };
        this.hittedAnimation.skipFirstDelay = true;
        this.hittedAnimation.start();
    }
    update(input, deltaTime) {
        this.hp = this.maxhp;
        this.hittedAnimation.position = this.position;
        
        if (this.immunityTimer != 0) {
            this.immunityTimer += deltaTime;
        }
        if (this.immunityTimer >= this.immunityInterval) {
            this.immunityTimer = 0;
        }
        if (this.immunityTimer == 0 && this.checkCollisions()) {
            this.onHit();
            this.immunityTimer++;
        }

        if (this.state == states.hitted) {
            this.hittedAnimation.update(input, deltaTime);
        }
    }
    draw(c) {
        this.drawNPC(c);
        // this.drawHitbox(c);
    }
    drawNPC(c) {
        if (this.state == states.idle) {
            c.drawImage(this.idleFrame, this.position.x, this.position.y);
        } else if (this.state == states.hitted) {
            this.hittedAnimation.draw(c);
        }
    }
    drawHP(c) {

    }
    drawDamageTaken(c) {

    }
    checkCollisions() {
        for (var projectile of this.game.projectiles) {
            if (Collision.collideBox(this.position, this.size, 0, 
                projectile.hitbox.position, 
                projectile.hitbox.size, 
                projectile.rotationAngleRad)) 
                {
                return true;
            }
        }
        return false;
    }
    onHit() {
        this.state = states.hitted;
        this.hittedAnimation.frameIdx = 0;
    }
}