import Null from "../misc/Null.js";

export let getEntries: (obj: StringMap) => Record<string, string>;

export default class StringMap extends Null implements NettleWeb.StringMap {
	readonly #entries: Record<string, string>;

	get size(): number {
		return Object.keys(this.#entries).length;
	}

	static {
		getEntries = (obj) => obj.#entries;
	}

	constructor(init?: NettleWeb.StringMapInit | nul) {
		super();
		const entries = Object.create(null);
		if (init != null) {
			if (Symbol.iterator in init) {
				for (const [k, v] of init)
					entries[k] = v;
			} else if (typeof init.entries === "function") {
				for (const [k, v] of init.entries())
					entries[k] = v;
			} else {
				for (const k of Object.keys(init))
					entries[k] = (init as any)[k];
			}
		}
		this.#entries = entries;
	}

	has(key: string): boolean {
		return key in this.#entries;
	}

	get(key: string): string | null {
		return this.#entries[key] ?? null;
	}

	set(key: string, value: string): void {
		this.#entries[key] = value;
	}

	clear(): void {
		const entries = this.#entries;
		for (const k of Object.keys(entries))
			delete entries[k];
	}

	delete(key: string): boolean {
		const entries = this.#entries;
		if (key in entries) {
			delete entries[key];
			return true;
		}
		return false;
	}

	keys(): string[] {
		return Object.keys(this.#entries);
	}

	values(): string[] {
		return Object.values(this.#entries);
	}

	entries(): [string, string][] {
		return Object.entries(this.#entries);
	}

	[Symbol.iterator](): IterableIterator<[string, string]> {
		return Object.entries(this.#entries).values();
	}
}