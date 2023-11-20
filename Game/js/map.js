import { Vec2 } from "./vec2.js"
import { Vec4 } from "./vec4.js";

class Layer {
    constructor(id, k) {
        this.img = document.getElementById(id);
        this.k = k;
    }
}

export class Map {
    constructor(size, game) {
        this.size = size;
        this.game = game;

        this.scale = 4;
        this.position = new Vec2(0, 0);
        this.borderSize = new Vec2(500, 500);

        this.layers = [
            new Layer("hallowBackground1", 0.9)
        ];
    }
    update(input, deltaTime) {
        this.position.x = -this.game.cameraPos.x;
        this.position.y = -this.game.cameraPos.y;
    }
    draw(c) {
        c.save()

        // draw background
        this.drawBackground(c);
    }
    drawBackground(c) {
        for (var layer of this.layers) {
            c.drawImage(layer.img, this.position.x * layer.k, this.position.y * layer.k, 0.1 * this.size.x + this.game.canvasSize.x, 0.1 * this.size.y + this.game.canvasSize.y);
        }
    }
}