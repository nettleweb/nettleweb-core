import AbstractRandom from "./AbstractRandom.js";
import { mulberry32, sfc32, splitmix32, xoshiro128 } from "./RandomImpl.js";
export default class Random extends AbstractRandom {
    static [Symbol.hasInstance](e) {
        return AbstractRandom[Symbol.hasInstance](e);
    }
    constructor(algorithm, seed) {
        super(seed);
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
                if (new.target === Random)
                    throw new Error("Unsupported algorithm: " + algorithm);
                break;
        }
    }
}
