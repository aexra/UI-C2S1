window.onload = function() {
	var hover = new Audio("../resources/main/music/hover.ogg");
	hover.volume = 0.2;

	var hover_extra = new Audio("../resources/main/music/hover-extra.ogg");
	hover_extra.volume = 0.2;

	for (let btn of document.getElementsByClassName("main-menu-button")) {
		btn.onmouseenter = (e) => {
			hover.play();
		}
	}

	document.getElementById("main-menu-icon").onmouseenter = (e) => {
		hover_extra.play();
	}
}

function onPlayClicked() {
	console.log("Play");
}