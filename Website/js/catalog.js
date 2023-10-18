const circles = document.getElementsByClassName("outer-circle");

var flags = new Map();
for (let i = 0; i < circles.length; i++) {
	flags.set(circles[i].id, false);
	// flags[circles[i]] = false;
	circles[i].onclick = onCircleClicked;
}

function disable(target) {
	target.style.backgroundColor = "#262932";
	flags[target.id] = false;
}

function enable(target) {
	target.style.backgroundColor = "#fff";
	flags[target.id] = true;
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

function onArrowClicked(arrow) {
	arrow.style.transform = `scaleY(${-1})`;
}

function getTargetedCategory() {
	for (let id of flags.keys()) {
		if (flags[id] == true) return id;
	}
	return null;
}

function getTargetedBD() {
	let category = getTargetedCategory();
	if (category == null) return null;


	switch(category) {
	case "motherboards":
		return motherboards;
	case "graphicCards":
		return graphicCards;
	case "rams":
		return rams;
	case "storages":
		return storages;
	case "coolings":
		return coolings;
	case "cpus":
		return cpus;
	case "audioCards":
		return audioCards;
	case "cases":
		return cases;
	default:
		return null;
	}
}

const collections = [motherboards, graphicCards, rams, storages, coolings, cpus, audioCards, cases];
const items = document.getElementById("items");
function update() {
	// console.log(flags);
	var itemsHTML = "";
	let target = getTargetedBD();
	// console.log(target);

	if (target == null)
	{
		console.log("added all");
		for (let collection of collections)
		{
			for (let item of collection)
			{
				itemsHTML += getItemHTML(item);
			}
		}
	}
	else {
		for (var item of target)
		{
			itemsHTML += getItemHTML(item);
		}
	}

	items.innerHTML = itemsHTML;
}

function getItemHTML(item)
{
	itemHTML = `<div class="item">\
						<div class="info">\
							<div class="image-container">\
								<span class="price">${item.price}</span>\
								<img src="${item.thumbnailPath}" alt="">\
							</div>\
							<div class="props-container">`;
	for (let [key, value] of item.properties) {
		itemHTML += `		<div class="keyValuePair">\
								<span class="key">${key}</span>\
								<span class="value">${value}</span>\
							</div>`;
	}
	itemHTML += '		</div>\
					</div>\
					<img class="more" onclick="onArrowClicked(this)" src="../resources/catalog/arrow.png">\
					<button class="addtocart">Add to cart</button>\
				</div>';
	return itemHTML;
}

window.onload = update();