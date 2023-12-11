const main_menu = document.getElementById("main-menu");
const menu_mask = document.getElementById("menu-darken-mask");
const info_popup = document.getElementById("about-project-page");
const profile_popup = document.getElementById("profile-popup");
const options_popup = document.getElementById("options-popup");
const error_popup = document.getElementById("error-popup");
const error_msg = document.getElementById("error-msg");
const scores_popup = document.getElementById("scores-page");
const header = document.getElementsByClassName("header")[0];

var hover = new Audio("../resources/main/music/hover.ogg");
hover.volume = 0.2;

var hover_extra = new Audio("../resources/main/music/hover-extra.ogg");
hover_extra.volume = 0.2;

var click = new Audio("../resources/main/music/click.ogg");
click.volume = 0.1;

var error = new Audio("../resources/main/music/error.mp3");
error.volume = 0.1;

applyAudioVolume();

window.onload = function() {
	styleSliders();

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

	loadUsername();
}

function onLogOutPressed() {
	click.play();
	logOut();
}

function logOut() {
	sessionStorage.setItem("username", "");
	loadUsername();
}

function styleSliders() {
	for (var slider of document.getElementsByClassName("options-slider")) {
		slider.oninput = (e) => {
			var value = (e.target.value-e.target.min)/(e.target.max-e.target.min)*100;
			e.target.style.background = 'linear-gradient(to right, #ff69b4 0%, #ff69b4 ' + value + '%, #515151 ' + value + '%, #515151 100%)'
		};
		var value = (slider.value-slider.min)/(slider.max-slider.min)*100;
		slider.style.background = 'linear-gradient(to right, #ff69b4 0%, #ff69b4 ' + value + '%, #515151 ' + value + '%, #515151 100%)'
	}

	document.getElementById("audio-music-range").addEventListener("input", (e) => {
		localStorage.setItem("music-volume", e.target.value);
		applyAudioVolume();
	});
	document.getElementById("audio-sfx-range").addEventListener("input", (e) => {
		localStorage.setItem("sfx-volume", e.target.value);
		applyAudioVolume();
	});
}

function fillScoresTable() {
	const table1 = document.getElementById('scores-table-easy');
	const table2 = document.getElementById('scores-table-medium');
	const table3 = document.getElementById('scores-table-hard');
	const table4 = document.getElementById('scores-table-godmode');
	
	for (const digit of [1, 2, 3, 4]) {
		const table = digit == 1? table1 : digit == 2? table2 : digit == 3? table3 : table4;
		const header = document.getElementById(`scores-header-${digit == 1? "easy" : digit == 2? "medium" : digit == 3? "hard" : "godmode"}`);
		const recordsString = localStorage.getItem(`levelRecords${digit}`);
		
		if (!recordsString || recordsString == "") {
			table.style.display = 'none';
			header.style.display = 'none';
			continue;
		}
		
		const records = parseRecordsString(recordsString);
		sortScores(records);
		var inner = '<tr><th>№</th><th>Player</th><th>Date</th><th>Score</th><th>Duration</th>'

		var k = 1;
		for (var record of records) {
			inner += `<tr><td>${k}</td><td>${record.username}</td><td>${record.date}</td><td>${record.score}</td><td>${record.duration}</td></tr>`;
			k++;
		}

		table.innerHTML = inner;
	}
}
function parseRecordsString(str) {
	var records = [];
	var currentString = "";
	var opened = false;
	for (var i = 0; i < str.length; i++) {
		if (opened) {
			if (str[i] == '}') {
				opened = false;
				var record = parseRecordString(currentString);
				if (record) records.push(record);
				currentString = "";
			} else {
				currentString += str[i];
			}
		} else {
			if (str[i] == '{') {
				opened = true;
			}
		}
	}
	return records;
}
function parseRecordString(str) {
	if (count(str, ';') != 3) return null;

	var ary = [];
	var tmp = "";
	for (var i = 0; i < str.length; i++) {
		if (str[i] == ';') {
			ary.push(tmp);
			tmp = "";
		} else {
			tmp += str[i];
		}
	}
	ary.push(tmp);
	return {
		username: ary[0],
		date: ary[1],
		score: ary[2],
		duration: ary[3],
	};
}
function count(str, c) {
	var k = 0;
	for (var i = 0; i < str.length; i++) {
		if (str[i] == c) {
			k++;
		}
	}
	return k;
}
function swap(ary, a, b) {
	[ary[a], ary[b]] = [ary[b], ary[a]];
}
function sortScores(scores) {
	var sorted = false;
	while (!sorted) {
		sorted = true;
		for (var i = 0; i < scores.length - 1; i++) {
			if (parseInt(scores[i].score) < parseInt(scores[i+1].score)) {
				swap(scores, i, i+1);
				sorted = false;
			}
		}
	}
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
	closeOptionsPopup();
	closeErrorPopup();
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
	fillScoresTable();
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

function openOptionsPopup() {
	onPopupOpened();
	options_popup.classList.add("options-visible");
}
function closeOptionsPopup() {
	onPopupClosed();
	options_popup.classList.remove("options-visible");
}
function toggleOptionsPopup() {
	if (options_popup.classList.contains("options-visible")) {
		closeOptionsPopup();
	}
	else {
		openOptionsPopup();
	}
}

function onLevelClicked(args) {
	if (!sessionStorage.getItem("username") || sessionStorage.getItem("username") == "") {
		showErrorMessage("You must log in first to play!");
		return;
	}
	saveDifficulty(args);
	window.open("../html/game.html")
}
function saveDifficulty(args) {
	sessionStorage.setItem("diff", args.id);
}

function showErrorMessage(msg) {
	error_msg.innerHTML = msg;
	error.play();
	openErrorPopup();
}

function openErrorPopup() {
	onPopupOpened();
	error_popup.classList.add("error-visible");
}
function closeErrorPopup() {
	onPopupClosed();
	click.play();
	error_popup.classList.remove("error-visible");
}

function applyNewUsername() {
	click.play();
	closeAllPopups();
	var name = document.getElementById("name-input").value;
	if (!name || name == "") {
		showErrorMessage("Name must contain letters!");
		return;
	}
	document.getElementById("name-span").innerHTML = name;
	sessionStorage.setItem("username", name);
}
function loadUsername() {
	var name = sessionStorage.getItem("username");
	if (name) {
		document.getElementById("name-span").innerHTML = name;
		document.getElementById("name-input").value = name;
	} else {
		document.getElementById("name-span").innerHTML = "Log in";
		document.getElementById("name-input").value = "";
	}
}

function clearLocalStorage() {
	click.play();
	localStorage.clear();
}

function getAudioVolume() {
	return {
		music: localStorage.getItem("music-volume") / 100 ?? 0.1,
		sfx: localStorage.getItem("sfx-volume") / 100 ?? 0.1,
	};
}

function applyAudioVolume() {
	const sfx = getAudioVolume().sfx;
	hover.volume = sfx;
	hover_extra.volume = sfx;
	click.volume = sfx;
	error.volume = sfx;
}