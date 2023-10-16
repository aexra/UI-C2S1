const circles = document.getElementsByClassName("outer-circle");

var flags = new Map();
for (let i = 0; i < circles.length; i++) {
	flags.set(circles[i], false);
	circles[i].onclick = onCircleClicked;
}

function disable(target) {
	target.style.backgroundColor = "#262932";
	flags[target] = false;
}

function enable(target) {
	target.style.backgroundColor = "#fff";
	flags[target] = true;
}

function onCircleClicked(e) {
	// выключим все кроме него
	for (let i = 0; i < circles.length; i++) {
		disable(circles[i]);
	}
	// включим нужный
	enable(e.target);
}

let arrowRotation = 1;
function onArrowClicked(arrow) {
	arrow.style.transform = `scaleY(${arrowRotation *= -1})`;
	console.log("aaaaaaaaaaaaaaaa");
}