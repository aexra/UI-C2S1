export class Weapon {
    constructor(player) {
        this.player = player;
        this.baseDamage = 1;
        this.damageMultiplier = 1;
        this.baseSpeed = 1;
        this.speedMultiplier = 5;
        this.baseCastDuration = 1;
        this.image = document.getElementById("terraBlade");
        this.width = 46;
        this.height = 54;
        this.drawDistance = this.player.width / 2;
    }
    update(input, deltaTime) {

    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.player.rotation * (this.player.x + (this.player.rotation > 0? this.drawDistance : 0)), this.player.y, this.player.rotation * this.width, this.height);
    }
}