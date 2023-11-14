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
        this.x = weapon.player.x + weapon.player.width / 2;
        this.y = weapon.player.y + weapon.player.height / 2;
        this.ix = ix;
        this.iy = iy;
        this.flipX = this.ix < this.x;
        // this.rotationRad = (this.flipX? (Math.atan(Math.abs(this.y - this.iy), this.x - this.ix)) : (Math.atan(Math.abs(this.iy - this.y), this.ix - this.x)));
        
        if (!this.flipX) {
            if (this.iy > this.y) {
                // четвертая четверть
                this.rotationRad = -Math.atan((this.y - this.iy) / (this.ix - this.x));
            } else {
                // первая четверть
                this.rotationRad = -Math.atan((this.y - this.iy) / (this.ix - this.x));
            }
        } else {
            if (this.iy > this.y) {
                // третья четверть
                this.rotationRad = -Math.atan((this.y - this.iy) / (this.ix - this.x))  + Math.PI;
            } else {
                // вторая четверть
                this.rotationRad = -Math.atan((this.y - this.iy) / (this.ix - this.x)) + Math.PI;
            }
        }
    }
    update(input, deltaTime) {

    }
    draw(context) {
        
    }
}