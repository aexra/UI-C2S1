const level = sessionStorage.getItem("diff")[3]; // this is int (1..4)

setLevelBanner(level);

function setLevelBanner(level) {
	document.getElementById("level-banner").classList.add("lvl" + level);
	for (corner of document.getElementsByClassName("level-banner-corner")) {
		corner.classList.add("lvl" + level);
	}
}