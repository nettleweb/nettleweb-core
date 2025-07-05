import Null from "../misc/Null.js";

export default class ArrayMap<K, V> extends Null implements NettleWeb.ArrayMap<K, V> {
	readonly #entries: [K, V][];

	get size(): number {
		return this.#entries.length;
	}

	constructor(init?: NettleWeb.MapInit<K, V> | nul) {
		super();
		const entries: [K, V][] = [];
		if (init != null) {
			for (const [k, v] of (Symbol.iterator in init ? init : init.entries()))
				entries.push([k, v]);
		}
		this.#entries = entries;
	}

	has(key: K): boolean {
		for (const [k] of this.#entries) {
			if (key === k)
				return true;
		}
		return false;
	}

	get(key: K): V | null {
		for (const [k, v] of this.#entries) {
			if (key === k)
				return v;
		}
		return null;
	}

	set(key: K, value: V) {
		const entries = this.#entries;
		for (const e of entries) {
			if (e[0] === key) {
				e[1] = value;
				return;
			}
		}
		entries.push([key, value]);
	}

	clear() {
		this.#entries.length = 0;
	}

	delete(key: K): boolean {
		const entries = this.#entries;
		const length = entries.length;

		for (let i = 0; i < length; i++) {
			if (entries[i][0] === key) {
				entries.splice(i, 1);
				return true;
			}
		}

		return false;
	}

	keys(): K[] {
		return this.#entries.map((e) => e[0]);
	}

	values(): V[] {
		return this.#entries.map((e) => e[1]);
	}

	entries(): [K, V][] {
		return [...this.#entries];
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.#entries.values();
	}
}