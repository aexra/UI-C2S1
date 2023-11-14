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
        this.spawnRadius = 100;

        this.initialAngleRad = -Math.atan((this.y - this.iy) / (this.ix - this.x)) + (this.ix < this.x? Math.PI : 0);
        this.rotationAngleRad = this.initialAngleRad;
        this.x += this.spawnRadius * Math.cos(this.initialAngleRad);
        this.y += this.spawnRadius * Math.sin(this.initialAngleRad);
    }
    update(input, deltaTime) {

    }
    draw(context) {
        
    }
}