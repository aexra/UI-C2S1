import { Vec2 } from "./vec2.js";
import { Random, Config } from "./misc.js";

class Accessory {
    constructor(player) {
        this.player = player;
    }
    update(input, deltaTime) {

    }
    draw(c) {

    }
}

class Wings {
    constructor(player) {
        this.player = player;
        this.image = document.getElementById("flameWings");
        this.size = new Vec2(100, 60);

        // анимация
        this.fps = 10;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.maxFrame = 3;
        this.frame = 2;
        this.soaringFrame = 2;
        this.standingFrame = 2;

        // свойства крыльев
        this.lift = 0.2;
        this.maxVelocityY = -10;

        // эмиттеры партиклов
        this.pe1 = player.game.createParticleEmitter();
        this.pe1.setFrequency(10);
        this.pe1.lifeTime = new Vec2(1, 1);
        this.pe1.particleSize = new Vec2(15, 15);
        this.pe1.shape = document.getElementById("shadowFlame");
        this.pe1.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.pe1.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.pe1.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.pe1.angle = 90;
        this.pe1.lightParticles = true;
        this.pe1.rotationSpeed = 0.1;
        this.pe1.position = this.player.position.copy();

        this.pe2 = player.game.createParticleEmitter();
        this.pe2.setFrequency(10);
        this.pe2.lifeTime = new Vec2(1, 1);
        this.pe2.particleSize = new Vec2(15, 15);
        this.pe2.shape = document.getElementById("shadowFlame");
        this.pe2.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.pe2.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.pe2.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.pe2.angle = 90;
        this.pe2.lightParticles = true;
        this.pe2.rotationSpeed = 0.1;
        this.pe2.position = Vec2.concat(this.player.position.copy(), new Vec2(-10, 10));
    }
    update(input, deltaTime) {
        // при зажатом пробеле
        if (input.keys.includes(" ")) {
            // анимация
            if (this.frameTimer > this.frameInterval) {
                this.frameTimer = 0;
                if (this.frame < this.maxFrame) this.frame++;
                else this.frame = 0;
            // партиклы
            this.pe1.emit();
            this.pe2.emit();
            } else {
                this.frameTimer += deltaTime;
            }

            // подъем
            this.player.velocityY -= this.lift;
            this.player.velocityY = Math.max(this.player.velocityY, this.maxVelocityY);
        } else {
            if (this.player.isGrounded()) this.frame = this.standingFrame;
            else this.frame = this.soaringFrame;

            // партиклы
            this.pe1.stop();
            this.pe2.stop();
        }

        // при зажатом S
        if (input.keys.includes("s") || input.keys.includes("ы")) {
            this.player.gravityMultiplier = 1.4;
        }
        else {
            this.player.gravityMultiplier = 1;
        }

        this.pe1.position = new Vec2(
            (this.player.position.x + (this.player.size.x - this.size.x) / 2) + 20 + (this.player.rotation > 0? 0 : -30) + 40, 
            this.player.position.y + 20
        );
        this.pe2.position = new Vec2(
            (this.player.position.x + (this.player.size.x - this.size.x) / 2) + 20 + (this.player.rotation > 0? 0 : 60) - 10, 
            this.player.position.y + 20 + 10
        );
    }
    draw(c) {
        c.translate(this.player.rotation * (this.player.position.x + (this.player.size.x - this.size.x) / 2), this.player.position.y);
        c.drawImage(this.image, 0, this.frame * 60, this.size.x, this.size.y, 0, 0, this.player.rotation * this.size.x, this.size.y);
        c.translate(-this.player.rotation * (this.player.position.x + (this.player.size.x - this.size.x) / 2), -this.player.position.y);
    }
}

export class NebulaWings extends Wings {
    constructor(player) {
        super(player);
        this.image = document.getElementById("nebulaWings");
        this.soaringFrame = 1;
        this.standingFrame = 2;
    }
}

export class SteampunkWings extends Wings {
    constructor(player) {
        super(player);
        this.image = document.getElementById("steampunkWings");
        this.soaringFrame = 3;
        this.standingFrame = 2;
    }
}

export class FlameWings extends Wings {
    constructor(player) {
        super(player);
        this.image = document.getElementById("flameWings");
        this.soaringFrame = 2;
        this.standingFrame = 1;
    }
}

