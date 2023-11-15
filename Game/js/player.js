import * as accessories from "./accessories.js";
import * as weapons from "./weapons.js"
import { Vec2 } from "./vec2.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.size = new Vec2(100, 120);
        this.position = new Vec2(1500, 2700);
        this.image = document.getElementById("player");
        this.camera = {
            size: game.canvasSize,
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

        this.accessories = [new accessories.NebulaWings(this)];

        this.rotation = 1;
        this.isPlayerSpriteFlipped = false;

        this.inventory = [new weapons.TerraBlade(this)];
        this.selectedItem = this.inventory[0];

        this.game.createParticleEmitter(
            new Vec2(100, 100)
        );
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
        if (!this.checkIncomingFloorCollision()) 
        {
            this.position.y += this.velocityY;
            input.mpy += this.velocityY;
        } else {
            input.mpy += this.getNearestFloorCoordinate() - this.position.y
            this.position.y = this.getNearestFloorCoordinate();
            this.velocityY = 0;
        }

        if (this.selectedItem !== null) {
            this.selectedItem.update(input, deltaTime);
        }

        for (let acc of this.accessories) {
            acc.update(input, deltaTime);
        }
    }
    draw(c) {
        // перемещение камеры
        this.translateCamera(c);
        // console.log(this.game.canvasSize);

        c.save();
        c.scale(this.rotation, 1);
        // это квадрат 2х2 в центре игрока для дебага
        // context.fillRect(this.rotation * this.x + this.rotation * this.size.x / 2, this.y + this.size.y / 2, 2, 2);
        // это квадрат 4х4 в точке игрока для дебага
        // context.fillRect(this.rotation * this.x, this.y, 4, 4);

        // это границы игрока
        this.drawPlayerBorders(c);
        c.restore();

        c.save();
        c.scale(this.rotation, 1);

        // отрисовка аксессуаров
        this.drawAccessories(c);

        // отрисовка выбранного предмета
        this.drawSelected(c);
        
        c.restore();

        // отрисовка игрока
        // this.drawCharacter(c);
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
        // return Math.abs((this.position.y + this.size.y) - this.game.size.y) <= 1;
        return this.position.y + this.size.y >= this.game.size.y;
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
        if (this.isPlayerSpriteFlipped) {
            c.save();
            c.scale(-this.rotation, 1);
            c.drawImage(this.image, 0, 0, this.size.x, this.size.y, -this.rotation * this.position.x, this.position.y, -this.rotation * this.size.x, this.size.y);
            c.restore();
        }
        else {
            c.save();
            c.scale(this.rotation, 1);
            c.drawImage(this.image, 0, 0, this.size.x, this.size.y, this.rotation * this.position.x, this.position.y, this.rotation * this.size.x, this.size.y);
            c.restore();
        }
    }
    translateCamera(c) {
        c.setTransform(1,0,0,1,0,0);
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
        c.translate(this.game.canvasTranslated.x, this.game.canvasTranslated.y);
    }
    checkIncomingFloorCollision() {
        if (
            this.position.y + this.velocityY + this.size.y >= this.game.size.y ||
            this.position.y + this.velocityY + this.size.y >= this.game.size.y
        ) return true; 
        return false;
    }
    getNearestFloorCoordinate() {
        return this.game.size.y - this.size.y;
    }
}
