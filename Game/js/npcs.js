import { AnimatedSprite } from "./animatedSprite.js";
import { NPC } from "./npc.js";
import { Vec2 } from "./vec2.js";
import { Vec3 } from "./vec3.js";
import { Collision } from "./misc.js";

const states = {
    idle: 0,
    hitted: 1,
    attack: 2,
    still: 3,
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

        // BASE PARAMETERS
        this.size = new Vec2(104, 174);
        this.position = new Vec2(36000, 1700);

        // SPRITES
        this.minimapicon = {
            normal: document.getElementById("thanatosNormalHeadIcon"),
            buffed: document.getElementById("thanatosBuffedHeadIcon"),
        };
        this.image = document.getElementById("thanatosHead");
        this.nframes = 5;
        this.frame = 0;
        this.initialRotation = Math.PI / 2;
        
        // BEHAVIOUR AND VISUAL STATES
        this.state = states.still;
        this.visualStates = {
            normal: 0,
            buffed: 1,
            switchingToNormal: 2,
            switchingToBuffed: 3,
        };
        this.visualState = this.visualStates.normal;
        
        // PHASE SWITCH ANIMATION
        this.fps = 4;
        this.switchInterval = 1000 / this.fps;
        this.switchTimer = 0;

        // VARIABLE FIELDS
        this.velocity = new Vec2(0, 5);

        // OTHER SEGMENTS
        this.segments = [];
        this.nsegments = 10;
        for (var i = 0; i < this.nsegments; i += 2) {
            this.addSegment('body1');
            this.addSegment('body2');
        }
        this.addSegment('tail');

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
    }
    draw(c) {
        c.save();

        c.translate(this.position.x, this.position.y);

        // this.drawHead(c);
        this.drawHeadLine(c);

        c.restore();
    }
    drawHeadLine(c) {
        c.strokeStyle = "red";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(600, 0);
        c.stroke();
    }
    drawHead(c) {
        c.save();
        c.rotate(this.getRotation());
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.restore();
    }
    open() {

    }
    close() {

    }
    getRotation() {
        return Math.atan(this.velocity.y / this.velocity.x) + this.initialRotation + (this.velocity.y == 0 && this.velocity.x < 0? Math.PI : 0);
    }
    addSegment(type) {
        var segment = null;
        var next = this.segments.length == 0? this : this.segments[this.segments.length - 1];
        switch(type) {
            case 'body1':
                segment = new ThanatosBody1(this.game, this, next);
                break;
            case 'body2':
                segment = new ThanatosBody2(this.game, this, next);
                break;
            case 'tail':
                segment = new ThanatosTail(this.game, this, next);
                break;
            default:
                return;
        }
        // TODO: posiotion calculation
        this.segments.push(segment);
    }
}

class ThanatosBody1 extends NPC {
    constructor(game, head, next) {
        super(game);
        this.head = head;
        this.next = next;
        this.position = head.position.copy();
        this.size = new Vec2(148, 98)

        this.minimapicon = {
            normal: document.getElementById("thanatosNormalBody1Icon"),
            buffed: document.getElementById("thanatosBuffedBody1Icon"),
        }
        this.image = document.getElementById("thanatosBody1");
        this.nframes = 5;
        this.frame = 0;
        this.initialRotation = Math.PI / 2;
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.getRotation());
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.restore();
    }
    getRotation() {
        return 0;
    }
}

class ThanatosBody2 extends NPC {
    constructor(game, head, next) {
        super(game);
        this.head = head;
        this.next = next;
        this.position = head.position.copy();
        this.size = new Vec2(136, 100)

        this.minimapicon = {
            normal: document.getElementById("thanatosNormalBody2Icon"),
            buffed: document.getElementById("thanatosBuffedBody2Icon"),
        }
        this.image = document.getElementById("thanatosBody2");
        this.nframes = 5;
        this.frame = 0;
        this.initialRotation = Math.PI / 2;
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.getRotation());
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.restore();
    }
    getRotation() {
        return 0;
    }
}

class ThanatosTail extends NPC {
    constructor(game, head, next) {
        super(game);
        this.head = head;
        this.next = next;
        this.position = head.position.copy();
        this.size = new Vec2(84, 118)

        this.minimapicon = {
            normal: document.getElementById("thanatosNormalTailIcon"),
            buffed: document.getElementById("thanatosBuffedTailIcon"),
        }
        this.image = document.getElementById("thanatosTail");
        this.nframes = 5;
        this.frame = 0;
        this.initialRotation = Math.PI / 2;
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.getRotation());
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.restore();
    }
    getRotation() {
        return 0;
    }
}