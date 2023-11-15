import { Vec2 } from "./vec2.js"

export class Map {
    constructor(size, game) {
        this.size = size;
        this.game = game;

        this.scale = 4;
        this.position = new Vec2(0, 0);
        this.borderSize = new Vec2(500, 500);

        this.background = new Image();
        this.background.src = "../resources/main/artwork/main-bg.jpg";
    }
    update(input, deltaTime) {
        this.position.x = this.game.player.position.x;
        this.position.y = this.game.player.position.y;
    }
    draw(c) {
        c.save()
        c.translate(-this.borderSize.x / 2, -this.borderSize.y / 2);
        // c.scale(this.scale, this.scale);
        c.drawImage(this.background, this.position.x, this.position.y);
        c.restore();
    }
}