import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js"
import { Vec2 } from "./vec2.js";
import { ParticleEmitter } from "./particleEmitter.js";

window.addEventListener("load", (e) => {
	const level = sessionStorage.getItem("diff")[3]; // this is int (1..4)

	setLevelBanner(level);

	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");

	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight - 50;

	class Game {
		constructor(size, canvasSize) {
			this.size = size;
			this.canvasSize = canvasSize;
			this.canvasTranslation = new Vec2();
			this.projectiles = [];
			this.particleEmitters = [];
			this.input = new InputHandler(this);
			this.map = new Map(new Vec2(this.size.x, this.size.y), this);
			this.player = new Player(this);
			this.cameraPos = new Vec2();
		}
		update(deltaTime) {
			this.player.update(this.input, deltaTime);
			// console.log(this.player.position);
			
			for (let projectile of this.projectiles) {
				projectile.update(this.input, deltaTime);
			}

			for (let emitter of this.particleEmitters) {
				emitter.update(deltaTime);
			}

			this.map.update(this.input, deltaTime);
		}
		draw(context) {
			context.clearRect(0, 0, this.size.x, this.size.y);

			this.map.draw(context);

			this.player.draw(context);

			for (let projectile of this.projectiles) {
				projectile.draw(context);
			}

			for (let emitter of this.particleEmitters) {
				emitter.draw(context);
			}
		}
		createParticleEmitter(position, d, f, t, r, dir, ps, pc, pv, pg, filter) {
			var pe = new ParticleEmitter(position, d, f, t, r, dir, ps, pc, pv, pg, filter);
			this.particleEmitters.push(pe);
			return pe;
		}
		deleteParticleEmitter(emitter) {
			this.particleEmitters.splice(this.particleEmitters.indexOf(emitter), 1);
		}
	}

	const game = new Game(new Vec2(64000, 36000), new Vec2(canvas.width, canvas.height));
	let lastTime = 0;

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		game.update(deltaTime);
		game.draw(ctx);
		requestAnimationFrame(animate);
	}
	animate(0);
});

function setLevelBanner(level) {
	document.getElementById("level-banner").classList.add("lvl" + level);
	document.getElementById("level-banner-title").innerHTML = level == 1? "EASY" : level == 2? "MEDIUM" : level == 3? "HARD" : "GODMODE";

	for (let image of document.getElementsByClassName("level-banner-svg")) {
		image.src = `../resources/main/artwork/lvl${level}.svg`;
	}
	for (let corner of document.getElementsByClassName("level-banner-corner")) {
		corner.classList.add("lvl" + level);

		if (level == 4) {
			corner.style.boxShadow = "0 0 30px gray";
		}
	}
}