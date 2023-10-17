class ICatalogItem {
	properties = new Map();
	name;
	price;
	thumbnailPath;

	constructor(name, price, thumbnailPath) {
		this.name = name;
		this.price = price;
		this.thumbnailPath = thumbnailPath;
	}

	addProp(key, value) {
		this.properties.set(key, value);
		return this;
	}
}

class MotherBoard extends ICatalogItem {

}
class GraphicCard extends ICatalogItem {

}
class RAM extends ICatalogItem {

}
class Storage extends ICatalogItem {

}
class CoolingSystem extends ICatalogItem {

}
class CPU extends ICatalogItem {

}
class AudioCard extends ICatalogItem {

}
class Case extends ICatalogItem {

}



const graphicCards = [
	new GraphicCard("ProArt GeForce RTX 4080", "$9999 USD", "../resources/catalog/videocards/1.png")
		.addProp("Model", "ProArt GeForce RTX 4080")
		.addProp("Fans", "3")
		.addProp("Architecture", "NVIDIA Ada Lovelace")
		.addProp("Techprocess", "20нм")
		.addProp("Frequency", "2640 МГц"),

];
