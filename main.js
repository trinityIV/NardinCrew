// Just a collection of modern UI effects. 
// I like to keep these kind of things "handy" (in codepen) to show clients/employers what I'm talking about when I say things like "gradient animation"

// If I ever get around to it, I'll clean this all up (lots of extra
// unecessary markup + CSS). For now,
// I'm just using Codepen as my personal "effect holder" :)

// Inspiration: https://portal.griflan.com/
// Inspiration: https://github.com/cruip/cruip-tutorials/tree/main/spotlight-effect

// Cards spotlight
class Spotlight {
	constructor(containerElement) {
		this.container = containerElement;
		this.cards = Array.from(this.container.children);
		this.mouse = {
			x: 0,
			y: 0,
		};
		this.containerSize = {
			w: 0,
			h: 0,
		};
		this.initContainer = this.initContainer.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.init();
	}

	initContainer() {
		this.containerSize.w = this.container.offsetWidth;
		this.containerSize.h = this.container.offsetHeight;
	}

	onMouseMove(event) {
		const { clientX, clientY } = event;
		const rect = this.container.getBoundingClientRect();
		const { w, h } = this.containerSize;
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		const inside = x < w && x > 0 && y < h && y > 0;
		if (inside) {
			this.mouse.x = x;
			this.mouse.y = y;
			this.cards.forEach((card) => {
				const cardX = -(card.getBoundingClientRect().left - rect.left) + this.mouse.x;
				const cardY = -(card.getBoundingClientRect().top - rect.top) + this.mouse.y;
				card.style.setProperty('--mouse-x', `${cardX}px`);
				card.style.setProperty('--mouse-y', `${cardY}px`);
			});
		}
	}

	init() {
		this.initContainer();
		window.addEventListener('resize', this.initContainer);
		window.addEventListener('mousemove', this.onMouseMove);
	}
}

// Init Spotlight
const spotlights = document.querySelectorAll('[data-spotlight]');
spotlights.forEach((spotlight) => {
	new Spotlight(spotlight);
});

// GSAP ("parallax section reveal
document.addEventListener('DOMContentLoaded', function () {
	gsap.registerPlugin(ScrollTrigger);

	gsap.from(".dx-fixed-background__media-wrapper", {
		scale: 0.55,
		scrollTrigger: {
			trigger: ".dx-fixed-background__media-wrapper",
			start: "top bottom", 
			end: "center 75%", 
			scrub: true
		}
	});
	gsap.from(".dx-fixed-background__media", {
		borderRadius: "300px",
		scrollTrigger: {
			trigger: ".dx-fixed-background__media-wrapper",
			start: "top bottom", // Same start as above
			end: "center 75%", // Same end point as above
			scrub: true
		}
	});
});

//carousel
const carousel = document.querySelector('.carousel');
const carouselContent = document.querySelector('.carousel-content');
const slides = document.querySelectorAll('.slide');
const arrayOfSlides = Array.from(slides);

let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;

slides.forEach((slide, index) => {
	const slideImage = slide.querySelector('img');
	slideImage.addEventListener('dragstart', (e) => e.preventDefault());

	// Touch events
	slide.addEventListener('touchstart', touchStart(index));
	slide.addEventListener('touchend', touchEnd);
	slide.addEventListener('touchmove', touchMove);

	// Mouse events
	slide.addEventListener('mousedown', touchStart(index));
	slide.addEventListener('mouseup', touchEnd);
	slide.addEventListener('mouseleave', touchEnd);
	slide.addEventListener('mousemove', touchMove);
});

// Disable context menu
window.oncontextmenu = function (event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
};

function touchStart(index) {
	return function (event) {
		currentIndex = index;
		startPosition = getPositionX(event);
		isDragging = true;
		animationID = requestAnimationFrame(animation);
		carouselContent.classList.add('grabbing');
	};
}

function touchEnd() {
	isDragging = false;
	cancelAnimationFrame(animationID);

	const movedBy = currentTranslate - prevTranslate;

	if (movedBy < -100 && currentIndex < arrayOfSlides.length - 1) currentIndex += 1;

	if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

	setPositionByIndex();

	carouselContent.classList.remove('grabbing');
}

function touchMove(event) {
	if (isDragging) {
		const currentPosition = getPositionX(event);
		currentTranslate = prevTranslate + currentPosition - startPosition;
	}
}

function getPositionX(event) {
	return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
	setSliderPosition();
	if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
	carouselContent.style.transform = `translateX(${currentTranslate}px)`;
}


function setPositionByIndex() {
	currentTranslate = currentIndex * -window.innerWidth;
	prevTranslate = currentTranslate;
	setSliderPosition();
}


// Gradient animation
const gradient = document.querySelector('.gradient');
let gradientSize = 0;
let animationFrame;

function updateGradientSize() {
	gradientSize = Math.max(window.innerWidth, window.innerHeight);
	gradient.style.width = `${gradientSize}px`;
	gradient.style.height = `${gradientSize}px`;
}

function updateGradientPosition(event) {
	const { clientX, clientY } = event;
	const halfSize = gradientSize / 2;
	const x = clientX - halfSize;
	const y = clientY - halfSize;
	gradient.style.backgroundPosition = `${x}px ${y}px`;
}

function onResize() {
	updateGradientSize();
}


function onMouseMove(event) {
	updateGradientPosition(event);
}


