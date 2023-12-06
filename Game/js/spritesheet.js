import { Vec2 } from "./vec2.js";

export class SpriteSheet {
    constructor(imageID, spriteSize, direction="column") {
        this.image = document.getElementById(imageID);
        this.spriteSize = spriteSize;
        this.direction = direction;
    }
    get(index) {
        if (this.direction == "column") {
            return {
                position: new Vec2(0, index * this.spriteSize.y),
                size: this.spriteSize,
            };
        } else if (this.direction == "row") {
            return {
                position: new Vec2(index * this.spriteSize.x, 0),
                size: this.spriteSize,
            };
        }
    }
    draw(c, position, index) {
        var cropManifest = this.get(index);
        c.drawImage(
            this.image, 
            cropManifest.position.x,
            cropManifest.position.y,
            this.spriteSize.x,
            this.spriteSize.y,
            position.x,
            position.y,
            this.spriteSize.x,
            this.spriteSize.y
        );
    }
}