export class NormalityRelocator {
    constructor(player) {
        this.player = player;
        
        this.timer = -1;
        this.timeout = 1000;

        this.emitterTimer = -1;
        this.emitterTimeout = 50;

        this.pe = player.game.createParticleEmitter();
        this.pe.setFrequency(500);
        this.pe.lifeTime = new Vec2(1, 1);
        this.pe.particleSize = new Vec2(14, 14);
        this.pe.shape = document.getElementById("relocator");
        this.pe.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.pe.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.pe.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.pe.angle = 360;
        this.pe.particleInitialSpeed = new Vec2(2, 2);
        this.pe.position = this.player.position.copy();

        this.pesgap = 20;
        this.verticalpesgap = 4;
        this.pathpes = [];

        this.sound = new Audio("../resources/game/accessories/relocator.wav");
        this.sound.volume = Config.audio.sfx;
        this.sound.playbackRate = 1.4;
    }
    update(input, deltaTime) {
        if ((input.keys.includes('f') || input.keys.includes('а')) && this.timer == -1) {
            var playerCenter = Vec2.minus(this.player.position, new Vec2(this.player.size.x / 2, this.player.size.y / 2));
            var distance = Vec2.minus(new Vec2(input.mpx - this.player.size.x / 2, input.mpy - this.player.size.y / 2), playerCenter);

            this.timer = 0;
            this.emitterTimer = 0;
            this.pe.emit();
            this.sound.play();  

            var diagdist = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
            var angle = Math.atan(distance.y / distance.x);
            for (var i = 0; i <= Math.ceil(diagdist / this.pesgap); i++) {
                for (var j = 0; j < 4; j++) {
                    var chanceToEmit = Random.randi(0, 1);
                    if (chanceToEmit == 0) continue;

                    var pepos = new Vec2(
                        Math.cos(angle) * this.pesgap * i * (distance.x > 0? 1 : -1) + j * Math.sin(angle) * this.verticalpesgap * (Math.cos(angle) < 0? 1 : -1), 
                        Math.sin(angle) * this.pesgap * i * (distance.y < 0? 1 : -1) * (Math.sin(angle) < 0? 1 : -1) + j * Math.cos(angle) * this.verticalpesgap
                    );
                    pepos.add(playerCenter);

                    var pe = this.player.game.createParticleEmitter();
                    pe.setFrequency(20);
                    pe.position = pepos;
                    pe.lifeTime = new Vec2(1, 1);
                    pe.particleSize = new Vec2(6, 6);
                    pe.shape = document.getElementById("relocator");
                    pe.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
                    pe.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
                    pe.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
                    pe.particleGravityModifier = 0.5;
                    pe.onemit = (s) => {
                        s.stop();
                    };
                    pe.onParticleLifeCycleEnd = (s) => {
                        this.player.game.deleteParticleEmitter(s);
                        this.pathpes.splice(this.pathpes.indexOf(pe), 1);
                    };
                    pe.emit();

                    this.pathpes.push(pe);
                }
            }

            this.player.position = new Vec2(input.mpx - this.player.size.x / 2, input.mpy - this.player.size.y / 2);
            input.mpx += distance.x;
            input.mpy += distance.y;
        }
        if (this.timer != -1) {
            this.timer += deltaTime;
            if (this.timer >= this.timeout) {
                this.timer = -1;
            }
        }
        if (this.emitterTimer != -1) {
            this.emitterTimer += deltaTime;
            if (this.emitterTimer >= this.emitterTimeout) {
                this.emitterTimer = -1;
                this.pe.stop();
            }
        }

        this.pe.position = Vec2.concat(this.player.position.copy(), new Vec2(15, 30));
    }
    draw() {

    }
}

export class EvasionScarf extends Accessory {
    constructor(player) {
        super(player);

        this.boost = 14;
        this.oppositeBoost = 20;

        this.dashInterval = 700;
        this.immortalInterval = this.calcImmortalFrames();
        this.dashTimer = 0;

        this.player.game.input.addEventListener('doubleTap', (key) => {
            this.tryDash(key);
        });

        this.pe = player.game.createParticleEmitter();
        this.pe.setFrequency(100);
        this.pe.lifeTime = new Vec2(1, 1);
        this.pe.particleSize = new Vec2(15, 15);
        this.pe.shape = document.getElementById("redParticle");
        this.pe.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.pe.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.pe.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        // this.pe.angle = 360;
        this.pe.angle = 0;
        this.pe.lightParticles = true;
        this.pe.rotationSpeed = 0.2;
        this.pe.particleGravityModifier = 0.2;
        // this.pe.perEmission = 20;
        // this.pe.particleInitialSpeed = new Vec2(1, 1)
    }
    update(input, deltaTime) {
        if (this.dashTimer != 0) {
            this.dashTimer += deltaTime;
            if (this.dashTimer >= this.immortalInterval) {
                this.player.immortal = false;
                this.pe.stop();
            }
            if (this.dashTimer >= this.dashInterval) {
                this.dashTimer = 0;
            }
        }
        this.pe.position = new Vec2(
            this.player.position.x + this.player.size.x / 2,
            this.player.position.y + this.player.size.y,
        );
    }
    tryDash(key) {
        if (this.dashTimer == 0) {
            if (this.player.hp <= 0) return;
            this.dashTimer++;
            this.player.immortal = true;
            this.pe.emit();
            this.dashFromKey(key);
        }
    }
    dashFromKey(key) {
        if (key == "a" || key == "ф") {
            if (this.player.velocity > 0) {
                this.player.velocity -= this.oppositeBoost;
            } else {
                this.player.velocity -= this.boost;
            }
        }
        if (key == "d" || key == "в") {
            if (this.player.velocity > 0) {
                this.player.velocity += this.boost;
            } else {
                this.player.velocity += this.oppositeBoost;
            }
        }
    }
    calcImmortalFrames() {
        switch(this.player.game.level) {
            case 1:
                return 500;
            case 2:
                return 400;
            case 3:
                return 300;
            case 4:
                return 200;
            default:
                return 300;
        }
    }
}