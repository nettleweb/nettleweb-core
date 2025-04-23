import { seedgen, seedgen128 } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";
export class sfc32 extends AbstractRandom {
    #seed;
    get seed() { return this.#seed; }
    constructor(seed) {
        super();
        if (seed != null) {
            seed = Array.from(seed);
            if (seed.length !== 4)
                throw new Error("Invalid seed length");
        }
        this.#seed = seed || seedgen128();
    }
    rand() {
        let [a, b, c, d] = this.#seed;
        let t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        this.#seed = [a, b, c, d];
        return (t >>> 0) / 4294967296;
    }
    setSeed(seed) {
        if ((seed = Array.from(seed)).length !== 4)
            throw new Error("Invalid seed length");
        this.#seed = seed;
    }
}
export class splitmix32 extends AbstractRandom {
    #seed;
    get seed() { return this.#seed; }
    constructor(seed) {
        super();
        this.#seed = seed || seedgen();
    }
    rand() {
        const a = this.#seed = (this.#seed | 0) + 0x9e3779b9 | 0;
        let t = a ^ a >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
    setSeed(seed) {
        this.#seed = seed;
    }
}
export class mulberry32 extends AbstractRandom {
    #seed;
    get seed() { return this.#seed; }
    constructor(seed) {
        super();
        this.#seed = seed ||= seedgen();
    }
    rand() {
        let t = this.#seed = (this.#seed | 0) + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    setSeed(seed) {
        this.#seed = seed;
    }
}
export class xoshiro128 extends AbstractRandom {
    #seed;
    get seed() { return this.#seed; }
    constructor(seed) {
        super();
        if (seed != null) {
            seed = Array.from(seed);
            if (seed.length !== 4)
                throw new Error("Invalid seed length");
        }
        this.#seed = seed || seedgen128();
    }
    rand() {
        let [a, b, c, d] = this.#seed;
        let t = b << 9, r = b * 5;
        r = (r << 7 | r >>> 25) * 9;
        c ^= a;
        d ^= b;
        b ^= c;
        a ^= d;
        c ^= t;
        d = d << 11 | d >>> 21;
        this.#seed = [a, b, c, d];
        return (r >>> 0) / 4294967296;
    }
    setSeed(seed) {
        if ((seed = Array.from(seed)).length !== 4)
            throw new Error("Invalid seed length");
        this.#seed = seed;
    }
}
