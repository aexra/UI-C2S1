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
        this.maxSpeed = 10;
        this.loseSpeed = 0.5;
    }
    update(input) {
        let left = input.includes("a");
        let right = input.includes("d");
        this.direction = 0;
        if (left) this.direction--;
        if (right) this.direction++;

        if (this.direction === 0 && this.speed != 0) {
            let dir = this.speed / Math.abs(this.speed);

            if (dir < 0) {
                this.speed += Math.min(-this.speed, this.loseSpeed);
            }
            else {
                this.speed -= Math.min(this.speed, this.loseSpeed);
            }
        }
        else {
            this.speed = this.direction * this.maxSpeed;
        }

        if (this.speed < 0) {
            this.x = Math.max(0, this.x + this.speed);
        }
        else if (this.speed > 0) {
            this.x = Math.min(this.game.width - this.width, this.x + this.speed);
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, 100, 120, this.x, this.y, this.width, this.height);
    }
}
