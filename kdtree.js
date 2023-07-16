import BST from "./bst.js";
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
		 * @type {number} dimensions
		 */
		this.d = axes.length;
	}

	/**
	 * @param {KdPoint} p2
	 * @returns {boolean}
	 */
	equals(p2) {
		if (this.d !== p2.d) return false;
		for (let i = 0; i < this.d; i++) {
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
		if (!p2) return Number.POSITIVE_INFINITY;
		return Math.sqrt(this.axes.reduce((sum, axis, index) => {
			return sum + (axis - p2.axes[index]) ** 2
		}, 0));
	}

	/**
	 * Square distance to avoid calculate squareroot
	 * @param {KdPoint} p2
	 * @returns {number}
	 */
	sqrDistance(p2) {
		if (!p2) return Number.POSITIVE_INFINITY;
		return this.axes.reduce((sum, axis, index) => {
			return sum + (axis - p2.axes[index]) ** 2
		}, 0);
	}
	/**
	 * Draw in 2d context
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} color
	 */
	draw(ctx, color, text = null, x = 5) {
		ctx.beginPath();
		ctx.arc(...this.axes, 3.2, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
		if (text) {
			ctx.font = '14pt';
			ctx.fillStyle = 'black';
			ctx.textAlign = 'left';
			ctx.fillText(text, ...this.axes.map(axe => axe + x));
		}
	}
}

/**
 * @typedef {Object} KdTree
 * @property {KdPoint} pos
 * @property {KdTree} left
 * @property {KdTree} right
 */
export default class KdTree extends BST {
	/**
	 * @type {KdPoint}
	 */
	pos;
	/**
	 * @type {KdTree|undefined}
	 */
	left;
	/**
	 * @type {KdTree|undefined}
	 */
	right;
	/**
	 * @type {string}
	 */
	name;
	/**
	* @param {KdPoint[]} points
	* @param {number} depth
	*/
	constructor(points, depth, name = 'root') {
		super()
		const cd = depth % points[0].d;
		points.sort((p1, p2) => p1.axes[cd] - p2.axes[cd]);
		const median = points.length >> 1;
		this.pos = points.splice(median, 1)[0];
		this.name = name;
		if (points.length) {
			this.left = new KdTree(points.splice(0, median), depth + 1, `${this.name}.left`);
		}
		if (points.length) {
			this.right = new KdTree(points, depth + 1, `${this.name}.right`);
		}
	}

	/**
	 * Search for KdTree leaf node that contains targetPoint in area
	 * @param {KdPoint} targetPoint
	 * @param {number} [depth=0]
	 * @returns {KdTree}
	 */
	searchPoint(targetPoint, depth = 0, color = 0xFF000088) {
		let result;
		const cd = depth % targetPoint.d;
		if (targetPoint.axes[cd] < this.pos.axes[cd]) {
			result = this.left?.searchPoint(targetPoint, depth + 1, color + 0x08) || this;
		}
		else result = this.right?.searchPoint(targetPoint, depth + 1, color + 0x08) || this;

		return result;
	}

	/**
	 * @param {KdTree} root 
	 * @param {KdPoint} targetPoint
	 * @param {number} [ nearestDistance=Number.POSITIVE_INFINITY ]
	 * @param {KdTree} [ nearestPoint=null ]
	 * @param {number} [ depth=0 ]
	 * @returns {KdTree}
	 */
	static nearestNeighbor(root, targetPoint, depth = 0, nearestDistance = Number.POSITIVE_INFINITY, trace) {
		const cd = depth % targetPoint.d;
		if (!root) return null;
		if (trace) { trace.push(root); }

		if (!root.left && !root.right) return root;
		let result
		if (targetPoint.distance(root.pos) < nearestDistance) {
			result = root
			nearestDistance = targetPoint.distance(root.pos)
		}
		let t1, t2;
		if (targetPoint.axes[cd] < root.pos.axes[cd] && root.left) {
			t1 = root.left; t2 = root.right
		} else {
			t2 = root.left; t1 = root.right;
		}
		const nnT1 = KdTree.nearestNeighbor(t1, targetPoint, depth + 1, nearestDistance, trace);
		const t1Distance = Math.min(nearestDistance, targetPoint.distance(nnT1?.pos));
		if (t1Distance < nearestDistance) {
			result = nnT1;
			nearestDistance = t1Distance;
		}
		if (Math.abs(targetPoint.axes[cd] - root.pos.axes[cd]) < nearestDistance) {
			const nnT2 = KdTree.nearestNeighbor(t2, targetPoint, depth + 1, nearestDistance, trace)
			if (targetPoint.distance(nnT2?.pos) < nearestDistance)
				return nnT2;
		}
		return result;
	}

	draw(ctx, color, selectedPoint = null) {
		let text = ''
		if (selectedPoint) text = window.debug ? this.name + ' ' + selectedPoint.distance(this.pos).toFixed(2) : null
		this.pos.draw(ctx, color, text, 10, 10);
		this.left?.draw(ctx, color, selectedPoint);
		this.right?.draw(ctx, color, selectedPoint);
	}

}

