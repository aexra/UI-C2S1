export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 120;
        this.x = 0;
        this.y = 100;
        this.image = document.getElementById("player");

        this.direction = 0;
        this.speed = 0;
        this.velocity = 0;

        this.maxSpeed = 14;
        this.loseSpeed = 0.4;
        this.acceleration = 0.4;
    }
    update(input) {
        let left = input.includes("a");
        let right = input.includes("d");
        
        this.direction = 0;
        if (left) this.direction--;
        if (right) this.direction++;

        // рассчитываем скорость
        if (this.direction !== 0) {
            this.speed += Math.min(this.acceleration, this.maxSpeed-this.speed);
            this.velocity = this.speed * this.direction;
        }
        else {
            this.speed -= Math.min(this.loseSpeed, this.speed);
            this.velocity = this.velocity > 0? this.speed : -this.speed;
        }

        // применяем перемещение
        if (this.velocity < 0) {
            this.x = Math.max(0, this.x - this.speed);
        }
        else if (this.velocity > 0) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, 100, 120, this.x, this.y, this.width, this.height);
    }
}
