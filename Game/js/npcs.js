import { AnimatedSprite } from "./animatedSprite.js";
import { NPC } from "./npc.js";
import { Vec2 } from "./vec2.js";
import { Vec3 } from "./vec3.js";
import { Collision, Config, Random } from "./misc.js";
import { ThanatosAI } from "./ai.js";
import { SpriteSheet } from "./spritesheet.js";
import { ThanatosDeathScreen } from "./visualEffects.js";

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

        this.updateHitbox(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updateHitbox(input, deltaTime) {
        this.hitbox.position = new Vec2(this.position.x, this.position.y);
    }
    draw(c) {
        this.drawNPC(c);
        // this.drawHitbox(c);
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

export class ThanatosSegment extends NPC {
    constructor(game) {
        super(game);

        this.visualStates = {
            normal: 0,
            buffed: 1,
            switchingToNormal: 2,
            switchingToBuffed: 3,
            transparent: 4,
        };
        this.visualState = this.visualStates.normal;

        // PHASE SWITCH ANIMATION
        this.fps = 12;
        this.switchInterval = 1000 / this.fps;
        this.switchTimer = 0;
        this.nframes = 5;
        this.frame = 0;

        this.alpha = 0.1;
        this.shieldedAlpha = 0.1;

        this.death_pe = this.game.createParticleEmitter();
        this.death_pe.perEmission = 20;
        this.death_pe.lifeTime = new Vec2(1, 1);
        this.death_pe.particleSize = new Vec2(15, 15);
        this.death_pe.shape = document.getElementById("flareParticle");
        this.death_pe.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.death_pe.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.death_pe.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.death_pe.angle = 360;
        this.death_pe.lightParticles = true;
        this.death_pe.rotationSpeed = 0.2;
        this.death_pe.particleGravityModifier = 0.2;
        this.death_pe.particleInitialSpeed = new Vec2(10, 10)
        this.death_pe.setFrequency(2);
    }
    open() {
        if (this.visualState == this.visualStates.normal) {
            this.visualState = this.visualStates.switchingToBuffed;
        }
    }
    close() {
        if (this.visualState == this.visualStates.buffed) {
            this.visualState = this.visualStates.switchingToNormal;
        }
    }
    immune() {
        this.visualState = this.visualStates.transparent;
    }
    draw(c) {
        c.save();
        c.translate(this.position.x, this.position.y);
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
            case this.visualStates.transparent:
                this.drawTransparent(c);
                break;
            default:
                this.drawVulnurable(c);
        }
        c.restore();
        // this.drawHitbox(c);
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
        this.death_pe.position = this.position.copy();
    }
    drawNormal(c) {
        c.globalAlpha = 0.8;
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.globalAlpha = 1;
        this.glowSpriteSheet.draw(c, new Vec2(-this.size.x / 2, -this.size.y / 2), this.frame);
    }
    drawTransparent(c) {
        c.globalAlpha = this.alpha;
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        c.globalAlpha = this.shieldedAlpha;
        c.drawImage(this.shieldMask, 0, 0 * this.size.y, this.size.x, this.size.y, -this.size.x * 1.5 / 2, -this.size.y * 1.5 / 2, this.size.x * 1.5, this.size.y * 1.5);
    }
    drawVulnurable(c) {
        c.globalAlpha = 0.8;
        c.drawImage(this.image, 0, this.frame * this.size.y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    }
    emitDeathPE() {
        this.death_pe.emit();
    }
    getHitbox() {
        if (this.hitbox) {
            return this.hitbox;
        } else {
            return {
                size: new Vec2(130, 130),
                position: this.position.copy(),
            }
        }
    }
}

export class ThanatosChildSegment extends ThanatosSegment {
    constructor(game, head, next) {
        super(game);
        this.head = head;
        this.next = next;
        this.position = head.position.copy();
        
        this.initialRotation = Math.PI / 2;

        this.diff = new Vec2();
        this.maxdist = 50;

        this.collisionDamage = 
            game.level == 4? 100 :
            game.level == 3? 80 :
            game.level == 2? 60 : 20;
    }
    update(input, deltaTime) {
        this.updateImmunity(input, deltaTime);
        this.updatePosition(input, deltaTime);
        this.updateVisual(input, deltaTime);
        this.updateLights(input, deltaTime);
    }
    updatePosition(input, deltaTime) {
        this.diff = Vec2.minus(this.next.position, this.position);
        if (this.diff.length() > this.maxdist) {
            this.diff = Vec2.minus(this.next.position, this.position);
            var alpha = Math.atan(this.diff.y / this.diff.x);
            var maxdistvector = new Vec2(this.maxdist * Math.cos(alpha) * (this.diff.x < 0? -1 : 1), this.maxdist * Math.sin(alpha) * (this.diff.x < 0? -1 : 1));
            var travel = Vec2.minus(this.diff, maxdistvector);
            this.position.translate(travel);
        }
    }
    getRotation() {
        return Math.atan(this.diff.y / this.diff.x) + this.initialRotation + (this.diff.x < 0? Math.PI : 0);
    }
    onHit(damage, iscrit) {
        if (this.visualState == this.visualStates.normal) return;
        var type = this.visualState == this.visualStates.transparent? "shield" : null;
        damage = this.visualState == this.visualStates.transparent? iscrit? 1 : 0 : damage;
        this.game.createDI(this.position, damage, iscrit, type);
        if (this.head.hitsoundTimer == 0) {
            var hitsound = new Audio("../resources/game/npcs/thanatos/hit.wav");
            hitsound.volume = Config.audio.sfx;
            hitsound.play();
            this.head.hitsoundTimer++;
        }
        this.head.hp -= damage;
    }
}

export class Thanatos extends ThanatosSegment {
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
        this.glowSpriteSheet = new SpriteSheet("thanatosHeadGlow", this.size.copy());
        this.initialRotation = Math.PI / 2;
        
        // BEHAVIOUR AND VISUAL STATES
        this.state = states.chasePlayer;

        // HITSOUNDS COOLDOWN
        this.hitsoundcd = 100;
        this.hitsoundTimer = 0;

        // VARIABLE FIELDS
        this.velocity = 0; // number
        this.directionalVector = new Vec2(); // vec2
        this.direction = 0; // rad
        this.lastRotation = 0;

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

        // game values
        this.maxHP = game.level == 4? 100000 :
            game.level == 3? 80000 : 
            game.level == 2? 50000 : 1000;
        this.hp = this.maxHP;
        this.collisionDamage = 
            game.level == 4? 250 :
            game.level == 3? 200 :
            game.level == 2? 100 : 50;

        this.ai = new ThanatosAI(this);

        this.dead = false;
        this.deathingInterval = 3500;
        this.deathingTimer = 0;
    }
    update(input, deltaTime) {
        if (this.dead) {
            this.hp = 0;
            this.velocity = Math.max(0, this.velocity - 0.00001 * deltaTime);
            this.updatePosition(input, deltaTime);
            this.deathingTimer += deltaTime;
            if (this.deathingTimer >= this.deathingInterval) {
                this.game.deleteParticleEmitter(this.death_pe);
                for (var i = this.nsegments - 1; i >= 0; i--) {
                    this.game.deleteParticleEmitter(this.segments[i].death_pe);
                    this.game.npcs.splice(this.game.npcs.indexOf(this.segments[i]), 1);
                }
                setTimeout(() => {
                    var element = document.getElementById("victory-screen");
                    element.classList.add("screen-visible");
                }, 1000);
            }
            return;
        }
        if (this.hp <= 0) {
            this.dead = true;
            this.sound = new Audio("../resources/game/npcs/sounds/thanatos/death.ogg");
            this.sound.volume = Config.audio.sfx;
            this.sound.play();
            this.velocity = 1;
            this.game.introSound.pause();
            for (const seg of this.segments) {
                seg.emitDeathPE();
            }
            new ThanatosDeathScreen(this.game);
            return;
        }
        this.game.score = (Math.floor((1 - this.hp / this.maxHP) * 100));
        this.updateImmunity(input, deltaTime);
        this.updateHitsounds(input, deltaTime);
        this.ai.update(input, deltaTime);
        this.updatePosition(input, deltaTime);
        this.updateVisual(input, deltaTime);
        this.updateLights(input, deltaTime);
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
            case this.visualStates.transparent:
                this.drawTransparent(c);
                break;
            default:
                this.drawVulnurable(c);
        }
        c.restore();
    }
    onHit(damage, iscrit) {
        if (this.visualState == this.visualStates.normal) return;
        var type = this.visualState == this.visualStates.transparent? "shield" : null;
        damage = this.visualState == this.visualStates.transparent? iscrit? 1 : 0 : damage;
        this.game.createDI(this.position, damage, iscrit, type);
        if (this.hitsoundTimer == 0) {
            var hitsound = new Audio("../resources/game/npcs/thanatos/hit.wav");
            hitsound.volume = Config.audio.sfx;
            hitsound.play();
            this.hitsoundTimer++;
        }
        this.hp -= damage;
    }
    openHeadAndRandomSegments(nseg=this.game.level == 4? 20 : this.game.level == 3? 23 : this.game.level == 2? 26 : 30) {
        this.open();
        this.openRandomSegments(nseg);
    }
    openRandomSegments(nseg=this.game.level == 4? 20 : this.game.level == 3? 23 : this.game.level == 2? 26 : 30) {
        var toOpen = [];
        for (var i = 0; i < nseg; i++) {
            var randi = Random.randi(1, this.nsegments);
            while (toOpen.includes(randi)) {
                randi = Random.randi(1, this.nsegments);
            }
            toOpen.push(randi);
        }
        this.closeAllSegments();
        for (var iseg of toOpen) {
            this.segments[iseg].open();
        }
    }
    openAllSegments() {
        for (var seg of this.segments) {
            seg.open();
        }
    }
    closeAllSegments() {
        for (var seg of this.segments) {
            seg.close();
        }
    }
    immuneAllSegments() {
        for (var seg of this.segments) {
            seg.immune();
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

class ThanatosBody1 extends ThanatosChildSegment {
    constructor(game, head, next) {
        super(game, head, next);
        this.size = new Vec2(148, 98)

        this.minimapicon = {
            normal: document.getElementById("thanatosNormalBody1Icon"),
            buffed: document.getElementById("thanatosBuffedBody1Icon"),
        }
        this.minimaptag = 'thanatos_segment';
        this.image = document.getElementById("thanatosBody1");
        this.shieldMask = document.getElementById("thanatosBody1Shield");
        this.glowSpriteSheet = new SpriteSheet("thanatosBody1Glow", this.size.copy());
    }
}

class ThanatosBody2 extends ThanatosChildSegment {
    constructor(game, head, next) {
        super(game, head, next);
        this.size = new Vec2(136, 100)

        this.minimapicon = {
            normal: document.getElementById("thanatosNormalBody2Icon"),
            buffed: document.getElementById("thanatosBuffedBody2Icon"),
        }
        this.minimaptag = 'thanatos_segment';
        this.image = document.getElementById("thanatosBody2");
        this.shieldMask = document.getElementById("thanatosBody2Shield");
        this.glowSpriteSheet = new SpriteSheet("thanatosBody2Glow", this.size.copy());
    }
}

class ThanatosTail extends ThanatosChildSegment {
    constructor(game, head, next) {
        super(game, head, next);
        this.size = new Vec2(84, 118)

        this.minimapicon = {
            normal: document.getElementById("thanatosNormalTailIcon"),
            buffed: document.getElementById("thanatosBuffedTailIcon"),
        }
        this.minimaptag = 'thanatos_segment';
        this.image = document.getElementById("thanatosTail");
        this.shieldMask = document.getElementById("thanatosTailShield");
        this.glowSpriteSheet = new SpriteSheet("thanatosTailGlow", this.size.copy());
    }
}