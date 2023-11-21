import { Sprite } from "./sprite.js";
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

        // draw foreground walls
        this.drawPlatforms(c);
        
        c.restore();
    }
    drawBackground(c) {
        for (var layer of this.layers) {
            c.drawImage(layer.img, this.position.x * layer.k, this.position.y * layer.k, 0.1 * this.size.x + this.game.canvasSize.x, 0.1 * this.size.y + this.game.canvasSize.y);
        }
    }
    drawPlatforms(c) {
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
}