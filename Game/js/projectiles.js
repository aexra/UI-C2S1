import { Projectile } from "./projectile.js"

export class TerraBeam extends Projectile {
    constructor(weapon, ix, iy) {
        super(weapon, ix, iy);

        this.image = document.getElementById("terraBeam");
    }
    update(input, deltaTime) {

    }
    draw(context) {
        context.drawImage(this.image, 0, 0);
        // console.log(this.ix, this.iy);
    }
}