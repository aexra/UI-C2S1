import { Player } from "./player.js";
import { InputHandler } from "./input.js";

window.addEventListener("load", (e) => {
	const level = sessionStorage.getItem("diff")[3]; // this is int (1..4)

	setLevelBanner(level);

	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");

	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight - 50;

	class Game {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.player = new Player(this);
			this.input = new InputHandler();
		}
		update(deltaTime) {
			this.player.update(this.input.keys, deltaTime);
		}
		draw(context) {
			context.clearRect(0, 0, this.width, this.height);
			this.player.draw(context);
		}
	}

	const game = new Game(canvas.width, canvas.height);
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