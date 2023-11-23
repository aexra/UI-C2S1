import { MeleeWeapon, RangedWeapon, MagicWeapon, SummonerWeapon } from "./weaponTypes.js"
import * as projectiles from "./projectiles.js"
import { Vec2 } from "./vec2.js";

// MELEE WEAPONS

export class TerraBlade extends MeleeWeapon {
    constructor(player) {
        super(player);

        this.image = document.getElementById("terraBlade");
        this.speedMultiplier = 8;

        this.recalc_params();
    }
    draw(c) {
        c.translate(this.player.rotation * (this.player.position.x + this.drawDistance), this.player.position.y - this.player.size.y / 6 + this.size.y);
        c.rotate((this.attackProgress === 0?  this.attackProgress : this.attackProgress - 90) * Math.PI / 180);
        c.drawImage(this.image, 0, -this.size.y, this.size.x, this.size.y);
        c.translate(-this.player.rotation * (this.player.position.x + this.drawDistance), -(this.player.position.y - this.player.size.y / 6  + this.size.y));
    }
    onFire(input, deltaTime) {
        this.player.game.projectiles.push(new projectiles.TerraBeam(this, input.mpx, input.mpy));
        let meleeSound = new Audio("../resources/game/weapons/melee/melee.wav");
        meleeSound.volume = 0.01;
        meleeSound.play();
        let sound = new Audio("../resources/game/weapons/melee/terrablade/terrablade.wav");
        sound.volume = 0.05;
        sound.play();
    }
}

export class ExoBlade extends MeleeWeapon {
    constructor(player) {
        super(player);

        this.image = document.getElementById("exoBlade");
        this.speedMultiplier = 4;

        this.size = new Vec2(80, 80);

        this.recalc_params();
    }
    onFire(input, deltaTime) {
        this.player.game.projectiles.push(new projectiles.ExoBeam(this, input.mpx, input.mpy));
    }
}
