import { Projectile } from "./projectile.js"

export class TerraBeam extends Projectile {
    constructor(weapon, ix, iy) {
        super(weapon, ix, iy);

        this.image = document.getElementById("terraBeam");
        this.width = 100;
        this.height = 200;

        this.baseSpeed = 16;

        this.lifeTime = 1000;
    }
    update(input, deltaTime) {
        this.lifeTime -= deltaTime;
        if (this.lifeTime < 0) {
            this.weapon.player.game.projectiles.splice(this.weapon.player.game.projectiles.indexOf(this), 1);
            delete this;
        }

        // рассчитываем перемещение
        this.x += this.baseSpeed * this.speedMultiplier * Math.cos(this.initialAngleRad);
        this.y += this.baseSpeed * this.speedMultiplier * Math.sin(this.initialAngleRad);
    }
    draw(context) {
        context.translate(this.x, this.y);
        context.rotate(this.rotationAngleRad);
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        context.rotate(-this.rotationAngleRad);
        context.translate(-this.x, -this.y);
    }
}

export class ExoBeam extends Projectile {
    constructor(weapon, ix, iy) {
        super(weapon, ix, iy);

        this.image = document.getElementById("exoBeam");
        this.width = 80;
        this.height = 50;

        this.baseSpeed = 16;

        this.lifeTime = 1000;

        this.rotationAngleRad += 30 * Math.PI / 180;
    }
    update(input, deltaTime) {
        this.lifeTime -= deltaTime;
        if (this.lifeTime < 0) {
            this.weapon.player.game.projectiles.splice(this.weapon.player.game.projectiles.indexOf(this), 1);
            delete this;
        }

        // рассчитываем перемещение
        this.x += this.baseSpeed * this.speedMultiplier * Math.cos(this.initialAngleRad);
        this.y += this.baseSpeed * this.speedMultiplier * Math.sin(this.initialAngleRad);
    }
    draw(context) {
        context.translate(this.x, this.y);
        context.rotate(this.rotationAngleRad);
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        context.rotate(-this.rotationAngleRad);
        context.translate(-this.x, -this.y);
    }
}