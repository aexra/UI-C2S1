const level = sessionStorage.getItem("diff")[3]; // this is int (1..4)

setLevelBanner(level);

function setLevelBanner(level) {
	document.getElementById("level-banner").classList.add("lvl" + level);
	document.getElementById("level-banner-title").innerHTML = level == 1? "EASY" : level == 2? "MEDIUM" : level == 3? "HARD" : "GODMODE";
	
	for (image of document.getElementsByClassName("level-banner-svg")) {
		image.src = `../resources/main/artwork/lvl${level}.svg`;
	}
	for (corner of document.getElementsByClassName("level-banner-corner")) {
		corner.classList.add("lvl" + level);

		if (level == 4) {
			corner.style.boxShadow = "0 0 30px gray";
		}
	}
}