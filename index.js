import KdTree, { KdPoint } from "./kdtree.js";
import Rand from "./rand.js";
const debug = false;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const points = [];
const MAX_POINTS = 500;
/**
 * @type {KdPoint}
 */
let selectedPoint = null;
/**
 * @type {KdTree}
 */
let root = null;
/**
 * @type {KdPoint}
 */
let nearestPoint = null;
let autoId = null
// Rand.seed(100, 200, 300, 400)
let delay = 100;
function generatePoints() {
	const width = canvas.width;
	const height = canvas.height;
	root = null;
	nearestPoint = null;
	for (let i = 0; i < MAX_POINTS; i++) {
		points[i] = new KdPoint(
			Rand.random() * width,
			Rand.random() * height,
		)
	}
	root = new KdTree([...points], 0);
	console.log(root.height())
}

function draw() {
	const width = canvas.width;
	const height = canvas.height;
	ctx.clearRect(0, 0, width, height);
	root.draw(ctx, 'black', selectedPoint)


	if (selectedPoint) {
		selectedPoint.draw(ctx, 'blue')
		const result = KdTree.nearestNeighbor(root, selectedPoint);
		result.pos.draw(ctx, 'red')
		ctx.beginPath();
		ctx.arc(...selectedPoint.axes, selectedPoint.distance(result.pos), 0, Math.PI * 2);
		ctx.stroke()
		const bfResult = nearestNeighborBfSearch()
		if (!bfResult.equals(result.pos)) {
			bfResult.draw(ctx, 'orange')
			console.log(bfResult, result.pos)
			clearInterval(autoId)
			autoId = null
		}
	}
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	generatePoints();
	draw();
	window.kdTree = root;
	window.ctx = ctx;
	window.debug = debug;
}

function setPoint(e) {
	const rect = canvas.getBoundingClientRect();
	selectedPoint = new KdPoint(e.clientX - rect.left, e.clientY - rect.top)
	draw();
}

function nearestNeighborBfSearch() {
	let nearestPointBf = null;
	let minDis = Number.POSITIVE_INFINITY;
	for (const point of points) {
		const dis = point.sqrDistance(selectedPoint)
		if (dis < minDis) {
			minDis = dis;
			nearestPointBf = point;
		}
	}
	return nearestPointBf
}

function handleKeys(e) {
	if (e.key == " ") {
		start()
	} else if (e.key == "ArrowDown") {
		delay += 100;
		clearInterval(autoId)
		autoId = null
		start()
	} else if (e.key == "ArrowUp") {
		delay -= 100;
		clearInterval(autoId)
		autoId = null
		start()
	}
}

function start() {
		if (autoId) {
			clearInterval(autoId)
			autoId = null
		}
		else autoId = setInterval(() => {
			const width = canvas.width;
			const height = canvas.height;
			selectedPoint = new KdPoint(
				Rand.random() * width,
				Rand.random() * height,
			)
			draw()
		}, Math.max(delay, 10))
}

function main() {
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('mousedown', setPoint, false);
	window.addEventListener('keydown', handleKeys, false)
}

main()


