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

const items = document.getElementById("items");
function update() {
	var itemsHTML = `<div class="item">\
						<div class="info">\
							<div class="image-container">\
								<span class="price">${graphicCards[0].price}</span>\
								<img src="${graphicCards[0].thumbnailPath}" alt="">\
							</div>\
							<div class="props-container">`;
	itemsHTML += '				<div class="keyValuePair">\
									<span class="key">Property 1</span>\
									<span class="value">Value 1</span>\
								</div>\
								<div class="keyValuePair">\
									<span class="key">Property 2</span>\
									<span class="value">Value 2</span>\
								</div>\
								<div class="keyValuePair">\
									<span class="key">Property 3</span>\
									<span class="value">Value 3</span>\
								</div>\
								<div class="keyValuePair">\
									<span class="key">Property 4</span>\
									<span class="value">Value 4</span>\
								</div>\
								<div class="keyValuePair">\
									<span class="key">Property 5</span>\
									<span class="value">Value 5</span>\
								</div>\
							</div>\
						</div>\
						<img class="more" onclick="onArrowClicked(this)" src="../resources/catalog/arrow.png">\
						<button class="addtocart">Add to cart</button>\
					</div>';
	items.innerHTML = itemsHTML;
}

window.onload = update();