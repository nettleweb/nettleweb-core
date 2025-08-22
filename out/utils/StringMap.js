import Null from "../misc/Null.js";
export let getEntries;
export default class StringMap extends Null {
    #entries;
    get size() {
        return Object.keys(this.#entries).length;
    }
    static {
        getEntries = (obj) => obj.#entries;
    }
    constructor(init) {
        super();
        const entries = Object.create(null);
        if (init != null) {
            if (Symbol.iterator in init) {
                for (const [k, v] of init)
                    entries[k] = v;
            }
            else if (typeof init.entries === "function") {
                for (const [k, v] of init.entries())
                    entries[k] = v;
            }
            else {
                for (const k of Object.keys(init))
                    entries[k] = init[k];
            }
        }
        this.#entries = entries;
    }
    has(key) {
        return key in this.#entries;
    }
    get(key) {
        return this.#entries[key] ?? null;
    }
    set(key, value) {
        this.#entries[key] = value;
    }
    clear() {
        const entries = this.#entries;
        for (const k of Object.keys(entries))
            delete entries[k];
    }
    delete(key) {
        const entries = this.#entries;
        if (key in entries) {
            delete entries[key];
            return true;
        }
        return false;
    }
    keys() {
        return Object.keys(this.#entries);
    }
    values() {
        return Object.values(this.#entries);
    }
    entries() {
        return Object.entries(this.#entries);
    }
    [Symbol.iterator]() {
        return Object.entries(this.#entries).values();
    }
}
