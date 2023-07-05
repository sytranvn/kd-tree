/**
 * @class Point k-d point
 */
export class KdPoint {
	/**
	 * @param {...number} axes axes of point
	 */
	constructor(...axes) {
		/**
		 * @type {number[]}
		 */
		this.axes = axes;

		/**
		 * @type {number}
		 */
		this.k = axes.length;
	}

	/**
	 * @param {KdPoint} p2
	 * @returns {boolean}
	 */
	equals(p2) {
		if (this.k !== p2.k) return false;
		for (let i = 0; i < this.k; i++) {
			if (this.axes[i] !== p2.axes[i])
				return false;
		}
		return true;
	}

	/**
	 * @param {KdPoint} p2
	 * @returns {number}
	 */
	distance(p2) {
		return Math.sqrt(this.axes.reduce((sum, axis, index) => {
			return sum + (axis - p2[index])**2
		}, 0));
	}

}
export default class Node {
	constructor(point, left = null, right = null) {
		/**
		 * @type {KdPoint}
		 */
		this.point = point
		/**
		 * @type {Node}
		 */
		this.left = left;
		/**
		 * @type {Node}
		 */
		this.right = right;
	}

	/**
	 * Inserts a new node and returns root of modified tree
	 * The parameter depth is used to decide axis of comparison
	 * @param {KdPoint} point 
	 * @param {number} [depth=0]
	 * @returns {Node} root node
	 */
	insert(point, depth = 0) {
		const cd = depth % point.k;
		if (point.axes[cd] < this.point.axes[cd]) {
			if (this.left)
				this.left.insert(point, depth + 1);
			else
				this.left = new Node(point);
		} else {
			if (this.right)
				this.right.insert(point, depth + 1);
			else
				this.right = new Node(point);
		}
		return this;
	}

	/**
	 * Search for point inside a tree
	 * @param {KdPoint} point 
	 * @param {number} [depth=0] - depth
	 * @returns {boolean} return true if point is inside the tree
	 */
	search(point, depth = 0) {
		if (!this) return false;
		if (this.point.equals(point)) return true;
		const cd = depth % this.point.k;
		if (point.axes[cd] < this.point.axes[cd]) {
			return this.left?.search(point, depth + 1);
		}
		return this.right?.search(point, depth + 1);
	}

	/**
	 * @param {KdPoint} targetPoint
	 * @param {number} [depth=0]
	 * @returns {Node}
	 */
	nearestNeighborSearch(targetPoint, distance, nearest = null, depth = 0) {
		if (!this) return null;
		const { point: currentPoint, left, right } = this;
		const cd = depth % currentPoint.k;
		// if ()
	}
}
