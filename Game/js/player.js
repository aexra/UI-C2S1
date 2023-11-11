export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 120;
        this.x = 0;
        this.y = 100;
        this.image = document.getElementById("player");

        this.speed = 0;
        this.maxSpeed = 4;
    }
    update(input) {
        if (! (input.includes("d") || input.includes("a"))) {
            this.speed = 0;
        }
        else {
            if (input.includes("d")) {
                this.speed = this.maxSpeed;
            }
            if (input.includes("a")) {
                this.speed = Math.max(-this.maxSpeed, this.speed - this.maxSpeed);;
            }
        }

        this.x += this.speed;
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, 100, 120, this.x, this.y, this.width, this.height);
    }
}