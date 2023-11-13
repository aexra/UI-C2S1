import { MeleeWeapon, RangedWeapon, MagicWeapon, SummonerWeapon } from "./weaponTypes.js"

// MELEE WEAPONS

export class TerraBlade extends MeleeWeapon {
    constructor(player) {
        super(player);

        this.image = document.getElementById("terraBlade");

        this.speedMultiplier = 6;

        this.recalc_params();
    }
}
