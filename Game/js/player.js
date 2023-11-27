import * as accessories from "./accessories.js";
import * as weapons from "./weapons.js"
import { Vec2 } from "./vec2.js";
import { Random } from "./misc.js";
import { Vec4 } from "./vec4.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.size = new Vec2(36, 54);
        this.position = new Vec2(36000, 1720);
        this.image = document.getElementById("player");
        this.camera = {
            size: game.canvasSize,
            pos: new Vec2()
        };

        this.direction = 0;
        this.speed = 0;
        this.velocity = 0;

        this.maxSpeed = 10;
        this.loseSpeed = 0.4;
        this.acceleration = 0.2;

        this.gravity = 0.1;
        this.gravityMultiplier = 1;
        this.velocityY = 0;
        this.maxVY = 10;

        this.accessories = [
            new accessories.NebulaWings(this),
            new accessories.NormalityRelocator(this),
        ];

        this.rotation = 1;
        this.isPlayerSpriteFlipped = false;

        this.inventory = [new weapons.TerraBlade(this)];
        this.selectedItem = this.inventory[0];

        this.mapLayer = 0;

        this.maxHP = 1000;
        this.hp = this.maxHP;
        this.hp = 720;
        this.immunityInterval = 1000;
        this.immunityTimer = 0;
    }
    update(input, deltaTime) {
        let left = input.keys.includes("a");
        let right = input.keys.includes("d");

        this.direction = 0;
        if (left) this.direction--;
        if (right) this.direction++;

        // рассчитываем скорость по X
        if (this.direction !== 0) {

            // если игрок резко меняет направление движения
            if (left && this.velocity / Math.abs(this.velocity) > 0 || right && this.velocity / Math.abs(this.velocity) < 0) {
                this.speed = 0;
                this.velocity = 0;
                return;
            }

            // простое движение
            this.speed += Math.min(this.acceleration, this.maxSpeed-this.speed);
            this.velocity = this.speed * this.direction;
        }
        else {
            // потеря скорости при отсутствии тяги (нажатых клавиш)
            this.speed -= Math.min(this.loseSpeed, this.speed);
            this.velocity = this.velocity > 0? this.speed : -this.speed;
        }

        // рассчитываем скорость по Y
        if (this.velocityY < this.maxVY * this.gravityMultiplier) this.velocityY += this.gravity * this.gravityMultiplier;
        if (this.velocityY > 0) this.velocityY = Math.min(this.maxVY * this.gravityMultiplier, this.velocityY);

        // применяем перемещение по X
        if (this.velocity < 0) {
            input.mpx += -(this.position.x - Math.max(0, this.position.x - this.speed));
            this.position.x = Math.max(0, this.position.x - this.speed);
        }
        else if (this.velocity > 0) {
            input.mpx += this.position.x - Math.max(0, this.position.x - this.speed);
            this.position.x = Math.min(this.game.size.x - this.size.x, this.position.x + this.speed);
        }

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

        this.updateCamera();
        this.translateCamera(this.game.canvasContext);

        // damage
        if (this.immunityTimer != 0) {
            this.immunityTimer += deltaTime;
            if (this.immunityTimer >= this.immunityInterval) {
                this.immunityTimer = 0;
            }
        }
        if (input.keys.includes("j") || input.keys.includes("о")) {
            this.getDamage(50);
        }
    }
    draw(c) {
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

            this.onHit();
        }
    }
    onHit() {
        console.log("player got hit, hp: ", this.hp);
    }
    updateCamera() {
        this.game.canvasTranslated = new Vec2(- (this.position.x - this.camera.size.x / 2 + this.size.x / 2), - (this.position.y - this.camera.size.y / 2 + this.size.y / 2));
        var al = - this.game.canvasTranslated.x;
        var ar = - this.game.canvasTranslated.x + this.camera.size.x - this.game.size.x;
        var bt = - this.game.canvasTranslated.y;
        var bb =  - this.game.canvasTranslated.y + this.camera.size.y - this.game.size.y;
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
    drawCharacter(c) {
        c.scale(this.rotation, 1);
        c.translate(this.rotation * this.position.x, this.position.y);
        c.drawImage(this.image, 0, 0, this.rotation * this.size.x, this.size.y);
        c.translate(-this.rotation * this.position.x, -this.position.y);
    }
    translateCamera(c) {
        c.setTransform(1,0,0,1,0,0);
        // если захочу сделать меняемый скейл, это делается здесь
        // c.scale(0.8, 0.8);
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

}
