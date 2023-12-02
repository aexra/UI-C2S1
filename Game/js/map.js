import { AnimatedSprite } from "./animatedSprite.js";
import { Dummy } from "./npcs.js";
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
        this.manalanternimg = document.getElementById("manalantern");

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

        this.renderOffset = 20;

        this.codebreaker = new AnimatedSprite([
            document.getElementById("codebreaker0"),
            document.getElementById("codebreaker1"),
            document.getElementById("codebreaker2"),
            document.getElementById("codebreaker3"),
            document.getElementById("codebreaker4"),
            document.getElementById("codebreaker5"),
            document.getElementById("codebreaker6"),
            document.getElementById("codebreaker7")], 8, new Vec2(36000 + 54, 1680), new Vec2(80, 120));
        this.codebreaker.onmouser = (s) => {
            if (game.isDraedonInitiated) return;
            console.log("Draedon summoning dialog...");

            game.initiateDraedon();
        };
        this.flamepot = new AnimatedSprite([
            document.getElementById("pot0"),
            document.getElementById("pot1"),
            document.getElementById("pot2"),
            document.getElementById("pot3"),
            document.getElementById("pot4"),
            document.getElementById("pot5"),
        ], 12, new Vec2(36000 - 205, 1700 + 14), new Vec2(38, 88));
        this.campfire = new AnimatedSprite([
            document.getElementById("campfire0"),
            document.getElementById("campfire1"),
            document.getElementById("campfire2"),
            document.getElementById("campfire3"),
            document.getElementById("campfire4"),
            document.getElementById("campfire5"),
            document.getElementById("campfire6"),
            document.getElementById("campfire7"),
        ], 12, new Vec2(36000 + 305, 1700 + 63), new Vec2(54, 42));
        this.dummy = new Dummy(game);
        this.dummy.position = new Vec2(36000 + 505, 1700 + 52);
        game.npcs.push(this.dummy);
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
                // платформа
                this.map[y * 100][x] = 1;
                if (x % 100 === 0) {
                    // лампа-сердце
                    this.map[y * 100 + 1][x] = 2;
                }
                else if (x % 50 === 0) {
                    // лампа-звезда
                    this.map[y * 100 + 1][x] = 3;
                }
            }
        }
    }
    update(input, deltaTime) {
        this.position.x = -this.game.cameraPos.x;
        this.position.y = -this.game.cameraPos.y;

        this.codebreaker.update(input, deltaTime);
        this.flamepot.update(input, deltaTime);
        this.campfire.update(input, deltaTime);
    }
    draw(c) {
        c.save();

        // draw background
        this.drawBackground(c);

        // draw lanterns
        this.drawLanterns(c);

        // draw platforms to stay on
        this.drawPlatforms(c);

        // draw incollisionable objects like codebreaker or campfire
        this.drawIncObjs(c);
        
        c.restore();
    }
    drawIncObjs(c) {
        this.codebreaker.draw(c);
        this.flamepot.draw(c);
        this.campfire.draw(c);
    }
    drawBackground(c) {
        for (var layer of this.layers) {
            if (layer.id == "stars") {
                c.drawImage(layer.img, this.position.x * layer.k + layer.drawOffset.x, this.position.y * layer.k + layer.drawOffset.y / this.game.player.camera.scale.y, layer.size.x / this.game.player.camera.scale.x, layer.size.y / this.game.player.camera.scale.y);
                c.drawImage(layer.img, this.position.x * layer.k + layer.drawOffset.x + layer.size.x / this.game.player.camera.scale.x, this.position.y * layer.k + layer.drawOffset.y / this.game.player.camera.scale.y, layer.size.x / this.game.player.camera.scale.x, layer.size.y / this.game.player.camera.scale.y);
                continue;
            }

            c.drawImage(layer.img, this.position.x * layer.k + layer.drawOffset.x / this.game.player.camera.scale.x, this.position.y * layer.k + layer.drawOffset.y / this.game.player.camera.scale.y, layer.size.x / this.game.player.camera.scale.x, layer.size.y / this.game.player.camera.scale.y);
        }
    }
    getRenderBorders() {
        var pos = this.game.player.camera.pos.copy();
        var size = this.game.player.camera.size.copy();
        size.x /=  this.game.player.camera.scale.x;
        size.y /=  this.game.player.camera.scale.y;
        
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
                    if (!sprite) continue;
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
                            y * 18 + 2,
                        );
                    } else if (x % 50 === 0) {
                        c.drawImage(
                            this.manalanternimg,
                            x * 18 + 2,
                            y * 18 + 6,
                        );
                    }
                }
            }
        }
    }
    drawShaders(c) {
        var offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = this.game.player.camera.size.x / this.game.player.camera.scale.x;
        offScreenCanvas.height = this.game.player.camera.size.y / this.game.player.camera.scale.y;
        var context = offScreenCanvas.getContext("2d");

        this.drawShadowMask(context);
        this.drawLights(context);

        // c.putImageData(context.getImageData(0, 0, this.game.player.camera.size.x, this.game.player.camera.size.y), 0, 0);
        c.drawImage(offScreenCanvas, -this.game.player.camera.pos.x, -this.game.player.camera.pos.y);
    }
    drawShadowMask(c) {
        c.save();

        c.fillStyle = 'rgba(0, 0, 0, 0.7)';
        c.fillRect(0, 0, this.game.player.camera.size.x / this.game.player.camera.scale.x, this.game.player.camera.size.y / this.game.player.camera.scale.y);

        c.restore();
    }
    drawLights(c) {
        c.save();
        c.globalCompositeOperation = "destination-out";

        var real = this.getRenderBorders();

        this.lightUpLanterns(c, real);
        this.lightUpProjectiles(c);
        this.lightUpNPCs(c);

        c.restore();
    }
    lightUpNPCs(c) {
        for (var npc of this.game.npcs) {
            for (var light of npc.lights) {
                this.drawLight(c, light);
            }
        }
    }
    lightUpProjectiles(c) {
        for (var p of this.game.projectiles) {
            for (var light of p.lights) {
                this.drawLight(c, light);
            }
        }
    }
    lightUpLanterns(c, real) {
        for (var y = real.x.y; y < real.y.y; y++) {
            for (var x = real.x.x; x < real.y.x; x++) {
                var tile = this.map[y][x];

                if (tile == 2 || tile == 3) {
                    this.drawLightSource(c, new Vec2(x, y));
                }
            }
        }
    }
    drawLight(c, light) {
        var dx = light.position.x + this.game.player.camera.pos.x;
        var dy = light.position.y + this.game.player.camera.pos.y;
        
        var lx = dx,
            ly = dy,
            innerRadius = 50,
            outerRadius = light.radius,
            radius = light.radius;

        var gradient = c.createRadialGradient(lx, ly, innerRadius, lx, ly, outerRadius);
        gradient.addColorStop(0, 'rgba(253, 244, 220, 0.7)');
        gradient.addColorStop(1, 'rgba(253, 244, 220, 0)');

        c.beginPath();

        c.arc(lx, ly, radius, 0, 2 * Math.PI);

        c.fillStyle = gradient;
        c.fill();
    }
    drawLightSource(c, position) {
        var dx = position.x + Math.ceil(this.game.player.camera.pos.x / 18);
        var dy = position.y + Math.ceil(this.game.player.camera.pos.y / 18);
        
        var lx = dx * 18 + 10,
            ly = dy * 18,
            innerRadius = 50,
            outerRadius = 360,
            radius = 360;

        var gradient = c.createRadialGradient(lx, ly, innerRadius, lx, ly, outerRadius);
        gradient.addColorStop(0, 'rgba(253, 244, 220, 0.7)');
        gradient.addColorStop(1, 'rgba(253, 244, 220, 0)');

        c.beginPath();

        c.arc(lx, ly, radius, 0, 2 * Math.PI);

        c.fillStyle = gradient;
        c.fill();
    }
}