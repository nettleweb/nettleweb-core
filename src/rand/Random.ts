import AbstractRandom from "./AbstractRandom.js";
import { mulberry32, sfc32, splitmix32, xoshiro128 } from "./RandomImpl.js";

(globalThis as any).A = AbstractRandom;

export default class Random<S> extends AbstractRandom<S> implements NettleWeb.Random<S> {
	static [Symbol.hasInstance](e: any): boolean {
		return e instanceof AbstractRandom;
	}

	constructor(algorithm?: string | nul, seed?: any) {
		super(seed);
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
}