function init() {
	updateGradientSize();
	window.addEventListener('resize', onResize);
	window.addEventListener('mousemove', onMouseMove);
}

init();

// Cursor
const cursor = document.querySelector('.cursor');
const cursorText = document.querySelector('.cursor-text');
const cursorHover = document.querySelector('.cursor-hover');
const cursorHoverText = document.querySelector('.cursor-hover-text');
const cursorHoverTextInner = document.querySelector('.cursor-hover-text-inner');
const cursorHoverTextLetters = cursorHoverTextInner.querySelectorAll('span');
const cursorHoverTextLettersArray = Array.from(cursorHoverTextLetters);
let isCursorHover = false;
let isCursorHoverText = false;
let isCursorHoverTextOut = false;
let isCursorHoverTextInner = false;
let isCursorHoverTextInnerOut = false;

function onMouseMoveCursor(event) {
	const { clientX, clientY } = event;
	cursor.style.left = `${clientX}px`;
	cursor.style.top = `${clientY}px`;
}

function onMouseEnterCursor() {
	cursor.style.opacity = 1;
}

function onMouseLeaveCursor() {
	cursor.style.opacity = 0;
}

function onMouseEnterCursorText() {
	isCursorHoverText = true;
}

function onMouseLeaveCursorText() {
	isCursorHoverText = false;
}

function onMouseEnterCursorHover() {
	isCursorHover = true;
}

function onMouseLeaveCursorHover() {
	isCursorHover = false;
}

function onMouseEnterCursorHoverText() {
	isCursorHoverTextOut = false;
	isCursorHoverText = true;
}

function onMouseLeaveCursorHoverText() {
	isCursorHoverTextOut = true;
	isCursorHoverText = false;
}

function onMouseEnterCursorHoverTextInner() {
	isCursorHoverTextInner = true;
	isCursorHoverTextInnerOut = false;
}

function onMouseLeaveCursorHoverTextInner() {
	isCursorHoverTextInner = false;
	isCursorHoverTextInnerOut = true;
}


function onMouseMoveCursorHover(event) {
	const { clientX, clientY } = event;
	cursorHover.style.left = `${clientX}px`;
	cursorHover.style.top = `${clientY}px`;
}

function onMouseMoveCursorHoverText(event) {
	const { clientX, clientY } = event;
	cursorHoverText.style.left = `${clientX}px`;
	cursorHoverText.style.top = `${clientY}px`;
}

function onMouseMoveCursorHoverTextInner(event) {
	const { clientX, clientY } = event;
	cursorHoverTextInner.style.left = `${clientX}px`;
	cursorHoverTextInner.style.top = `${clientY}px`;
}

function onMouseMoveCursorHoverTextLetters(event) {
	const { clientX, clientY } = event;
	cursorHoverTextLettersArray.forEach((letter, index) => {
		const { offsetTop, offsetLeft, offsetWidth } = letter;
		const x = offsetLeft + offsetWidth / 2;
		const y = offsetTop + offsetWidth / 2;
		const deltaX = clientX - x;
		const deltaY = clientY - y;
		const angle = Math.atan2(deltaY, deltaX);
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const maxDistance = 300;
		const scale = Math.max(0, (maxDistance - distance) / maxDistance);
		letter.style.transform = `translateX(${Math.cos(angle) * scale * 10}px) translateY(${Math.sin(angle) * scale * 10}px`;
	});
}

function onMouseMove(event) {
	onMouseMoveCursor(event);
	if (isCursorHover) {
		onMouseMoveCursorHover(event);
	}
	if (isCursorHoverText) {
		onMouseMoveCursorHoverText(event);
	}
	if (isCursorHoverTextInner) {
		onMouseMoveCursorHoverTextInner(event);
	}
	if (isCursorHoverTextInner) {
		onMouseMoveCursorHoverTextLetters(event);
	}
}

function onMouseEnter() {
	onMouseEnterCursor();
}

function onMouseLeave() {
	onMouseLeaveCursor();
}

function onMouseEnterHover() {
	onMouseEnterCursorHover();
}

function onMouseLeaveHover() {
	onMouseLeaveCursorHover();
}

function onMouseEnterHoverText() {
	onMouseEnterCursorHoverText();
}

function onMouseLeaveHoverText() {
	onMouseLeaveCursorHoverText();
}

function onMouseEnterHoverTextInner() {
	onMouseEnterCursorHoverTextInner();
}

function onMouseLeaveHoverTextInner() {
	onMouseLeaveCursorHoverTextInner();
}

function initCursor() {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseenter', onMouseEnter);
	window.addEventListener('mouseleave', onMouseLeave);
	cursorText.addEventListener('mouseenter', onMouseEnterCursorText);
	cursorText.addEventListener('mouseleave', onMouseLeaveCursorText);
	cursorHover.addEventListener('mouseenter', onMouseEnterHover);
	cursorHover.addEventListener('mouseleave', onMouseLeaveHover);
	cursorHoverText.addEventListener('mouseenter', onMouseEnterHoverText);
	cursorHoverText.addEventListener('mouseleave', onMouseLeaveHoverText);
	cursorHoverTextInner.addEventListener('mouseenter', onMouseEnterHoverTextInner);
	cursorHoverTextInner.addEventListener('mouseleave', onMouseLeaveHoverTextInner);
}

initCursor();
