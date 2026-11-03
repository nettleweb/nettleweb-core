import { imul } from "../misc/intrinsics.js";
import { seedgen32 } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";
export default class Random extends AbstractRandom {
    #seed;
    get seed() {
        return this.#seed;
    }
    constructor(seed) {
        super();
        this.#seed = seed || seedgen32();
    }
    rand() {
        let t = this.#seed = (this.#seed | 0) + 0x6D2B79F5;
        t = imul(t ^ t >>> 15, t | 1);
        t ^= t + imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    setSeed(seed) {
        this.#seed = seed;
    }
}
