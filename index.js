const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const points = [];
const MAX_POINTS = 1000;
const RADIUS = 5;
let selectedPoint = null;

function generatePoints() {
	const width = canvas.width;
	const height = canvas.height;
	for (let i = 0; i < MAX_POINTS; i++) {
		points[i] = {
			x: Math.random() * width,
			y: Math.random() * height,
			radius: RADIUS,
		}
	}
}
function draw() {
	const width = canvas.width;
	const height = canvas.height;
	ctx.clearRect(0, 0, width, height);

	for (const p of points) {
		circle(p, 'black')
	}

	if (selectedPoint) {
		circle(selectedPoint, 'blue')
	}
}

function circle(p, color) {
	ctx.beginPath();
	ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	generatePoints();
	draw();
}

function setPoint(e) {
	const rect = canvas.getBoundingClientRect();
	selectedPoint = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
		radius: RADIUS,
	}
	draw();
}

function main() {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('mousedown', setPoint, false);
}

main()
