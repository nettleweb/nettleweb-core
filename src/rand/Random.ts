import { STUB_FUNC } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";
import { mulberry32, sfc32, splitmix32, xoshiro128 } from "./RandomImpl.js";

export default class Random<S> extends AbstractRandom<S> implements NettleWeb.Random<S> {
	static [Symbol.hasInstance](w: any): boolean {
		return w instanceof AbstractRandom;
	}

	constructor(algorithm?: string | nul, seed?: any) {
		super();
		if (new.target === Random) {
			switch (algorithm || "mulberry32") {
				case "sfc32":
					return new sfc32(seed) as any;
				case "splitmix32":
					return new splitmix32(seed) as any;
				case "mulberry32":
					return new mulberry32(seed) as any;
				case "xoshiro128":
					return new xoshiro128(seed) as any;
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
