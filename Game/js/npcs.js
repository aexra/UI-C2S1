import { AnimatedSprite } from "./animatedSprite.js";
import { NPC } from "./npc.js";
import { Vec2 } from "./vec2.js";
import { Vec3 } from "./vec3.js";
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
        this.state = states.hitted;
        this.hittedAnimation.frameIdx = 0;
        this.game.createDI(this.position, damage, iscrit);
    }
    hit(damage, iscrit) {
        if (this.immunityTimer == 0) {
            this.onHit(damage, iscrit);
            this.immunityTimer++;
        }
    }
}

export class Thanatos extends NPC {
    constructor(game) {
        super(game);
        this.size = new Vec2(100, 100);
        this.position = new Vec2(36000, 1700);

        this.positionTrail = [];
        this.segments = [];
        
        for (var i = 0; i < 4; i++) {
            var seg = new ThanatosSegment(game, this);

            // сделать рассчет положения центра сегмента
            seg.position = Vec2.concat(this.position, i == 0? new Vec2(this.size.x, 0) : new Vec2(seg.size.x * (i + 1), 0));

            this.segments.push(seg);
        }
        
        var tail = new ThanatosTail(game, this);
        // same
        tail.position.x += 100 + 80 * 4;

        this.segments.push(tail);

        for (var seg of this.segments) {
            game.npcs.push(seg);
        }
    }
    update(input, deltaTime) {
        if (this.immunityTimer != 0) {
            this.immunityTimer += deltaTime;
        }
        if (this.immunityTimer >= this.immunityInterval) {
            this.immunityTimer = 0;
        }

        if (this.positionTrail.length > this.segments.length - 1) {
            this.positionTrail.splice(this.positionTrail.length - 1, 1);
        }
    }
    draw(c) {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 100, 100);
    }
}

class ThanatosSegment extends NPC {
    constructor(game, head) {
        super(game);
        this.head = head;
        this.position = head.position.copy();
        this.size = new Vec2(80, 80)
    }
    draw(c) {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

class ThanatosTail extends NPC {
    constructor(game, head) {
        super(game);
        this.head = head;
        this.position = head.position.copy();
        this.size = new Vec2(60, 60)
    }
    draw(c) {
        c.fillStyle = "green";
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}