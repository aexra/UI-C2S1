import { MeleeWeapon, RangedWeapon, MagicWeapon, SummonerWeapon } from "./weaponTypes.js"
import * as projectiles from "./projectiles.js"

// MELEE WEAPONS

export class TerraBlade extends MeleeWeapon {
    constructor(player) {
        super(player);

        this.image = document.getElementById("terraBlade");
        this.speedMultiplier = 8;

        this.recalc_params();
    }
    onFire(input, deltaTime) {
        this.player.game.projectiles.push(new projectiles.TerraBeam(this, input.mpx, input.mpy));
    }
}

export class ExoBlade extends MeleeWeapon {
    constructor(player) {
        super(player);

        this.image = document.getElementById("exoBlade");
        this.speedMultiplier = 4;

        this.width = 80;
        this.height = 80;

        this.recalc_params();
    }
    onFire(input, deltaTime) {
        this.player.game.projectiles.push(new projectiles.ExoBeam(this, input.mpx, input.mpy));
    }
}
