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
		ctx.arc(...this.axes, 5, 0, 2 * Math.PI);
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
export default class KdTree {
	/**
	* @param {KdPoint[]} points
	* @param {number} depth
	*/
	constructor(points, depth, name = 'root') {
		const cd = depth % points[0].d;
		points.sort((p1, p2) => p1.axes[cd] - p2.axes[cd]);
		const median = points.length >> 1;
		/**
		 * @type {KdPoint}
		 */
		this.pos = points.splice(median, 1)[0];
		/**
		 * @type {string}
		 */
		this.name = name;
		if (points.length) {
			/**
			 * @type {KdTree|undefined}
			 */
			this.left = new KdTree(points.splice(0, median), depth + 1, `${this.name}.left`);
		}
		if (points.length) {
			/**
			 * @type {KdTree|undefined}
			 */
			this.right = new KdTree(points, depth + 1, `${this.name}.right-${depth + 1}`);
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
		// this.pos.draw(window.ctx, `#${color.toString(16)}`);
		if (this.pos.equals(targetPoint)) {
			result = this;
		}
		else if (targetPoint.axes[cd] < this.pos.axes[cd]) {
			result = this.left?.searchPoint(targetPoint, depth + 1, color + 0x08) || this;
		}
		else result = this.right?.searchPoint(targetPoint, depth + 1, color + 0x08) || this;

		return result;
	}

	/**
	 * @param {KdPoint} targetPoint
	 * @param {number} [ nearestDistance=Number.POSITIVE_INFINITY ]
	 * @param {KdTree} [ nearestPoint=null ]
	 * @param {number} [ depth=0 ]
	 * @returns {KdTree}
	 */
	nearestNeighbor(targetPoint, depth = 0, nearestDistance = Number.POSITIVE_INFINITY, nearestPoint = null) {
		const cd = depth % targetPoint.d;
		// this.pos.draw(window.ctx, 'green', depth.toString());
		if (!nearestPoint) {
			if (this.pos.equals(targetPoint)) {
				nearestPoint = this;
				nearestDistance = 0
			}
			else if (targetPoint.axes[cd] < this.pos.axes[cd]) {
				nearestPoint = this.left?.nearestNeighbor(targetPoint, depth + 1) || this;
				nearestDistance = targetPoint.sqrDistance(nearestPoint.pos);
			}
			else {
				nearestPoint = this.right?.nearestNeighbor(targetPoint, depth + 1) || this;
				nearestDistance = targetPoint.sqrDistance(nearestPoint.pos);
			}
		}
		if (targetPoint.sqrDistance(this.pos) < nearestDistance) {
			nearestPoint = this;
			nearestDistance = targetPoint.sqrDistance(nearestPoint.pos);
		}

		if (this.left && (targetPoint.axes[( cd+1 ) % targetPoint.d] - this.left.pos.axes[( cd+1 ) % targetPoint.d])**2 < nearestDistance) {
			nearestPoint = this.left.nearestNeighbor(targetPoint, depth + 1, nearestDistance, nearestPoint)
			nearestDistance = targetPoint.sqrDistance(nearestPoint.pos);
		}

		if (this.right && (targetPoint.axes[( cd+1 ) % targetPoint.d] - this.right.pos.axes[( cd+1 ) % targetPoint.d])**2 < nearestDistance) {
			nearestPoint = this.right.nearestNeighbor(targetPoint, depth + 1, nearestDistance, nearestPoint)
			nearestDistance = targetPoint.sqrDistance(nearestPoint.pos);
		}
		
		
		// ctx.beginPath();
		// ctx.arc(...this.pos.axes, 7, 0, 2 * Math.PI);
		// ctx.strokeStyle = '#ff0000'	
		// ctx.stroke();
		return nearestPoint;
	}

	draw(ctx, color, selectedPoint = null) {
		let text = ''
		if (selectedPoint) text = selectedPoint.distance(this.pos).toFixed(2)
		this.pos.draw(ctx, color, null, 10, 10);
		this.left?.draw(ctx, color, selectedPoint);
		this.right?.draw(ctx, color, selectedPoint);
	}
}

window.KdTree = KdTree;
window.KdPoint = KdPoint;
