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

        // эмиттеры партиклов
        this.pe1 = player.game.createParticleEmitter();
        this.pe1.setFrequency(10);
        this.pe1.lifeTime = new Vec2(1, 1);
        this.pe1.particleSize = new Vec2(14, 14);
        this.pe1.shape = document.getElementById("shadowFlame");
        this.pe1.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.pe1.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.pe1.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.pe1.angle = 90;
        this.pe1.position = this.player.position.copy();

        this.pe2 = player.game.createParticleEmitter();
        this.pe2.setFrequency(10);
        this.pe2.lifeTime = new Vec2(1, 1);
        this.pe2.particleSize = new Vec2(14, 14);
        this.pe2.shape = document.getElementById("shadowFlame");
        this.pe2.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
        this.pe2.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
        this.pe2.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
        this.pe2.angle = 90;
        this.pe2.position = Vec2.concat(this.player.position.copy(), new Vec2(-10, 10));
    }
    update(input, deltaTime) {
        // при зажатом пробеле
        if (input.keys.includes(" ")) {
            // анимация
            if (this.frameTimer > this.frameInterval) {
                this.frameTimer = 0;
                if (this.frame < this.maxFrame) this.frame++;
                else this.frame = 0;
            // партиклы
            this.pe1.emit();
            this.pe2.emit();
            } else {
                this.frameTimer += deltaTime;
            }

            // подъем
            this.player.velocityY -= this.lift;
            this.player.velocityY = Math.max(this.player.velocityY, this.maxVelocityY);
        } else {
            if (this.player.isGrounded()) this.frame = this.standingFrame;
            else this.frame = this.soaringFrame;

            // партиклы
            this.pe1.stop();
            this.pe2.stop();
        }

        // при зажатом S
        if (input.keys.includes("s") || input.keys.includes("ы")) {
            this.player.gravityMultiplier = 1.4;
        }
        else {
            this.player.gravityMultiplier = 1;
        }

        this.pe1.position = new Vec2(
            (this.player.position.x + (this.player.size.x - this.size.x) / 2) + 20 + (this.player.rotation > 0? 0 : -30) + 40, 
            this.player.position.y + 20
        );
        this.pe2.position = new Vec2(
            (this.player.position.x + (this.player.size.x - this.size.x) / 2) + 20 + (this.player.rotation > 0? 0 : 60) - 10, 
            this.player.position.y + 20 + 10
        );
    }
    draw(c) {
        c.translate(this.player.rotation * (this.player.position.x + (this.player.size.x - this.size.x) / 2), this.player.position.y);
        c.drawImage(this.image, 0, this.frame * 60, this.size.x, this.size.y, 0, 0, this.player.rotation * this.size.x, this.size.y);
        c.translate(-this.player.rotation * (this.player.position.x + (this.player.size.x - this.size.x) / 2), -this.player.position.y);
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