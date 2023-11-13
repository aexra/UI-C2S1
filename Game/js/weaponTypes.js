import { Weapon } from "./weapon.js"

export class MeleeWeapon extends Weapon {
    constructor(player) {
        super(player);

        this.range = 50;
        this.isAttacking = false;
        this.attackingFrame = 0;
    }
    update(input, deltaTime) {
        if (input.includes("lmb")) {
            console.log("ATTACK!!!");
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