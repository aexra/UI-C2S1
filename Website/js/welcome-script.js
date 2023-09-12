const projectContainer = [...document.querySelectorAll('.projects-container')];
const preBtn = [...document.querySelectorAll('.preProjectBtn')];
const nextBtn = [...document.querySelectorAll('.nextProjectBtn')];

projectContainer.forEach((item, i) => {
	let containerDimension = item.getBoundingClientRect();
	let containerWidth = containerDimension.width;

	preBtn[i].addEventListener('click', () => {
		item.scrollLeft -= containerWidth * 1.05;
	})

	nextBtn[i].addEventListener('click', () => {
		item.scrollLeft += containerWidth * 1.05;
	})
})