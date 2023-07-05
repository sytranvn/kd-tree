export default class Node {
	constructor(point, left = null, right = null) {
		this.point = point
		this.left = left;
		this.right = right;
	}
}

export function newNode(point) {
	return new Node(point);
}

// Inserts a new node and returns root of modified tree
// The parameter depth is used to decide axis of comparison
export function insertRec(root, point, depth) {

}

export function insert(root, point) {

}

export function equalPoint(point1, point2) {
	return point1.x === point2.x && point1.y === point2.y;
}

export function searchRec(root, point, depth) {

}

export function search(root, point) {

}

