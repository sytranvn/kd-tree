import Node, { KdPoint } from "./kdtree.js";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const points = [];
const MAX_POINTS = 1000;
const RADIUS = 5;
let selectedPoint = null;
/**
 * @type {Node}
 */
let root = null;
/**
 * @type {KdPoint}
 */
let nearestPoint = null;
let nearestPointBf = null;

function generatePoints() {
	const width = canvas.width;
	const height = canvas.height;
	root = null;
	nearestPoint = null;
	for (let i = 0; i < MAX_POINTS; i++) {
		points[i] = {
			x: Math.random() * width,
			y: Math.random() * height,
			radius: RADIUS,
		}
		const p = new KdPoint(points[i].x, points[i].y);
		if (root) root.insert(p);
		else root = new Node(p);
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

	if (nearestPoint) {
		circle(nearestPoint, 'yellow')
	}

	if (nearestPointBf) {
		circle(nearestPointBf, 'red')
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
	const nearestNode = root.nearestNeighborSearch(new KdPoint(selectedPoint.x, selectedPoint.y));
	nearestPoint = nearestNode ? { x: nearestNode.point.axes[0], y: nearestNode.point.axes[1], radius: RADIUS } : null;
	nearestNeighborBfSearch();
	draw();
}

function nearestNeighborBfSearch() {
	nearestPointBf = null;
	let minDis = Number.POSITIVE_INFINITY;
	for (const point of points) {
		const dis = (point.x - selectedPoint.x)**2 + (point.y - selectedPoint.y)**2;
		if (dis < minDis) {
			minDis = dis;
			nearestPointBf = point;
		}
	}
}

function main() {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('mousedown', setPoint, false);
}

main()
