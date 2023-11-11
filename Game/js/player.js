export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 120;
        this.x = 0;
        this.y = 100;
        this.image = document.getElementById("player");
    }
    update() {
        
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, 100, 120, this.x, this.y, this.width, this.height);
    }
}