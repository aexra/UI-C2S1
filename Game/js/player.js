import * as accessories from "./accessories.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 120;
        this.x = 0;
        this.y = 800;
        this.image = document.getElementById("player");

        this.direction = 0;
        this.speed = 0;
        this.velocity = 0;

        this.maxSpeed = 10;
        this.loseSpeed = 0.4;
        this.acceleration = 0.2;

        this.gravity = 0.1;
        this.velocityY = 0;

        this.accessories = [new accessories.SteampunkWings(this)];

        this.rotation = 1;
        this.isPlayerSpriteFlipped = false;
    }
    update(input, deltaTime) {
        let left = input.includes("a");
        let right = input.includes("d");
        
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
            this.velocityY += this.gravity;
        }

        // применяем перемещение по X
        if (this.velocity < 0) {
            this.x = Math.max(0, this.x - this.speed);
        }
        else if (this.velocity > 0) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }

        this.rotation = this.direction === 0? this.rotation : this.direction;

        // применяем перемещение по Y
        if (this.y + this.velocityY + this.height < this.game.height) this.y += this.velocityY;
        else this.y = this.game.height - this.height;

        for (let acc of this.accessories) {
            acc.update(input, deltaTime);
        }
    }
    draw(context) {
        context.save();

        context.scale(this.rotation, 1);

        // отрисовка аксессуаров
        for (let acc of this.accessories) {
            acc.draw(context);
        }

        context.restore();

        // отрисовка игрока
        if (this.isPlayerSpriteFlipped) {
            context.save();
            context.scale(-this.rotation, 1);
            context.drawImage(this.image, 0, 0, this.width, this.height, -this.rotation * this.x, this.y, -this.rotation * this.width, this.height);
            context.restore();
        }
        else {
            context.save();
            context.scale(this.rotation, 1);
            context.drawImage(this.image, 0, 0, this.width, this.height, this.rotation * this.x, this.y, this.rotation * this.width, this.height);
            context.restore();
        }
        
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    translateTo(x, y) {
        this.x = x;
        this.y = y;
    }
    isGrounded() {
        return Math.abs((this.y + this.height) - this.game.height) <= 1;
    }
}