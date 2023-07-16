export default class BST {
	height() {
		return Math.max(this.left?.height() || 0, this.right?.height() || 0) + 1;
	}
}
