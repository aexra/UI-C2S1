import { Weapon } from "./weapon.js"

export class MeleeWeapon extends Weapon {
    constructor(player) {
        super(player);

        this.range = 50;

        // анимация атаки
        const attackRotationAnimationAngle = 90;
        this.attackRotationAnimationFrequency = attackRotationAnimationAngle / this.baseSpeed / 1000;
        this.attackProgress = 0;
    }
    update(input, deltaTime) {
        if (input.includes("lmb")) {
            if (this.attackProgress === 0) {
                this.attackProgress += this.attackRotationAnimationFrequency * deltaTime;
            }
        }
        if (this.attackProgress !== 0) {
            if (this.attackProgress >= 90) {
                console.log("ATTACK FINISHED");
                this.attackProgress = 0;
            }
            else {
                console.log(this.attackProgress);
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