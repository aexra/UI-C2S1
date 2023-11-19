import { Vec2 } from "./vec2.js"
import { Vec4 } from "./vec4.js";

export class Map {
    constructor(size, game) {
        this.size = size;
        this.game = game;

        this.scale = 4;
        this.position = new Vec2(0, 0);
        this.borderSize = new Vec2(500, 500);

        this.background = document.getElementById("hallowBackground1");
        this.imgSize = new Vec2(1024, 838);

        this.skyHeight = 2000;
        this.skyColor = new Vec4(72, 81, 245, 1);
        this.undergroundY = this.skyHeight + this.imgSize.y;
        this.undergroundHeight = this.game.size.y - this.undergroundY;
        this.undergroundColor = new Vec4(40, 71, 111, 1);
        this.nimages = Math.ceil(this.game.size.x / this.imgSize.x);
    }
    update(input, deltaTime) {
        this.position.x = this.game.player.position.x;
        this.position.y = this.game.player.position.y;
    }
    draw(c) {
        c.save()
        // c.translate(-this.borderSize.x / 2, -this.borderSize.y / 2);
        // c.scale(this.scale, this.scale);
        // c.drawImage(this.background, this.position.x, this.position.y);
        
        // draw sky
        c.fillStyle = `rgba(${this.skyColor.x}, ${this.skyColor.y}, ${this.skyColor.z}, ${this.skyColor.alpha})`;
        c.fillRect(0, 0, this.game.size.x, this.skyHeight);

        // draw images
        for (var i = 0; i < this.nimages; i++) {
            c.drawImage(this.background, this.imgSize.x * i, this.skyHeight);
        }

        // draw underground
        c.fillStyle = `rgba(${this.undergroundColor.x}, ${this.undergroundColor.y}, ${this.undergroundColor.z}, ${this.undergroundColor.alpha})`;
        c.fillRect(0, this.undergroundY, this.game.size.x, this.undergroundHeight);

        c.fillStyle = 'rgba(0, 0, 0, 0.4)';
        c.fillRect(0, 0, this.size.x, this.size.y);
        c.restore();
    }
}