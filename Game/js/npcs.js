import { AnimatedSprite } from "./animatedSprite.js";
import { NPC } from "./npc.js";
import { Vec2 } from "./vec2.js";
import { Vec3 } from "./vec3.js";
import { Collision, Random } from "./misc.js";
import { ThanatosAI } from "./ai.js";

export const states = {
    idle: 0,
    hitted: 1,
    attack: 2,
    still: 3,
    followCursor: 4,
    chasePlayer: 5,
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

        this.hitbox = {
            size: Vec2.minus(this.size.copy(), new Vec2(10, 10)),
            position: new Vec2(this.position.x, this.position.y),
        };
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

        // this.updateHitbox(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updateHitbox(input, deltaTime) {
        this.hitbox.position = new Vec2(this.position.x, this.position.y);
    }
    draw(c) {
        this.drawNPC(c);
        this.drawHitbox(c);
    }
    drawNPC(c) {
        if (this.state == states.idle) {
            c.drawImage(this.idleFrame, this.position.x - this.size.x / 2, this.position.y - this.size.y / 2);
        } else if (this.state == states.hitted) {
            this.hittedAnimation.draw(c);
        }
    }
    drawHP(c) {

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
        this.position = new Vec2(36000, 1000);

        // SPRITES
        this.minimapicon = {
            normal: document.getElementById("thanatosNormalHeadIcon"),
            buffed: document.getElementById("thanatosBuffedHeadIcon"),
        };
        this.minimaptag = 'thanatos';
        this.image = document.getElementById("thanatosHead");
        this.shieldMask = document.getElementById("thanatosHeadShield");
        this.nframes = 5;
        this.frame = 0;
        this.initialRotation = Math.PI / 2;
        
        // BEHAVIOUR AND VISUAL STATES
        this.state = states.chasePlayer;
        this.visualStates = {
            normal: 0,
            buffed: 1,
            switchingToNormal: 2,
            switchingToBuffed: 3,
        };
        this.visualState = this.visualStates.normal;
        
        // PHASE SWITCH ANIMATION
        this.fps = 12;
        this.switchInterval = 1000 / this.fps;
        this.switchTimer = 0;

        // HITSOUNDS COOLDOWN
        this.hitsoundcd = 100;
        this.hitsoundTimer = 0;

        // VARIABLE FIELDS
        this.velocity = 0; // number
        this.directionalVector = new Vec2(); // vec2
        this.direction = 0; // rad
        this.lastRotation = 0;
        this.alpha = 0.2;
        this.shieldedAlpha = 0.2;

        // OTHER SEGMENTS
        this.segments = [];
        this.nsegments = 102;
        for (var i = 0; i < this.nsegments; i += 2) {
            this.addSegment('body1');
            this.addSegment('body2');
        }
        this.addSegment('tail');
        
        for (var i = this.segments.length - 1; i >= 0; i--) {
            game.npcs.push(this.segments[i]);
        }

        game.npcs.push(this);

        this.ai = new ThanatosAI(this);
    }
    update(input, deltaTime) {
        if (input.keys.includes('k')) {
            if (this.visualState == this.visualStates.normal) {
                this.open();
            } else if (this.visualState == this.visualStates.buffed) {
                this.close();
            }
        }
        this.updateImmunity(input, deltaTime);
        this.updateHitsounds(input, deltaTime);
        this.ai.update(input, deltaTime);
        this.updatePosition(input, deltaTime);
        this.updateVisual(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updateVisual(input, deltaTime) {
        if (this.visualState == this.visualStates.switchingToBuffed) {
            this.switchTimer += deltaTime;
            if (this.switchTimer >= this.switchInterval) {
                this.switchTimer = 0;
                this.frame++;
                if (this.frame == 4) {
                    this.visualState = this.visualStates.buffed;
                }
            }
        }
        if (this.visualState == this.visualStates.switchingToNormal) {
            this.switchTimer += deltaTime;
            if (this.switchTimer >= this.switchInterval) {
                this.switchTimer = 0;
                this.frame--;
                if (this.frame == 0) {
                    this.visualState = this.visualStates.normal;
                }
            }
        }
    }
    updateHitsounds(input, deltaTime) {
        if (this.hitsoundTimer != 0) {
            this.hitsoundTimer += deltaTime;
            if (this.hitsoundTimer >= this.hitsoundcd) {
                this.hitsoundTimer = 0;
            }
        }
    }
    updatePosition(input, deltaTime) {
        this.position.translate(this.directionalVector.multiply(this.velocity));
    }
    draw(c) {
        c.save();

        c.translate(this.position.x, this.position.y);

        this.drawHead(c);
        // this.drawHeadLine(c);

        c.translate(-this.position.x, -this.position.y);
        // this.drawHitbox(c);

        c.restore();
    }
    drawHeadLine(c) {
        c.strokeStyle = "red";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(this.velocity.x, this.velocity.y);
        c.stroke();
    }
    drawHead(c) {
        c.save();
        c.rotate(this.getRotation());
        switch(this.visualState) {
            case this.visualStates.normal:
                this.drawNormal(c);
                break;
            case this.visualStates.buffed:
                this.drawVulnurable(c);
                break;
            case this.visualStates.switchingToNormal:
                this.drawVulnurable(c);
                break;
            case this.visualStates.switchingToBuffed:
                this.drawNormal(c);
                break;
            default:
                this.drawVulnurable(c);
        }
        c.restore();
    }
    drawNormal(c) {
        c.globalAlpha = this.alpha;
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.globalAlpha = this.shieldedAlpha;
        c.drawImage(this.shieldMask, 0, 0 * this.size.y, this.size.x, this.size.y, -this.size.x * 1.5 / 2, -this.size.y * 1.5 / 2, this.size.x * 1.5, this.size.y * 1.5);
    }
    drawVulnurable(c) {
        c.globalAlpha = 1;
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
    open() {
        this.visualState = this.visualStates.switchingToBuffed;
    }
    close() {
        this.visualState = this.visualStates.switchingToNormal;
    }
    onHit(damage, iscrit) {
        var type = this.visualState == this.visualStates.normal? "shield" : null;
        damage = this.visualState == this.visualStates.normal? iscrit? 1 : 0 : damage;
        this.game.createDI(this.position, damage, iscrit, type);
        if (this.hitsoundTimer == 0) {
            var hitsound = new Audio("../resources/game/npcs/thanatos/hit.wav");
            hitsound.volume = 0.1;
            hitsound.play();
            this.hitsoundTimer++;
        }
    }
    getRotation() {
        if (this.lastRotation != 0 && this.directionalVector.x == 0 && this.directionalVector.y == 0) {
            return this.segments[0].getRotation();
        }
        this.lastRotation = Math.atan(this.directionalVector.y / this.directionalVector.x) + this.initialRotation + (this.directionalVector.x < 0? Math.PI : 0);
        return this.lastRotation;
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
        // TODO: position calculation
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
        this.minimaptag = 'thanatos_segment';
        this.image = document.getElementById("thanatosBody1");
        this.shieldMask = document.getElementById("thanatosBody1Shield");
        
        this.initialRotation = Math.PI / 2;

        this.diff = new Vec2();
        this.maxdist = 80;
    }
    update(input, deltaTime) {
        this.updateImmunity(input, deltaTime);
        this.diff = Vec2.minus(this.next.position, this.position);
        this.updatePosition(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updatePosition(input, deltaTime) {
        if (this.diff.length() > this.maxdist) {
            var alpha = Math.atan(this.diff.y / this.diff.x);
            var maxdistvector = new Vec2(this.maxdist * Math.cos(alpha) * (this.diff.x < 0? -1 : 1), this.maxdist * Math.sin(alpha) * (this.diff.x < 0? -1 : 1));
            var travel = Vec2.minus(this.diff, maxdistvector);
            this.position.translate(travel);
        }
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.getRotation());
        switch(this.head.visualState) {
            case this.head.visualStates.normal:
                this.drawNormal(c);
                break;
            case this.head.visualStates.buffed:
                this.drawVulnurable(c);
                break;
            case this.head.visualStates.switchingToNormal:
                this.drawVulnurable(c);
                break;
            case this.head.visualStates.switchingToBuffed:
                this.drawNormal(c);
                break;
            default:
                this.drawVulnurable(c);
        }
        this.drawHitbox(c);
        c.restore();
    }
    drawNormal(c) {
        c.globalAlpha = this.head.alpha;
        c.drawImage(this.image, 0, this.head.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.globalAlpha = this.head.shieldedAlpha;
        c.drawImage(this.shieldMask, 0, 0 * this.size.y, this.size.x, this.size.y, -this.size.x * 1.5 / 2, -this.size.y * 1.5 / 2, this.size.x * 1.5, this.size.y * 1.5);
    }
    drawVulnurable(c) {
        c.globalAlpha = 1;
        c.drawImage(this.image, 0, this.head.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
    getRotation() {
        return Math.atan(this.diff.y / this.diff.x) + this.initialRotation + (this.diff.x < 0? Math.PI : 0);
    }
    onHit(damage, iscrit) {
        var type = this.head.visualState == this.head.visualStates.normal? "shield" : null;
        damage = this.head.visualState == this.head.visualStates.normal? iscrit? 1 : 0 : damage;
        this.game.createDI(this.position, damage, iscrit, type);
        if (this.head.hitsoundTimer == 0) {
            var hitsound = new Audio("../resources/game/npcs/thanatos/hit.wav");
            hitsound.volume = 0.1;
            hitsound.play();
            this.head.hitsoundTimer++;
        }
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
        this.minimaptag = 'thanatos_segment';
        this.image = document.getElementById("thanatosBody2");
        this.shieldMask = document.getElementById("thanatosBody2Shield");
        
        this.initialRotation = Math.PI / 2;

        this.diff = new Vec2();
        this.maxdist = 80;
    }
    update(input, deltaTime) {
        this.updateImmunity(input, deltaTime);
        this.diff = Vec2.minus(this.next.position, this.position);
        this.updatePosition(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updatePosition(input, deltaTime) {
        if (this.diff.length() > this.maxdist) {
            var alpha = Math.atan(this.diff.y / this.diff.x);
            var maxdistvector = new Vec2(this.maxdist * Math.cos(alpha) * (this.diff.x < 0? -1 : 1), this.maxdist * Math.sin(alpha) * (this.diff.x < 0? -1 : 1));            var travel = Vec2.minus(this.diff, maxdistvector);
            this.position.translate(travel);
        }
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.getRotation());
        switch(this.head.visualState) {
            case this.head.visualStates.normal:
                this.drawNormal(c);
                break;
            case this.head.visualStates.buffed:
                this.drawVulnurable(c);
                break;
            case this.head.visualStates.switchingToNormal:
                this.drawVulnurable(c);
                break;
            case this.head.visualStates.switchingToBuffed:
                this.drawNormal(c);
                break;
            default:
                this.drawVulnurable(c);
        }
        this.drawHitbox(c);
        c.restore();
    }
    drawNormal(c) {
        c.globalAlpha = this.head.alpha;
        c.drawImage(this.image, 0, this.head.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.globalAlpha = this.head.shieldedAlpha;
        c.drawImage(this.shieldMask, 0, 0 * this.size.y, this.size.x, this.size.y, -this.size.x * 1.5 / 2, -this.size.y * 1.5 / 2, this.size.x * 1.5, this.size.y * 1.5);
    }
    drawVulnurable(c) {
        c.globalAlpha = 1;
        c.drawImage(this.image, 0, this.head.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
    getRotation() {
        return Math.atan(this.diff.y / this.diff.x) + this.initialRotation + (this.diff.x < 0? Math.PI : 0);
    }
    onHit(damage, iscrit) {
        var type = this.head.visualState == this.head.visualStates.normal? "shield" : null;
        damage = this.head.visualState == this.head.visualStates.normal? iscrit? 1 : 0 : damage;
        this.game.createDI(this.position, damage, iscrit, type);
        if (this.head.hitsoundTimer == 0) {
            var hitsound = new Audio("../resources/game/npcs/thanatos/hit.wav");
            hitsound.volume = 0.1;
            hitsound.play();
            this.head.hitsoundTimer++;
        }
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
        this.minimaptag = 'thanatos_segment';
        this.image = document.getElementById("thanatosTail");
        this.shieldMask = document.getElementById("thanatosTailShield");
        
        this.initialRotation = Math.PI / 2;

        this.diff = new Vec2();
        this.maxdist = 80;
    }
    update(input, deltaTime) {
        this.updateImmunity(input, deltaTime);
        this.diff = Vec2.minus(this.next.position, this.position);
        this.updatePosition(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updatePosition(input, deltaTime) {
        if (this.diff.length() > this.maxdist) {
            var alpha = Math.atan(this.diff.y / this.diff.x);
            var maxdistvector = new Vec2(this.maxdist * Math.cos(alpha) * (this.diff.x < 0? -1 : 1), this.maxdist * Math.sin(alpha) * (this.diff.x < 0? -1 : 1));            var travel = Vec2.minus(this.diff, maxdistvector);
            this.position.translate(travel);
        }
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.getRotation());
        switch(this.head.visualState) {
            case this.head.visualStates.normal:
                this.drawNormal(c);
                break;
            case this.head.visualStates.buffed:
                this.drawVulnurable(c);
                break;
            case this.head.visualStates.switchingToNormal:
                this.drawVulnurable(c);
                break;
            case this.head.visualStates.switchingToBuffed:
                this.drawNormal(c);
                break;
            default:
                this.drawVulnurable(c);
        }
        c.restore();
    }
    drawNormal(c) {
        c.globalAlpha = this.head.alpha;
        c.drawImage(this.image, 0, this.head.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.globalAlpha = this.head.shieldedAlpha;
        c.drawImage(this.shieldMask, 0, 0 * this.size.y, this.size.x, this.size.y, -this.size.x * 1.5 / 2, -this.size.y * 1.5 / 2, this.size.x * 1.5, this.size.y * 1.5);
    }
    drawVulnurable(c) {
        c.globalAlpha = 1;
        c.drawImage(this.image, 0, this.head.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
    getRotation() {
        return Math.atan(this.diff.y / this.diff.x) + this.initialRotation + (this.diff.x < 0? Math.PI : 0);
    }
    onHit(damage, iscrit) {
        var type = this.head.visualState == this.head.visualStates.normal? "shield" : null;
        damage = this.head.visualState == this.head.visualStates.normal? iscrit? 1 : 0 : damage;
        this.game.createDI(this.position, damage, iscrit, type);
        if (this.head.hitsoundTimer == 0) {
            var hitsound = new Audio("../resources/game/npcs/thanatos/hit.wav");
            hitsound.volume = 0.1;
            hitsound.play();
            this.head.hitsoundTimer++;
        }
    }
}