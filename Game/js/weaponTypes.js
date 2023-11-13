import { Weapon } from "./weapon.js"

export class MeleeWeapon extends Weapon {
    constructor(player) {
        super(player);

        this.range = 50;

        // анимация атаки
        this.attackRotationAnimationAngle = 110;
        this.attackRotationAnimationFrequency = this.attackRotationAnimationAngle * this.baseSpeed * this.speedMultiplier / this.baseCastDuration / 1000;
        this.attackProgress = 0;

        this.recalc_params();
    }
    update(input, deltaTime) {
        if (input.includes("lmb")) {
            if (this.attackProgress === 0) {
                this.attackProgress += this.attackRotationAnimationFrequency * deltaTime;
            }
        }
        if (this.attackProgress !== 0) {
            if (this.attackProgress >= this.attackRotationAnimationAngle) {
                this.attackProgress = 0;
            }
            else {
                this.attackProgress += this.attackRotationAnimationFrequency * deltaTime;
            }
        }
    }
    draw(context) {
        if (this.player.rotation > 0) {
            context.translate(this.player.x + this.drawDistance, this.player.y + this.height);
            context.rotate(this.attackProgress * Math.PI / 180);
            context.drawImage(this.image, 0, -this.height);
            context.translate(-this.player.x, -this.player.y);
        } else {
            context.translate(-this.player.x-this.drawDistance, this.player.y + this.height);
            context.rotate(this.attackProgress * Math.PI / 180);
            context.drawImage(this.image, this.drawDistance, -this.height, -this.width, this.height);
            context.translate(-this.player.x, -this.player.y);
        }
    }
    recalc_params() {
        this.attackRotationAnimationFrequency = this.attackRotationAnimationAngle * this.baseSpeed * this.speedMultiplier / this.baseCastDuration / 1000;
    }
}

export class RangedWeapon extends Weapon {
    constructor(player) {
        super(player);
    }
}

export class MagicWeapon extends Weapon {
    constructor(player) {
        super(player);
    }
}

export class SummonerWeapon extends Weapon {
    constructor(player) {
        super(player);
    }
}