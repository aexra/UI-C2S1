import { Projectile } from "./projectile.js"
import { Vec2 } from "./vec2.js";

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

        this.lifeTime = this.maxLifeTime;
        this.alpha = 1;
    }
    update(input, deltaTime) {
        this.lifeTime -= deltaTime;
        this.alpha -=  1 / this.maxLifeTime * deltaTime;
        if (this.lifeTime < 0) {
            this.weapon.player.game.projectiles.splice(this.weapon.player.game.projectiles.indexOf(this), 1);
            delete this;
        }

        // рассчитываем перемещение
        this.speed = Math.max(this.speed + this.acceleration * deltaTime, 0);
        this.position.x += this.speed * Math.cos(this.initialAngleRad);
        this.position.y += this.speed * Math.sin(this.initialAngleRad);
    }
    draw(context) {
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotationAngleRad);
        context.globalAlpha = this.alpha;
        context.drawImage(this.image, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        context.globalAlpha = 1;
        context.rotate(-this.rotationAngleRad);
        context.translate(-this.position.x, -this.position.y);
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