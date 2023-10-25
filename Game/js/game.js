const level = sessionStorage.getItem("diff")[3]; // this is int (1..4)

setLevelBanner(level);

function setLevelBanner(level) {
	document.getElementById("level-banner").classList.add("lvl" + level);
	document.getElementById("level-banner-title").innerHTML = level == 1? "EASY" : level == 2? "MEDIUM" : level == 3? "HARD" : "GODMODE";
	document.getElementById("level-banner-svg").src = `../resources/main/artwork/lvl${level}.svg`;

	for (corner of document.getElementsByClassName("level-banner-corner")) {
		corner.classList.add("lvl" + level);
	}
}