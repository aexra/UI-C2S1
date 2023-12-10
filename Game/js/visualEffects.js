import { VisualEffect } from "./visualEffect.js";
import { Vec2 } from "./vec2.js";

export class DraedonInitiatingBeam extends VisualEffect {
    constructor(game) {
        super(game);
        this.lifetime = 4000;
        
        this.position = this.game.map.codebreaker.position.copy();
        this.size = new Vec2(0, 10000);
        this.position.y -= this.size.y / 2 + 60;

        this.keyframes = [
            {
                frame: 1000,
                width: 50,
                dw: 50
            },
            {
                frame: 1200,
                width: 200,
                dw: 200 - 50
            },
            {
                frame: 2500,
                width: 180,
                dw: 180 - 200
            },
            {
                frame: 3000,
                width: 0,
                dw: 0 - 180
            }
        ];
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);

        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.lifetimer <= this.keyframes[i].frame) {
                this.size.x += this.keyframes[i].dw / (this.keyframes[i].frame - (i == 0? 0 : this.keyframes[i-1].frame)) * deltaTime;
                break;
            }
        }
    }
    draw(c) {
        c.save();
        c.fillStyle = "#fff";
        c.filter = "drop-shadow(0 0 50px #fff)";
        c.fillRect(this.topleft().x, this.topleft().y, this.size.x, this.size.y);
        c.restore();
    }
}

export class ThanatosSpawnScreen extends VisualEffect {
    constructor(game) {
        super(game);
        this.lifetime = 4000;
        
        this.size = game.player.camera.size.copy();
        this.position = game.player.camera.pos.reverse();
        this.center = new Vec2(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
        
        this.alpha = 0;

        this.keyframes = [
            {
                frame: 100,
                da: 0.3,
                text1: "T",
                text2: ""
            },
            {
                frame: 200,
                da: 0,
                text1: "TH",
                text2: ""
            },
            {
                frame: 300,
                da: 0,
                text1: "THE",
                text2: ""
            },
            {
                frame: 400,
                da: 0,
                text1: "THE ",
                text2: ""
            },
            {
                frame: 500,
                da: 0,
                text1: "THE P",
                text2: ""
            },
            {
                frame: 600,
                da: 0,
                text1: "THE PE",
                text2: ""
            },
            {
                frame: 700,
                da: 0,
                text1: "THE PER",
                text2: ""
            },
            {
                frame: 800,
                da: 0,
                text1: "THE PERF",
                text2: ""
            },
            {
                frame: 900,
                da: 0,
                text1: "THE PERFE",
                text2: ""
            },
            {
                frame: 1000,
                da: 0,
                text1: "THE PERFEC",
                text2: ""
            },
            {
                frame: 1100,
                da: 0,
                text1: "THE PERFECT",
                text2: ""
            },
            {
                frame: 1200,
                da: 0,
                text1: "THE PERFECT ",
                text2: ""
            },
            {
                frame: 1300,
                da: 0,
                text1: "THE PERFECT A",
                text2: ""
            },
            {
                frame: 1400,
                da: 0,
                text1: "THE PERFECT AN",
                text2: ""
            },
            {
                frame: 1500,
                da: 0,
                text1: "THE PERFECT ANN",
                text2: ""
            },
            {
                frame: 1600,
                da: 0,
                text1: "THE PERFECT ANNI",
                text2: ""
            },
            {
                frame: 1700,
                da: 0,
                text1: "THE PERFECT ANNIH",
                text2: ""
            },
            {
                frame: 1800,
                da: 0,
                text1: "THE PERFECT ANNIHA",
                text2: ""
            },
            {
                frame: 1900,
                da: 0,
                text1: "THE PERFECT ANNIHAL",
                text2: ""
            },
            {
                frame: 2000,
                da: 0,
                text1: "THE PERFECT ANNIHALA",
                text2: ""
            },
            {
                frame: 2100,
                da: 0,
                text1: "THE PERFECT ANNIHALAT",
                text2: ""
            },
            {
                frame: 2200,
                da: 0,
                text1: "THE PERFECT ANNIHALATO",
                text2: ""
            },
            {
                frame: 2300,
                da: 0,
                text1: "THE PERFECT ANNIHALATOR",
                text2: ""
            },
            {
                frame: 2400,
                da: 0,
                text1: "THE PERFECT ANNIHALATOR",
                text2: "THANATOS"
            },
            {
                frame: 3300,
                da: 0,
                text1: "THE PERFECT ANNIHALATOR",
                text2: "THANATOS"
            },
            {
                frame: 4000,
                da: -0.3,
                text1: "THE PERFECT ANNIHALATOR",
                text2: "THANATOS"
            }
        ];

        this.text1 = "THE PERFECT ANNIHALATOR";
        this.text2 = "THANATOS";
        this.text1SizeX = 700;
        this.text2SizeX = 300;
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);
        this.position = this.game.player.camera.pos.copy().reverse();
        this.size = this.game.player.camera.size.copy().multiply(1 / this.game.player.camera.scale.x);
        this.center = new Vec2(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);

        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.lifetimer <= this.keyframes[i].frame) {
                this.alpha += this.keyframes[i].da / (this.keyframes[i].frame - (i == 0? 0 : this.keyframes[i-1].frame)) * deltaTime;
                if (this.alpha < 0) this.alpha = 0;
                break;
            }
        }
    }
    draw(c) {
        c.save();
        c.fillStyle = "#000";
        c.globalAlpha = this.alpha;
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        c.font = `50px andy`;
        c.fillStyle = 'red';
        c.textBaseline = 'top';

        c.globalAlpha = 1;
        c.fillText(this.getCurrentFrame().text1, this.center.x - this.text1SizeX / 2, this.position.y + this.size.y / 2);
        c.fillText(this.getCurrentFrame().text2, this.center.x - this.text2SizeX / 2, this.position.y + this.size.y / 2 + 100);
        
        c.restore();
    }
    getCurrentFrame() {
        for (var i = 0; i < this.keyframes.length; i++) {
            if (this.lifetimer <= this.keyframes[i].frame) {
                return this.keyframes[i];
            }
        }
    }
}