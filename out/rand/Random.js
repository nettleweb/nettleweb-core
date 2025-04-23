import { STUB_FUNC } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";
import { mulberry32, sfc32, splitmix32, xoshiro128 } from "./RandomImpl.js";
export default class Random extends AbstractRandom {
    static [Symbol.hasInstance](w) {
        return w instanceof AbstractRandom;
    }
    constructor(algorithm, seed) {
        super();
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
    // stub implementation
    seed = null;
    rand() { return STUB_FUNC(); }
    setSeed() { STUB_FUNC(); }
}
