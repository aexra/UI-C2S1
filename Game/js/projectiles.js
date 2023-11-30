import { ParticleEmitter } from "./particleEmitter.js";
import { Projectile } from "./projectile.js"
import { Vec2 } from "./vec2.js";
import { Random } from "./misc.js";

export class TerraBeam extends Projectile {
    constructor(weapon, ix, iy) {
        super(weapon, ix, iy);

        this.image = document.getElementById("terraBeam");
        this.size = new Vec2(150, 300);

        this.baseSpeed = 16;
        this.speed = this.baseSpeed * this.speedMultiplier;
        // this.acceleration = -0.02;
        
        this.maxLifeTime = 1000;
        this.acceleration = -this.speed/this.maxLifeTime * 1.2;
        // this.acceleration = 0;

        this.lifeTime = this.maxLifeTime;
        this.alpha = 1;

        this.baseDamage = 69;

        // эффекты
        this.pes = [];
        for (var i = 0; i < 3; i++) {
            var pe = this.weapon.player.game.createParticleEmitter();
            this.pes.push(pe);

            pe.setFrequency(10);
            pe.lifeTime = new Vec2(0, 1);
            pe.particleSize = new Vec2(10, 10);
            pe.shape = document.getElementById("terrabladeParticle");
            pe.addFrameCrop(new Vec2(0, 0), new Vec2(10, 10));
            pe.addFrameCrop(new Vec2(0, 10), new Vec2(10, 10));
            pe.addFrameCrop(new Vec2(0, 20), new Vec2(10, 10));
            pe.angle = 90;
            pe.position = this.position.copy().translate(new Vec2(Random.randi(-75, 75), Random.randi(-150, 150)));
            pe.emit();
        }

        this.hitbox = {
            position: Vec2.minus(this.position, new Vec2(this.hitbox.size.x / 2, this.hitbox.size.y / 2)),
            size: new Vec2(this.size.x - 70, this.size.y - 70),
        };
    }
    update(input, deltaTime) {
        this.lifeTime -= deltaTime;
        this.alpha -=  1 / this.maxLifeTime * deltaTime;

        for (let pe of this.pes) {
            pe.color.alpha = this.alpha;
        }

        if (this.lifeTime < 0) {
            for (let pe of this.pes) {
                this.weapon.player.game.deleteParticleEmitter(pe);
            }
            this.weapon.player.game.projectiles.splice(this.weapon.player.game.projectiles.indexOf(this), 1);
            delete this;
        }

        var delta = this.position.copy();

        // рассчитываем перемещение
        this.speed = Math.max(this.speed + this.acceleration * deltaTime, 0);
        this.position.x += this.speed * Math.cos(this.initialAngleRad);
        this.position.y += this.speed * Math.sin(this.initialAngleRad);

        delta = Vec2.minus(this.position, delta);

        for (let pe of this.pes) {
            pe.position.translate(delta);
        }

        this.hitbox.position = Vec2.minus(this.position, new Vec2(this.hitbox.size.x / 2, this.hitbox.size.y / 2));
    }
    draw(context) {
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotationAngleRad);
        context.globalAlpha = this.alpha;
        // context.drawImage(this.image, -this.size.x / 2 - 5, -this.size.y / 2 - 15, this.size.x + 10, this.size.y + 30);
        context.drawImage(this.image, -this.size.x / 2 - 5, -this.size.y / 2 - 5, this.size.x + 10, this.size.y + 10);
        context.filter = 'brightness(0) saturate(100%) invert(88%) sepia(95%) saturate(5463%) hue-rotate(32deg) brightness(109%) contrast(105%)';
        context.drawImage(this.image, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.filter = 'none';
        context.globalAlpha = 1;
        context.rotate(-this.rotationAngleRad);
        context.translate(-this.position.x, -this.position.y);

        this.drawHitbox(context);
    }
    drawHitbox(context) {
        context.translate(this.hitbox.position.x, this.hitbox.position.y);
        context.translate(this.hitbox.size.x / 2, this.hitbox.size.y / 2);
        context.rotate(this.rotationAngleRad);
        context.fillStyle = "rgba(0, 0, 140, 0.4)";
        context.fillRect(-this.hitbox.size.x / 2, -this.hitbox.size.y / 2, this.hitbox.size.x, this.hitbox.size.y);
        context.rotate(-this.rotationAngleRad);
        context.translate(-this.hitbox.size.x / 2, -this.hitbox.size.y / 2);
        context.translate(-this.hitbox.position.x, -this.hitbox.position.y);
    }
}

export class ExoBeam extends Projectile {
    constructor(weapon, ix, iy) {
        super(weapon, ix, iy);

        this.image = document.getElementById("exoBeam");
        this.slashImage = document.getElementById("exoBeamSlash");
        this.slashSize = new Vec2(300, 30);
        this.size = new Vec2(120, 120);
        this.baseSpeed = 30;

        this.lifeTime = 1000;

        this.rotationAngleRad += 45 * Math.PI / 180;

        this.spawnSlashRadius = 90;
        this.xslash = (this.position.x) + this.spawnSlashRadius * Math.cos(this.initialAngleRad);
        this.yslash = (this.position.y) +  this.spawnSlashRadius * Math.sin(this.initialAngleRad);
    }
    update(input, deltaTime) {
        this.lifeTime -= deltaTime;
        if (this.lifeTime < 0) {
            this.weapon.player.game.projectiles.splice(this.weapon.player.game.projectiles.indexOf(this), 1);
            delete this;
        }

        // рассчитываем перемещение
        this.position.x += this.baseSpeed * this.speedMultiplier * Math.cos(this.initialAngleRad);
        this.position.y += this.baseSpeed * this.speedMultiplier * Math.sin(this.initialAngleRad);
        this.xslash += this.baseSpeed * this.speedMultiplier * Math.cos(this.initialAngleRad);
        this.yslash += this.baseSpeed * this.speedMultiplier * Math.sin(this.initialAngleRad);
    }
    draw(context) {
        context.translate(this.xslash, this.yslash);
        context.rotate(this.rotationAngleRad - 45 * Math.PI / 180);
        context.drawImage(this.slashImage, -1.5*this.slashMaxWidth, -this.slashSize.y / 2, this.slashMaxWidth, this.slashSize.y);
        context.rotate(-(this.rotationAngleRad - 45 * Math.PI / 180));
        context.translate(-this.xslash, -this.yslash);

        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotationAngleRad);
        context.drawImage(this.image, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.rotate(-this.rotationAngleRad);
        context.translate(-this.position.x, -this.position.y);
    }
}