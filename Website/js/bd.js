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



const motherboards = [
	new MotherBoard("GIGABYTE Z390 AORUS ELITE", "$312 USD", "../resources/catalog/motherboards/0.jpeg")
		.addProp("Model", "GIGABYTE Z390 AORUS ELITE")
		.addProp("Formfactor", "Standart-ATX")
		.addProp("Socket", "LGA 1151-v2")
		.addProp("Chipset", "Intel Z390")
		.addProp("Frequency", "2666 MHz")];
const graphicCards = [
	new GraphicCard("ProArt GeForce RTX 4080", "$914 USD", "../resources/catalog/videocards/1.png")
		.addProp("Model", "ProArt GeForce RTX 4080")
		.addProp("Tensors", "304")
		.addProp("Architecture", "NVIDIA Ada Lovelace")
		.addProp("Techprocess", "8 nm")
		.addProp("Frequency", "2640 MHz"),
	new GraphicCard("GeForce RTX 2080 Cyberpunk Edition", "not available in your region", "../resources/catalog/videocards/2.jpg")
		.addProp("Model", "GeForce RTX 2080 Cyberpunk Edition")
		.addProp("Tensors", "230")
		.addProp("Release", "2018")
		.addProp("Techprocess", "12 nm")
		.addProp("Frequency", "1635 MHz"),
	new GraphicCard("GeForce RTX 2080 Cyberpunk Edition", "тыща на авито", "../resources/catalog/videocards/0.png")
		.addProp("Model", "Гигабайт чё-то там да")
		.addProp("Tensors", "-1")
		.addProp("Release", "1980")
		.addProp("Techprocess", "50 nm")
		.addProp("Frequency", "10 Hz")];
const rams = [];
const storages = [];
const coolings = [];
const cpus = [];
const audioCards = [];
const cases = [];