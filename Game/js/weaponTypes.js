import { Weapon } from "./weapon.js"
import { Config } from "./misc.js";

export class MeleeWeapon extends Weapon {
    constructor(player) {
        super(player);

        this.range = 50;

        // анимация атаки
        this.attackRotationAnimationAngle = 150;
        this.attackRotationAnimationFrequency = this.attackRotationAnimationAngle * this.baseSpeed * this.speedMultiplier / this.baseCastDuration / 1000;
        this.attackProgress = 0;

        this.recalc_params();
    }
    update(input, deltaTime) {
        if (input.keys.includes("lmb")) {
            if (this.attackProgress === 0) {
                this.attackProgress += this.attackRotationAnimationFrequency * deltaTime;
                this.onFire(input, deltaTime);
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
            context.translate(this.player.position.x + this.drawDistance, this.player.position.y + this.size.y);
            context.rotate(this.attackProgress * Math.PI / 180);
            context.drawImage(this.image, 0, -this.size.y, this.size.x, this.size.y);
            context.translate(-this.player.position.x, -this.player.position.y);
        } else {
            context.translate(-this.player.position.x-this.drawDistance, this.player.position.y + this.size.y);
            context.rotate(this.attackProgress * Math.PI / 180);
            context.drawImage(this.image, this.drawDistance, -this.size.y, -this.size.x, this.size.y);
            context.translate(-this.player.position.x, -this.player.position.y);
        }
    }
    recalc_params() {
        this.attackRotationAnimationFrequency = this.attackRotationAnimationAngle * this.baseSpeed * this.speedMultiplier / this.baseCastDuration / 1000;
    }
    onFire() {
        let meleeSound = new Audio("../resources/game/weapons/melee/melee.wav");
        meleeSound.volume = Config.audio.sfx;
        meleeSound.play();
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