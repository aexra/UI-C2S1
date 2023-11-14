export class Projectile {
    constructor(weapon, ix, iy) {
        this.weapon = weapon;

        this.baseSpeed = 1;
        this.speedMultiplier = 1;

        this.baseDamage = 1;
        this.damageMultiplier = 1;

        this.image;
        this.x;
        this.y;
        this.ix = ix;
        this.iy = iy;
    }
    update(input, deltaTime) {

    }
    draw(context) {
        
    }
}