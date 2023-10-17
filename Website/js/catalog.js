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

	update();
}

let arrowRotation = 1;
function onArrowClicked(arrow) {
	arrow.style.transform = `scaleY(${arrowRotation *= -1})`;
	console.log("aaaaaaaaaaaaaaaa");
}

function getTargetedCategory() {
	for (let [key, value] of flags) {
		if (value == true) return key;
	}
	return null;
}

function getTargetedBD() {
	let category = getTargetedCategory();
	console.log(category.id);
	if (category == null) return null;


	switch(category.id) {
	case "motherboards":
		return motherboards;
	case "graphicCards":
		return graphicCards;

	}
}

const items = document.getElementById("items");
function update() {
	var itemsHTML = "";
	let target = getTargetedBD();

	if (target == null) return;

	for (var card of target)
	{
		itemsHTML += `<div class="item">\
						<div class="info">\
							<div class="image-container">\
								<span class="price">${card.price}</span>\
								<img src="${card.thumbnailPath}" alt="">\
							</div>\
							<div class="props-container">`;
		for (let [key, value] of card.properties) {
			itemsHTML += `		<div class="keyValuePair">\
									<span class="key">${key}</span>\
									<span class="value">${value}</span>\
								</div>`;
		}
		itemsHTML += '		</div>\
						</div>\
						<img class="more" onclick="onArrowClicked(this)" src="../resources/catalog/arrow.png">\
						<button class="addtocart">Add to cart</button>\
					</div>';
	}

	items.innerHTML = itemsHTML;
}

window.onload = update();