import * as accessories from "./accessories.js";
import * as weapons from "./weapons.js"
import { Vec2 } from "./vec2.js";
import { Config, Random } from "./misc.js";
import { Vec4 } from "./vec4.js";
import { Light } from "./light.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.size = new Vec2(36, 54);
        this.position = new Vec2(36000, 1720);
        this.image = document.getElementById("player");
        this.camera = {
            size: game.canvasSize,
            pos: new Vec2(),
            scale: new Vec2(1, 1),
        };

        this.direction = 0;
        this.velocity = 0;

        this.maxSpeed = 10;
        this.loseSpeed = 0.2;
        this.dropToMax = 0.6;
        this.oppositeSpeed = 0.4;
        this.acceleration = 0.07;

        this.gravity = 0.1;
        this.gravityMultiplier = 1;
        this.velocityY = 0;
        this.maxVY = 10;

        this.accessories = [
            new accessories.NebulaWings(this),
            new accessories.NormalityRelocator(this),
            new accessories.EvasionScarf(this),
        ];

        this.rotation = 1;
        this.isPlayerSpriteFlipped = false;

        this.inventory = [new weapons.TerraBlade(this)];
        this.selectedItem = this.inventory[0];

        this.mapLayer = 0;

        this.maxHP = 1000;
        this.hp = this.maxHP;
        this.immunityInterval = 1000;
        this.immunityTimer = 0;
        this.immortal = false;
        this.dead = false;

        this.lights = [new Light(this.position, 100)];

        this.hitbox = {
            position: this.position,
            size: Vec2.minus(this.size, new Vec2(4, 4)),
        };

        this.death_pe = this.game.createParticleEmitter();
        this.death_pe.perEmission = 20;
        this.death_pe.lifeTime = new Vec2(1, 1);
        this.death_pe.particleSize = new Vec2(15, 15);
        this.death_pe.shape = document.getElementById("redParticle");
        this.death_pe.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.death_pe.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.death_pe.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.death_pe.angle = 360;
        this.death_pe.lightParticles = true;
        this.death_pe.rotationSpeed = 0.2;
        this.death_pe.particleGravityModifier = 10;
        this.death_pe.particleInitialSpeed = new Vec2(2, 2)
        this.death_pe.setFrequency(20);
        this.death_pe.onemit = (s) => {
            console.log("da");
            s.stop();
        };
    }
    update(input, deltaTime) {
        if (this.dead) return;
        if (this.hp <= 0) {
            this.onDeath();
            return;
        };
        if (input.keys.includes("u")) this.death_pe.emit();
        let left = input.keys.includes("a");
        let right = input.keys.includes("d");

        this.direction = 0;
        if (left) this.direction--;
        if (right) this.direction++;

        // рассчитываем скорость по X
        if (this.direction != 0) {
            if (this.direction * (Math.abs(this.velocity) / this.velocity) < 0) {
                this.velocity += this.direction * this.oppositeSpeed;
            } else {
                this.velocity += this.direction * this.acceleration;
            }
        } else {
            if (this.velocity != 0) {
                var decrement = -Math.abs(this.velocity) / this.velocity * this.loseSpeed;
                if (decrement < 0) {
                    this.velocity = Math.max(0, this.velocity + decrement);
                } else {
                    this.velocity = Math.min(0, this.velocity + decrement);
                }
            }
        }
        
        // смещаем до максимальной
        if (this.velocity < -this.maxSpeed) {
            this.velocity += this.dropToMax;
        }
        if (this.velocity > this.maxSpeed) {
            this.velocity -= this.dropToMax;
        }

        // рассчитываем скорость по Y
        if (this.velocityY < this.maxVY * this.gravityMultiplier) this.velocityY += this.gravity * this.gravityMultiplier;
        if (this.velocityY > 0) this.velocityY = Math.min(this.maxVY * this.gravityMultiplier, this.velocityY);

        // применяем перемещение по X
        input.mpx += this.velocity;
        this.position.x += this.velocity;

        this.rotation = this.direction === 0? this.rotation : this.direction;

        // применяем перемещение по Y
        if (!this.checkIncomingFloorCollision() || input.keys.includes('s')) 
        {
            this.position.y += this.velocityY;
            input.mpy += this.velocityY;
        } else {
            // input.mpy += this.getNearestFloorCoordinate() - this.position.y;
            this.position.y = this.getNearestFloorCoordinate() - this.size.y;
            this.velocityY = 0;
        }

        if (this.selectedItem !== null) {
            this.selectedItem.update(input, deltaTime);
        }

        for (let acc of this.accessories) {
            acc.update(input, deltaTime);
        }

        this.updateCamera(input, deltaTime);
        this.translateCamera(this.game.canvasContext);

        // damage
        if (this.immunityTimer != 0) {
            this.immunityTimer += deltaTime;
            if (this.immunityTimer >= this.immunityInterval) {
                this.immunityTimer = 0;
            }
        }

        this.updateLight(input, deltaTime);
        this.death_pe.position = this.position.copy().add(this.size.copy().multiply(0.5));
    }
    draw(c) {
        if (this.hp <= 0) return;
        // перемещение камеры
        // this.translateCamera(c);
        // console.log(this.game.canvasSize);

        c.save();
        c.scale(this.rotation, 1);
        // это квадрат 2х2 в центре игрока для дебага
        // context.fillRect(this.rotation * this.x + this.rotation * this.size.x / 2, this.y + this.size.y / 2, 2, 2);
        // это квадрат 4х4 в точке игрока для дебага
        // context.fillRect(this.rotation * this.x, this.y, 4, 4);

        // это границы игрока
        // this.drawPlayerBorders(c);

        // это его хитбокс
        // this.drawHitbox(c);

        c.restore();

        c.save();
        c.scale(this.rotation, 1);

        // отрисовка аксессуаров
        this.drawAccessories(c);

        // отрисовка выбранного предмета
        this.drawSelected(c);
        
        c.restore();

        // отрисовка игрока
        c.save();
        this.drawCharacter(c);
        c.restore();
    }
    getDamage(amount) {
        if (this.immunityTimer == 0) {
            this.immunityTimer = 1;
            this.hp -= amount;

            this.onHit(amount);
        }
    }
    onHit(amount) {
        if (amount == 0) return;
        this.game.createDI(new Vec2(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2), amount, false, "player");
    }
    updateLight(input, deltaTime) {
        for (var light of this.lights) {
            light.position = this.position;
        }
    }
    updateCamera(input, deltaTime) {
        if (input.keys.includes('-')) {
            this.camera.scale.x -= 0.01;
            this.camera.scale.y -= 0.01;
        }
        if (input.keys.includes('=')) {
            this.camera.scale.x += 0.01;
            this.camera.scale.y += 0.01;
        }
        if (this.camera.scale.x < 0.5) {
            this.camera.scale.x = 0.5;
            this.camera.scale.y = 0.5;
        }
        if (this.camera.scale.x > 10) {
            this.camera.scale.x = 10;
            this.camera.scale.y = 10;
        }

        this.game.canvasTranslated = new Vec2(- (this.position.x - this.camera.size.x / this.camera.scale.x / 2 + this.size.x / 2), - (this.position.y - this.camera.size.y / this.camera.scale.y / 2 + this.size.y / 2));
        var al = - this.game.canvasTranslated.x;
        var ar = - this.game.canvasTranslated.x + this.camera.size.x / this.camera.scale.x - this.game.size.x;
        var bt = - this.game.canvasTranslated.y;
        var bb =  - this.game.canvasTranslated.y + this.camera.size.y / this.camera.scale.y - this.game.size.y;
        if (al < 0) {
            this.game.canvasTranslated.x += al;
        }
        else if (ar > 0) {
            this.game.canvasTranslated.x += ar;
        }
        if (bt < 0) {
            this.game.canvasTranslated.y += bt;
        }
        else if (bb > 0) {
            this.game.canvasTranslated.y += bb;
        }
        this.game.cameraPos = this.game.canvasTranslated;
        this.camera.pos = this.game.canvasTranslated;
    }
    translate(x, y) {
        this.position.x += x;
        this.position.y += y;
    }
    translateTo(x, y) {
        this.position.x = x;
        this.position.x = y;
    }
    isGrounded() {
        return this.getNearestFloorCoordinate() - this.position.y - this.size.y < 1;
    }
    drawAccessories(c) {
        for (let acc of this.accessories) {
            acc.draw(c);
        }
    }
    drawSelected(c) {
        if (this.selectedItem !== null) {
            this.selectedItem.draw(c);
        }
    }
    drawPlayerBorders(c) {
        c.fillStyle = 'rgba(140, 0, 0, 0.2)';
        c.translate(this.rotation * this.position.x, this.position.y);
        c.fillRect(0, 0, this.rotation * this.size.x, this.size.y);
        c.translate(this.rotation * -this.position.x, -this.position.y);
    }
    drawHitbox(c) {
        c.fillStyle = 'rgba(140, 0, 0, 0.8)';
        c.translate(this.rotation * this.hitbox.position.x, this.hitbox.position.y);
        c.fillRect(0, 0, this.rotation * this.hitbox.size.x, this.hitbox.size.y);
        c.translate(this.rotation * -this.hitbox.position.x, -this.hitbox.position.y);
    }
    drawCharacter(c) {
        c.scale(this.rotation, 1);
        c.translate(this.rotation * this.position.x, this.position.y);
        c.drawImage(this.image, 0, 0, this.rotation * this.size.x, this.size.y);
        c.translate(-this.rotation * this.position.x, -this.position.y);
    }
    translateCamera(c) {
        c.setTransform(1,0,0,1,0,0);
        // если захочу сделать меняемый скейл, это делается здесь
        c.scale(this.camera.scale.x, this.camera.scale.y);
        c.translate(this.game.canvasTranslated.x, this.game.canvasTranslated.y);
    }
    checkIncomingFloorCollision() {
        if (
            this.position.y + this.velocityY + this.size.y >= this.game.size.y ||
            this.position.y + this.velocityY + this.size.y >= this.game.size.y ||
            this.getNearestFloorCoordinate() - (this.position.y + this.velocityY + this.size.y) < 0
        ) return true; 
        return false;
    }
    getNearestFloorCoordinate() {
        return Math.ceil((this.position.y + this.size.y) / 1800) * 1800;
    }
    getLevelLayer() {
        if (this.position.y < 20000) {
            return 0;
        }
        if (this.position.y < 34000) {
            return 1;
        }
        if (this.position.y < 40000) {
            return 2;
        }
        return 3;
    }
    onDeath() {
        this.dead = true;

        this.accessories[0].pe1.stop();
        this.accessories[0].pe2.stop();

        var sound = new Audio("../resources/game/player/death.wav");
        sound.volume = Config.audio.sfx;
        sound.play();

        this.death_pe.emit();

        this.game.saveRecord();
    }
}
