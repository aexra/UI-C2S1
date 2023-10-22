const main_menu = document.getElementById("main-menu");

var hover = new Audio("../resources/main/music/hover.ogg");
hover.volume = 0.2;

var hover_extra = new Audio("../resources/main/music/hover-extra.ogg");
hover_extra.volume = 0.2;

var click = new Audio("../resources/main/music/click.ogg");
click.volume = 0.1;

window.onload = function() {
	document.getElementById("menu-darken-mask").onclick = (e) => {
		hover_extra.play();
		closeLevels();
	};

	document.getElementById("info-btn").onclick = (e) => {
		click.play();
		toggleMenuBrightness();
	};

	for (let btn of document.getElementsByClassName("main-menu-button")) {
		btn.onmouseenter = (e) => {
			hover.play();
		};
		btn.addEventListener("click", (e) => {
			click.play();
		});
	}

	document.getElementById("main-menu-icon").onmouseenter = (e) => {
		hover_extra.play();
	}
	document.getElementById("main-menu-icon").addEventListener("click", (e) => {
		click.play();
	});
}

function onPlayClicked() {
	document.getElementById("lvl1").classList.toggle("w0");
	document.getElementById("lvl2").classList.toggle("w0");
	document.getElementById("lvl3").classList.toggle("w0");
	document.getElementById("lvl4").classList.toggle("w0");
}

function closeLevels() {
	document.getElementById("lvl1").classList.add("w0");
	document.getElementById("lvl2").classList.add("w0");
	document.getElementById("lvl3").classList.add("w0");
	document.getElementById("lvl4").classList.add("w0");
}

function toggleMenuBrightness() {
	document.getElementById("menu-darken-mask").classList.toggle("darkened");
}