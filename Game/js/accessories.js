import { Vec2 } from "./vec2.js";

class Wings {
    constructor(player) {
        this.player = player;
        this.image = document.getElementById("flameWings");
        this.size = new Vec2(100, 60);

        // анимация
        this.fps = 10;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.maxFrame = 3;
        this.frame = 2;
        this.soaringFrame = 2;
        this.standingFrame = 2;

        // свойства крыльев
        this.lift = 0.2;
        this.maxVelocityY = -10;
    }
    update(input, deltaTime) {
        // при зажатом пробеле
        if (input.keys.includes(" ")) {
            // анимация
            if (this.frameTimer > this.frameInterval) {
                this.frameTimer = 0;
                if (this.frame < this.maxFrame) this.frame++;
                else this.frame = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // подъем
            this.player.velocityY -= this.lift;
            this.player.velocityY = Math.max(this.player.velocityY, this.maxVelocityY);
        } else {
            if (this.player.isGrounded()) this.frame = this.standingFrame;
            else this.frame = this.soaringFrame;
        }

        // при зажатом S
        if (input.keys.includes("s") || input.keys.includes("ы")) {
            this.player.gravityMultiplier = 2.4;
        }
        else {
            this.player.gravityMultiplier = 1;
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, this.frame * 60, this.size.x, this.size.y, this.player.rotation * this.player.position.x, this.player.position.y, this.player.rotation * this.size.x, this.size.y);
    }
}

export class NebulaWings extends Wings {
    constructor(player) {
        super(player);
        this.image = document.getElementById("nebulaWings");
        this.soaringFrame = 1;
        this.standingFrame = 2;
    }
}

export class SteampunkWings extends Wings {
    constructor(player) {
        super(player);
        this.image = document.getElementById("steampunkWings");
        this.soaringFrame = 3;
        this.standingFrame = 2;
    }
}

export class FlameWings extends Wings {
    constructor(player) {
        super(player);
        this.image = document.getElementById("flameWings");
        this.soaringFrame = 2;
        this.standingFrame = 1;
    }
}