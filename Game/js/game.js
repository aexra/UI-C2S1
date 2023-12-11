import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Map } from "./map.js"
import { Vec2 } from "./vec2.js";
import { ParticleEmitter } from "./particleEmitter.js";
import { UI } from "./ui.js";
import { DamageIndicator } from "./damageIndicator.js";
import { Collision, Random, Config } from "./misc.js";
import { Thanatos } from "./npcs.js";
import * as visuals from "./visualEffects.js";

window.addEventListener("load", (e) => {
	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");

	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight - 50;

	class Game {
		constructor(size, canvasSize, ctx) {
			this.level = parseInt(sessionStorage.getItem("diff")[3]); // this is int (1..4)
			this.timerObject = document.getElementById("timer");
			setLevelBanner(this.level);
			Config.load();

			this.size = size;
			this.canvasSize = canvasSize;
			this.canvasContext = ctx;
			this.canvasTranslated = new Vec2();
			this.projectiles = [];
			this.particleEmitters = [];
			this.damageIndicators = [];
			this.npcs = [];
			this.visualEffects = [];
			this.input = new InputHandler(this);
			this.map = new Map(new Vec2(this.size.x, this.size.y), this);
			this.player = new Player(this);
			this.ui = new UI(this);
			this.cameraPos = new Vec2();
			this.thanatos = null;

			this.isDraedonInitiated = false;
			this.isFightInitiated = false;

			this.fightTimer = 0;
			this.score = 0;
		}
		update(deltaTime) {
			if (this.isFightInitiated) {
				this.fightTimer += deltaTime;
			}
			this.player.update(this.input, deltaTime);
			// console.log(this.player.position);
			// console.log(1 / (deltaTime / 1000));
			// console.log(this.input.keys);
			
			for (let projectile of this.projectiles) {
				projectile.update(this.input, deltaTime);
			}

			for (let emitter of this.particleEmitters) {
				emitter.update(deltaTime);
			}

			this.updateHits(this.input, deltaTime);
			this.updateNPCtoPlayerCollisions(this.input, deltaTime);

			for (var di of this.damageIndicators) {
				di.update(this.input, deltaTime);
			}

			for (var npc of this.npcs) {
				npc.update(this.input, deltaTime);
			}

			this.map.update(this.input, deltaTime);

			this.ui.update(this.input, deltaTime);
			
			this.updateVisualEffects(this.input, deltaTime);
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

			for (var npc of this.npcs) {
				npc.draw(context);
			}
			
			for (var di of this.damageIndicators) {
				di.draw(context);
			}
			
			this.map.drawShaders(context);

			this.ui.draw(context);
			
			this.drawVisualEffects(context);

			// level1: "{player;date;score;duration},{player;date;score;duration}"
		}
		saveRecord() {
			var thisLevelRecordsString = localStorage.getItem(`levelRecords${this.level}`);
			if (!thisLevelRecordsString) thisLevelRecordsString = "";
			thisLevelRecordsString += this.getRecordString() + ',';
			localStorage.setItem(`levelRecords${this.level}`, thisLevelRecordsString);
		}
		getRecordString() {
			const username = sessionStorage.getItem('username');
			const dateString = this.getDateString();
			const time = this.getDurationString();

			return `{${username};${dateString};${this.score};${time}}`;
		}
		getDateString() {
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			return `${dd}.${mm}.${yyyy}`;
		}
		getDurationString() {
			const seconds = Math.floor(this.fightTimer / 1000);
			if (Math.floor(seconds / 60) == 0) {
				return `${seconds}s`;
			} else {
				return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
			}
		}
		updateHits(input, deltaTime) {
			for (var npc of this.npcs) {
				var p = npc.checkPojectilesCollisions();
				if (p != null) {
					var iscrit = Random.randf(0, 100, 2) < 12? true : false;
					var dmg = p.baseDamage * p.damageMultiplier * (iscrit? 2 : 1);
					npc.hit(Random.randi(dmg - 10, dmg + 10), iscrit);
				}
			}
		}
		updateNPCtoPlayerCollisions(input, deltaTime) {
			if (this.player.immortal) { return; }
			for (var npc of this.npcs) {
				if (Collision.collideBox(
					this.player.hitbox.position.copy().add(new Vec2(this.player.hitbox.size.x / 2, this.player.hitbox.size.y / 2)), 
					this.player.hitbox.size,
					npc.getHitbox().position,
					npc.getHitbox().size
				)) {
					this.player.getDamage(npc.collisionDamage);
					return;
				}
			}
		}
		updateVisualEffects(input, deltaTime) {
			for (var ve of this.visualEffects) {
				ve.update(input, deltaTime);
			}
		}
		drawVisualEffects(c) {
			for (var ve of this.visualEffects) {
				ve.draw(c);
			}
		}
		createParticleEmitter() {
			var pe = new ParticleEmitter(this);
			this.particleEmitters.push(pe);
			return pe;
		}
		deleteParticleEmitter(emitter) {
			this.particleEmitters.splice(this.particleEmitters.indexOf(emitter), 1);
		}
		createDI(origin, damage, iscrit) {
			var di = new DamageIndicator(this, origin, damage);
			di.iscrit = iscrit;
			di.onfade = (s) => {
				this.deleteDI(di);
			};
			this.damageIndicators.push(di);
		}
		createDI(origin, damage, iscrit, type) {
			var di = new DamageIndicator(this, origin, damage);
			di.iscrit = iscrit;
			di.type = type;
			di.onfade = (s) => {
				this.deleteDI(di);
			};
			this.damageIndicators.push(di);
		}
		deleteDI(di) {
			this.damageIndicators.splice(this.damageIndicators.indexOf(di), 1);
		}
		pushVE(ve) {
			this.visualEffects.push(ve);
		}
		deleteVE(ve) {
			this.visualEffects.splice(this.visualEffects.indexOf(ve), 1);
		}
		initiateDraedon() {
			this.isDraedonInitiated = true;

			var beamSound = new Audio("../resources/game/tilesets/incollisionable/codebreaker/CodebreakerBeam.wav");
			beamSound.volume = Config.audio.sfx;
			beamSound.play();

			new visuals.DraedonInitiatingBeam(this);

			var game = this;

			setTimeout(() => {
				var teslaSound = new Audio("../resources/game/tilesets/incollisionable/codebreaker/TeslaCannonFire.wav");
				teslaSound.volume = Config.audio.sfx;
				teslaSound.play();
			  }, 1000)
			setTimeout(() => {
				new visuals.ThanatosSpawnScreen(game);
				// var introSound = new Audio("../resources/game/npcs/sounds/exo_intro.ogg");
				// introSound.volume = 0.1;
				// introSound.play();
				var introSound = new Audio("../resources/game/npcs/sounds/exo_theme.mp3");
				introSound.volume = Config.audio.music;
				introSound.play();
				this.initiateFight();
			}, 3000);
			setTimeout(() => {
				// this.initiateFight();
				// var introSound = new Audio("../resources/game/npcs/sounds/exo_theme.mp3");
				// introSound.volume = 0.06;
				// introSound.play();
			}, 6000);
		}
		initiateFight() {
			this.isFightInitiated = true;
			this.thanatos = new Thanatos(this);
			this.ui.addBossLifeBar(this.thanatos);
		}
	}

	const game = new Game(new Vec2(72000, 72000), new Vec2(canvas.width, canvas.height), ctx);
	let lastTime = 0;

	manageHTML(game);

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		game.update(deltaTime);
		game.draw(ctx);
		requestAnimationFrame(animate);
	}
	animate(0);
});

function manageHTML(game) {
	setTimerInterval(game);
	manageKeybindingsButton();
}

function setTimerInterval(game) {
	setInterval(() => {
		game.timerObject.innerHTML = game.getDurationString();
	}, 1000);
}

function manageKeybindingsButton() {
	document.getElementById("inputs").onclick = (e) => {
		var panel = document.getElementById("key-bindings-panel");
		if (panel.classList.contains("panel-visible")) {
			panel.classList.remove("panel-visible");
		} else {
			panel.classList.add("panel-visible");
		}
	};
}

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