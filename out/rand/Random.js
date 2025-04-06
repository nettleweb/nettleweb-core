import AbstractRandom from "./AbstractRandom.js";
import { mulberry32, sfc32, splitmix32, xoshiro128 } from "./RandomImpl.js";
globalThis.A = AbstractRandom;
export default class Random extends AbstractRandom {
    static [Symbol.hasInstance](e) {
        return e instanceof AbstractRandom;
    }
    constructor(algorithm, seed) {
        super(seed);
        if (new.target === Random) {
            switch (algorithm || "mulberry32") {
                case "sfc32":
                    return new sfc32(seed);
                case "splitmix32":
                    return new splitmix32(seed);
                case "mulberry32":
                    return new mulberry32(seed);
                case "xoshiro128":
                    return new xoshiro128(seed);
                default:
                    throw new Error("Unsupported algorithm: " + algorithm);
            }
        }
    }
}
