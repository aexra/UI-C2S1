const main_menu = document.getElementById("main-menu");
const menu_mask = document.getElementById("menu-darken-mask");
const info_popup = document.getElementById("about-project-page");
const profile_popup = document.getElementById("profile-popup");
const scores_popup = document.getElementById("scores-page");
const header = document.getElementsByClassName("header")[0];

var hover = new Audio("../resources/main/music/hover.ogg");
hover.volume = 0.2;

var hover_extra = new Audio("../resources/main/music/hover-extra.ogg");
hover_extra.volume = 0.2;

var click = new Audio("../resources/main/music/click.ogg");
click.volume = 0.1;

window.onload = function() {
	document.getElementById("menu-darken-mask").onclick = (e) => {
		hover_extra.play();
		closeAllPopups();
	};

	document.getElementById("info-btn").onclick = (e) => {
		click.play();
		toggleInfoPopup();
	};

	document.getElementById("profile-btn").onclick = (e) => {
		click.play();
		toggleProfilePopup();
	};

	document.getElementById("scores").onclick = (e) => {
		toggleScoresPopup();
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
	};
	document.getElementById("main-menu-icon").addEventListener("click", (e) => {
		click.play();
	});
}

function onPlayClicked() {
	openLevels();
}
function openLevels() {
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

function menuBrightnessIn() {
	menu_mask.classList.add("darkened");
	header.classList.add("toggled");
}
function menuBrightnessOut() {
	menu_mask.classList.remove("darkened");
	header.classList.remove("toggled");
}

function closeAllPopups() {
	closeLevels();
	closeInfoPopup();
	closeProfilePopup();
	closeScoresPopup();
}

function onPopupOpened() {
	closeAllPopups();
	menuBrightnessIn();
}
function onPopupClosed() {
	menuBrightnessOut();
}

function openInfoPopup() {
	onPopupOpened();
	info_popup.classList.add("page-visible");
}
function closeInfoPopup() {
	onPopupClosed();
	info_popup.classList.remove("page-visible");
}
function toggleInfoPopup() {
	if (info_popup.classList.contains("page-visible")) {
		closeInfoPopup();
	}
	else {
		openInfoPopup();
	}
}

function openProfilePopup() {
	onPopupOpened();
	profile_popup.classList.add("profile-visible");
}
function closeProfilePopup() {
	onPopupClosed();
	profile_popup.classList.remove("profile-visible");
}
function toggleProfilePopup() {
	if (profile_popup.classList.contains("profile-visible")) {
		closeProfilePopup();
	}
	else {
		openProfilePopup();
	}
}

function openScoresPopup() {
	onPopupOpened();
	scores_popup.classList.add("page-visible");
}
function closeScoresPopup() {
	onPopupClosed();
	scores_popup.classList.remove("page-visible");
}
function toggleScoresPopup() {
	if (scores_popup.classList.contains("page-visible")) {
		closeScoresPopup();
	}
	else {
		openScoresPopup();
	}
}


function onLevelClicked(args) {
	saveDifficulty(args);
	window.open("../html/game.html")
}
function saveDifficulty(args) {
	sessionStorage.setItem("diff", args.id);
}