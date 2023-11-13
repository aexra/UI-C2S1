import { Weapon } from "./weapon.js"

export class MeleeWeapon extends Weapon {
    constructor(player) {
        super(player);

        this.range = 50;

        // анимация атаки
        this.attackRotationAnimationAngle = 90;
        this.attackRotationAnimationFrequency = this.attackRotationAnimationAngle * this.baseSpeed * this.speedMultiplier / this.baseCastDuration / 1000;
        this.attackProgress = 0;
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