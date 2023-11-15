import { Vec2 } from "./vec2.js"

export class Map {
    constructor(size) {
        this.size = size;

        this.background = new Image();
        this.background.src = "../resources/main/artwork/main-bg.jpg";
    }
    update() {

    }
    draw(c) {
        c.drawImage(this.background, 0, 0);
    }
}