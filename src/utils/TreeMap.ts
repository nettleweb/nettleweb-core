import { DEFAULT_CMP } from "../misc/misc.js";
import Null from "../misc/Null.js";

interface Node<K, V> {
	key: K;
	value: V;
	left?: Node<K, V> | nul;
	right?: Node<K, V> | nul;
}

export default class TreeMap<K, V> extends Null implements NettleWeb.TreeMap<K, V> {
	#root: Node<K, V> | nul;
	#size: number = 0;
	#cmpFn: Comparator<K>;

	get size(): number {
		return this.#size;
	}

	constructor(init?: NettleWeb.MapInit<K, V> | nul, cmpFn?: Comparator<K> | nul) {
		super();
		this.#cmpFn = (cmpFn ||= DEFAULT_CMP);

		if (init != null) {
			const entries = Array.from(Symbol.iterator in init ? init : init.entries()).sort(([a], [b]) => cmpFn(a, b));
			const length = entries.length;

			if (length > 0) {
				// [parent_node, start_index, end_index, (true=left, false=right)]
				const stack: [Node<K, V>, number, number, boolean][] = [];

				// Create the root node from the middle of the entire array
				const mid = Math.floor((length - 1) / 2);
				const root: Node<K, V> = {
					key: entries[mid][0],
					value: entries[mid][1]
				};

				// Push the left and right sub-problems for the root onto the stack
				// The parent for these initial pushes is the root itself
				if (0 <= mid - 1)
					stack.push([root, 0, mid - 1, true]);
				if (mid + 1 <= length - 1)
					stack.push([root, mid + 1, length - 1, false]);

				// Process the stack until it's empty
				while (stack.length > 0) {
					const [parentNode, start, end, isLeft] = stack.pop()!;

					// If the segment is valid, create a new node from its middle element
					if (start <= end) {
						const subMid = Math.floor((start + end) / 2);
						const newNode: Node<K, V> = {
							key: entries[subMid][0],
							value: entries[subMid][1]
						};

						// Link the new node to its parent
						if (isLeft)
							parentNode.left = newNode;
						else
							parentNode.right = newNode;

						// Push the left and right sub-problems for the new node onto the stack
						if (start <= subMid - 1)
							stack.push([newNode, start, subMid - 1, true]);
						if (subMid + 1 <= end)
							stack.push([newNode, subMid + 1, end, false]);
					}
				}

				this.#root = root;
				this.#size = length;
			}
		}
	}

	set(key: K, value: V) {
		const newNode: Node<K, V> = { key, value };
		const cmpFn = this.#cmpFn;

		let curNode = this.#root;
		if (curNode == null) {
			this.#root = newNode;
			this.#size++;
			return;
		}

		while (true) {
			const cmp = cmpFn(key, curNode.key);
			if (cmp === 0) { // Key already exists, update value
				curNode.value = value;
				return;
			} else if (cmp < 0) { // Go left
				const left: Node<K, V> | nul = curNode.left;
				if (left == null) {
					curNode.left = newNode;
					this.#size++;
					return;
				}
				curNode = left;
			} else { // Go right
				const right: Node<K, V> | nul = curNode.right;
				if (right == null) {
					curNode.right = newNode;
					this.#size++;
					return;
				}
				curNode = right;
			}
		}
	}

	get(key: K): V | null {
		const cmpFn = this.#cmpFn;
		let curNode = this.#root;

		while (curNode != null) {
			const cmp = cmpFn(key, curNode.key);
			if (cmp === 0)
				return curNode.value;
			else if (cmp < 0)
				curNode = curNode.left;
			else
				curNode = curNode.right;
		}

		return null;
	}

	has(key: K): boolean {
		const cmpFn = this.#cmpFn;
		let curNode = this.#root;

		while (curNode != null) {
			const cmp = cmpFn(key, curNode.key);
			if (cmp === 0)
				return true;
			else if (cmp < 0)
				curNode = curNode.left;
			else
				curNode = curNode.right;
		}

		return false;
	}

	delete(key: K): boolean {
		const cmpFn = this.#cmpFn;
		let curNode = this.#root;
		let parent: any = null;

		// Find the node to delete and its parent
		while (curNode != null) {
			const cmp = cmpFn(key, curNode.key);
			if (cmp === 0) {
				break; // Found the node
			}
			parent = curNode;

			if (cmp < 0)
				curNode = curNode.left;
			else
				curNode = curNode.right;
		}

		if (curNode == null) // Key not found
			return false;

		this.#size--;
		const { left, right } = curNode;

		if (left == null && right == null) { // Node has no children (leaf node)
			if (curNode === this.#root) {
				this.#root = null;
			} else if (parent.left === curNode) {
				parent.left = null;
			} else {
				parent.right = null;
			}
		} else if (left == null) { // Only right child
			if (curNode === this.#root) {
				this.#root = right;
			} else if (parent.left === curNode) {
				parent.left = right;
			} else {
				parent.right = right;
			}
		} else if (right == null) { // Only left child
			if (curNode === this.#root) {
				this.#root = left;
			} else if (parent.left === curNode) {
				parent.left = left;
			} else {
				parent.right = left;
			}
		} else { // Node has two children
			// Find the inorder successor (smallest node in the right subtree)
			let successorParent = curNode;
			let successor = right;

			while (successor.left !== null) {
				successorParent = successor;
				successor = successor.left!; // unchecked
			}

			// Copy successor's data to the node to be deleted
			curNode.key = successor.key;
			curNode.value = successor.value;

			// Delete the successor (which now has at most one child)
			if (successorParent.left === successor) {
				successorParent.left = successor.right;
			} else {
				successorParent.right = successor.right;
			}
		}

		return true;
	}

	clear() {
		this.#root = null;
		this.#size = 0;
	}

	keys(): K[] {
		const stack: Node<K, V>[] = [];
		const keys: K[] = [];
		let curNode = this.#root;

		while (curNode != null || stack.length > 0) {
			while (curNode != null) {
				stack.push(curNode);
				curNode = curNode.left;
			}

			curNode = stack.pop()!;
			keys.push(curNode.key);
			curNode = curNode.right;
		}

		return keys;
	}

	values(): V[] {
		const stack: Node<K, V>[] = [];
		const values: V[] = [];
		let curNode = this.#root;

		while (curNode != null || stack.length > 0) {
			while (curNode != null) {
				stack.push(curNode);
				curNode = curNode.left;
			}

			curNode = stack.pop()!;
			values.push(curNode.value);
			curNode = curNode.right;
		}

		return values;
	}

	entries(): [K, V][] {
		const stack: Node<K, V>[] = [];
		const entries: [K, V][] = [];
		let curNode = this.#root;

		while (curNode != null || stack.length > 0) {
			while (curNode != null) {
				stack.push(curNode);
				curNode = curNode.left;
			}

			curNode = stack.pop()!;
			entries.push([
				curNode.key,
				curNode.value
			]);
			curNode = curNode.right;
		}

		return entries;
	}

	*[Symbol.iterator](): IterableIterator<[K, V]> {
		const stack: Node<K, V>[] = [];
		let curNode = this.#root;

		while (curNode != null || stack.length > 0) {
			while (curNode != null) {
				stack.push(curNode);
				curNode = curNode.left;
			}

			curNode = stack.pop()!;
			yield [
				curNode.key,
				curNode.value
			];
			curNode = curNode.right;
		}
	}
}
