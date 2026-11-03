import Null from "../misc/Null.js";
export default class ArrayMap extends Null {
    #entries;
    get size() {
        return this.#entries.length;
    }
    constructor(init) {
        super();
        const entries = [];
        if (init != null) {
            for (const [k, v] of (Symbol.iterator in init ? init : init.entries()))
                entries.push([k, v]);
        }
        this.#entries = entries;
    }
    has(key) {
        for (const [k] of this.#entries) {
            if (key === k)
                return true;
        }
        return false;
    }
    get(key) {
        for (const [k, v] of this.#entries) {
            if (key === k)
                return v;
        }
        return null;
    }
    set(key, value) {
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
    delete(key) {
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
    keys() {
        const entries = this.#entries;
        const length = entries.length;
        const result = new Array(length);
        for (let i = 0; i < length; i++)
            result[i] = entries[i][0];
        return result;
    }
    values() {
        const entries = this.#entries;
        const length = entries.length;
        const result = new Array(length);
        for (let i = 0; i < length; i++)
            result[i] = entries[i][1];
        return result;
    }
    entries() {
        return [...this.#entries];
    }
    [Symbol.iterator]() {
        return this.#entries.values();
    }
}
