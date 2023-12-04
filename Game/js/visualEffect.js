import { GameObject } from "./gameObject.js";

export class VisualEffect extends GameObject {
    constructor(game) {
        super();
        this.game = game;

        this.lifetime = 1000;
        this.lifetimer = 0;

        game.pushVE(this);
    }
    update(input, deltaTime) {
        this.updateLifeTimer(input, deltaTime);
    }
    updateLifeTimer(input, deltaTime) {
        this.lifetimer += deltaTime;
        if (this.lifetimer >= this.lifetime) {
            this.game.deleteVE(this);
        }
    }
    draw(c) {

    }
}