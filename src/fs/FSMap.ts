import Null from "../misc/Null.js";
import ArrayMap from "../utils/ArrayMap.js";

export default class FSMap extends Null implements NettleWeb.FSMap {
	#map: NettleWeb.MapLike<string, NettleWeb.Buffer> = new ArrayMap();

	get persistent(): boolean {
		return false; // the default implementation stores entries in memory
	}

	async has(key: string): Promise<boolean> {
		return this.#map.has(key);
	}

	async get(key: string): Promise<NettleWeb.Buffer | null> {
		return this.#map.get(key);
	}

	async set(key: string, value: NettleWeb.Buffer): Promise<void> {
		this.#map.set(key, value);
	}

	async clear(): Promise<void> {
		this.#map.clear();
	}

	async delete(key: string): Promise<boolean> {
		return this.#map.delete(key);
	}

	async keys(): Promise<string[]> {
		return this.#map.keys();
	}

	async values(): Promise<NettleWeb.Buffer[]> {
		return this.#map.values();
	}

	async entries(): Promise<[string, NettleWeb.Buffer][]> {
		return this.#map.entries();
	}
}