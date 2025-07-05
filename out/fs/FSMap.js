import Null from "../misc/Null.js";
import ArrayMap from "../utils/ArrayMap.js";
export default class FSMap extends Null {
    #map = new ArrayMap();
    get persistent() {
        return false; // the default implementation stores entries in memory
    }
    async has(key) {
        return this.#map.has(key);
    }
    async get(key) {
        return this.#map.get(key);
    }
    async set(key, value) {
        this.#map.set(key, value);
    }
    async clear() {
        this.#map.clear();
    }
    async delete(key) {
        return this.#map.delete(key);
    }
    async keys() {
        return this.#map.keys();
    }
    async values() {
        return this.#map.values();
    }
    async entries() {
        return this.#map.entries();
    }
}
