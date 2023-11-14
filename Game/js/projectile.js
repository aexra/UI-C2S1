export class Projectile {
    constructor(weapon, ix, iy) {
        this.weapon = weapon;

        this.baseSpeed = 1;
        this.speedMultiplier = 1;

        this.baseDamage = 1;
        this.damageMultiplier = 1;

        this.image;
        this.width;
        this.height;
        this.x = weapon.player.x + weapon.player.width;
        this.y = weapon.player.y;
        this.ix = ix;
        this.iy = iy;
        this.flipX = this.ix < this.x;
        this.rotationRad = (this.flipX? (Math.atan(Math.abs(this.y - this.iy), this.x - this.ix)) : (Math.atan(Math.abs(this.iy - this.y), this.ix - this.x))) * (this.iy - this.y);
    }
    update(input, deltaTime) {

    }
    draw(context) {
        
    }
}