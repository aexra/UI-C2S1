import * as accessories from "./accessories.js";
import * as weapons from "./weapons.js"
import { Vec2 } from "./vec2.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.size = new Vec2(100, 120);
        this.position = new Vec2(0, 0);
        this.image = document.getElementById("player");

        this.direction = 0;
        this.speed = 0;
        this.velocity = 0;

        this.maxSpeed = 10;
        this.loseSpeed = 0.4;
        this.acceleration = 0.2;

        this.gravity = 0.1;
        this.gravityMultiplier = 1;
        this.velocityY = 0;

        this.accessories = [new accessories.NebulaWings(this)];

        this.rotation = 1;
        this.isPlayerSpriteFlipped = false;

        this.inventory = [new weapons.TerraBlade(this)];
        this.selectedItem = this.inventory[0];

        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            size: {
                x: 200,
                y: 200,
            },
        }
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
        if (this.isGrounded() && this.velocityY > 0) {
            this.velocityY = 0;
        } else {
            this.velocityY += this.gravity * this.gravityMultiplier;
        }

        // применяем перемещение по X
        if (this.velocity < 0) {
            this.position.x = Math.max(0, this.position.x - this.speed);
        }
        else if (this.velocity > 0) {
            this.position.x = Math.min(this.game.size.x - this.size.x, this.position.x + this.speed);
        }

        this.rotation = this.direction === 0? this.rotation : this.direction;

        // применяем перемещение по Y
        if (this.position.y + this.velocityY + this.size.y < this.game.size.y) this.position.y += this.velocityY;
        else this.position.y = this.game.size.y - this.size.y;

        if (this.selectedItem !== null) {
            this.selectedItem.update(input, deltaTime);
        }

        for (let acc of this.accessories) {
            acc.update(input, deltaTime);
        }

        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            size: {
                x: 200,
                y: 200,
            },
        }
    }
    draw(context) {
        context.save();
        context.scale(this.rotation, 1);
        // это квадрат 2х2 в центре игрока для дебага
        // context.fillRect(this.rotation * this.x + this.rotation * this.size.x / 2, this.y + this.size.y / 2, 2, 2);
        // это квадрат 4х4 в точке игрока для дебага
        // context.fillRect(this.rotation * this.x, this.y, 4, 4);

        // это границы игрока
        context.fillStyle = 'rgba(140, 0, 0, 0.2)';
        context.translate(this.rotation * this.position.x, this.position.y);
        context.fillRect(0, 0, this.rotation * this.size.x, this.size.y);
        context.translate(this.rotation * -this.position.x, -this.position.y);

        // это границы "камеры"
        context.fillStyle = 'rgba(0, 0, 140, 0.2)';
        context.translate(this.rotation * this.position.x, this.position.y);
        context.fillRect(this.rotation * -this.game.map.borderSize.x / 2 + this.rotation * this.size.x / 2, -this.game.map.borderSize.y / 2 + this.size.y / 2, this.rotation * this.game.map.borderSize.x, this.game.map.borderSize.y);
        context.translate(this.rotation * -this.position.x, -this.position.y);

        context.restore();

        context.save();

        context.scale(this.rotation, 1);

        // отрисовка аксессуаров
        for (let acc of this.accessories) {
            acc.draw(context);
        }

        // отрисовка выбранного предмета
        if (this.selectedItem !== null) {
            this.selectedItem.draw(context);
        }

        context.restore();

        // отрисовка игрока
        if (this.isPlayerSpriteFlipped) {
            context.save();
            context.scale(-this.rotation, 1);
            context.drawImage(this.image, 0, 0, this.size.x, this.size.y, -this.rotation * this.x, this.y, -this.rotation * this.size.x, this.size.y);
            context.restore();
        }
        else {
            context.save();
            context.scale(this.rotation, 1);
            // context.drawImage(this.image, 0, 0, this.size.x, this.size.y, this.rotation * this.x, this.y, this.rotation * this.size.x, this.size.y);
            context.restore();
        }
        
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
        return Math.abs((this.position.y + this.size.y) - this.game.size.y) <= 1;
    }
}
