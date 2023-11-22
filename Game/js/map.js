import { Sprite } from "./sprite.js";
import { Vec2 } from "./vec2.js"
import { Vec4 } from "./vec4.js";

const layers = {
    0: 2000,
    1: 34000,
    2: 40000,
    3: 72000
};

class Layer {
    constructor(id, k, size, drawOffset) {
        this.id = id;
        this.img = document.getElementById(id);
        this.k = k;
        this.size = size;
        this.drawOffset = drawOffset || new Vec2(0, 0);
    }
}

export class Map {
    constructor(size, game) {
        this.size = size;
        this.game = game;

        this.scale = 4;
        this.position = new Vec2(0, 0);
        this.borderSize = new Vec2(500, 500);

        this.heartlanternimg = document.getElementById("heartlantern");

        this.layers = [
            new Layer("space", 1, new Vec2(1920, 1080)),
            new Layer("stars", 0.995, new Vec2(1920, 1080)),
            // new Layer("stst", 0.9, new Vec2(8700, 2000), new Vec2(0, 1000)),

            // new Layer("sky", 0.9, new Vec2(8700, 3000), new Vec2(0, 2990)),

            // new Layer("mountain", 1, new Vec2(1920, 1080), new Vec2(0, 0)),

            // new Layer("island1", 0.88, new Vec2(344, 308), new Vec2(500, 4300)),
            // new Layer("island2", 0.88, new Vec2(404, 387), new Vec2(2 * 1000, 4300)),
            // new Layer("island3", 0.88, new Vec2(352, 274), new Vec2(4 * 1000, 4300)),
            // new Layer("island1", 0.88, new Vec2(344, 308), new Vec2(7 * 1000, 4300)),
            // new Layer("island3", 0.88, new Vec2(352, 274), new Vec2(10 * 1000, 4300)),
            // new Layer("island2", 0.88, new Vec2(404, 387), new Vec2(13 * 1000, 4300)),
            // new Layer("island1", 0.88, new Vec2(344, 308), new Vec2(16 * 1000, 4300)),
            // new Layer("island3", 0.88, new Vec2(352, 274), new Vec2(19 * 1000, 4300)),
            // new Layer("island2", 0.88, new Vec2(404, 387), new Vec2(22 * 1000, 4300)),

            // new Layer("clouds1", 0.9, new Vec2(3840, 1080), new Vec2(0, 3100)),
            // new Layer("clouds2", 0.9, new Vec2(3840, 1080), new Vec2(3840, 3100)),
            // new Layer("clouds3", 0.9, new Vec2(3840, 1080), new Vec2(3840 * 2, 3100)),
            // new Layer("clouds4", 0.9, new Vec2(3840, 1080), new Vec2(3840 * 3, 3100)),
            // new Layer("clouds5", 0.9, new Vec2(3840, 1080), new Vec2(3840 * 4, 3100)),
        ];

        this.tileset = {
            1: new Sprite(new Vec2(0, 0), new Vec2(18, 10), "../resources/game/tilesets/platforms/p0.png"),
        };

        this.generateMap();
        this.fillMap();

        this.renderOffset = 10;
    }
    generateMap() {
        this.map = [];

        for (var y = 0; y < this.size.y / 18; y++) {
            this.map.push([]);
            for (var x = 0; x < this.size.x / 18; x++) {
                this.map[y].push(0);
            }
        }
    }
    fillMap() {
        for (var y = 0; y < this.map.length / 100; y++) {
            for (var x = 0; x < this.map[0].length; x++) {
                this.map[y * 100][x] = 1;
            }
        }
    }
    update(input, deltaTime) {
        this.position.x = -this.game.cameraPos.x;
        this.position.y = -this.game.cameraPos.y;
    }
    draw(c) {
        c.save();

        // draw background
        this.drawBackground(c);

        // draw platforms to stay on
        this.drawPlatforms(c);

        // draw lanterns
        this.drawLanterns(c);
        
        c.restore();
    }
    drawBackground(c) {
        for (var layer of this.layers) {
            if (layer.id == "stars") {
                c.drawImage(layer.img, this.position.x * layer.k + layer.drawOffset.x, this.position.y * layer.k + layer.drawOffset.y, layer.size.x, layer.size.y);
                c.drawImage(layer.img, this.position.x * layer.k + layer.drawOffset.x + layer.size.x, this.position.y * layer.k + layer.drawOffset.y, layer.size.x, layer.size.y);
                continue;
            }

            c.drawImage(layer.img, this.position.x * layer.k + layer.drawOffset.x, this.position.y * layer.k + layer.drawOffset.y, layer.size.x, layer.size.y);
        }
    }
    getRenderBorders() {
        var pos = this.game.player.camera.pos.copy();
        var size = this.game.player.camera.size.copy();
        
        var ibegin = new Vec2(Math.ceil(-pos.x / 18), Math.ceil(Math.abs(pos.y) / 18));
        var iend = new Vec2(Math.ceil((-pos.x + size.x) / 18), Math.ceil((Math.abs(pos.y) + size.y) / 18));

        var realbegin = new Vec2(
            ibegin.x - this.renderOffset >= 0? ibegin.x - this.renderOffset : 0,
            ibegin.y - this.renderOffset >= 0? ibegin.y - this.renderOffset : 0
        );
        var realend = new Vec2(
            iend.x + this.renderOffset < this.map[0].length? iend.x + this.renderOffset : this.map[0].length - 1,
            iend.y + this.renderOffset < this.map.length? iend.y + this.renderOffset : this.map.length - 1
        );

        return new Vec2(realbegin, realend);
    }
    drawPlatforms(c) {
        var real = this.getRenderBorders();
        var realbegin = real.x;
        var realend = real.y;

        for (var y = realbegin.y; y < realend.y; y++) {
            for (var x = realbegin.x; x < realend.x; x++) {
                var tile = this.map[y][x];
                if (tile !== 0) {
                    var sprite = this.tileset[tile];
                    c.drawImage(
                        sprite.image,
                        sprite.position.x,
                        sprite.position.y,
                        sprite.size.x,
                        sprite.size.y,
                        x * 18,
                        y * 18,
                        sprite.size.x,
                        sprite.size.y,
                    );
                }
            }
        }
    }
    drawLanterns(c) {
        var real = this.getRenderBorders();
        var realbegin = real.x;
        var realend = real.y;

        for (var y = realbegin.y; y < realend.y; y++) {
            for (var x = realbegin.x; x < realend.x; x++) {
                var tile = this.map[y][x];
                if (tile === 1) {
                    if (x % 100 === 0) {
                        c.drawImage(
                            this.heartlanternimg,
                            x * 18 + 2,
                            y * 18 + 6,
                        );
                    }
                }
            }
        }
    }
}