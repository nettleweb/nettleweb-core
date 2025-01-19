import AbstractRandom from "./AbstractRandom.js";
import { mulberry32, sfc32, splitmix32, xoshiro128 } from "./RandomImpl.js";

export default class Random<S> extends AbstractRandom<S> implements NettleWeb.Random<S> {
	static [Symbol.hasInstance](e: any): boolean {
		return AbstractRandom[Symbol.hasInstance](e);
	}

	constructor(algorithm?: string | nul, seed?: S | nul) {
		super(seed);
		switch (algorithm || "mulberry32") {
			case "sfc32":
				return new sfc32(seed as any) as any;
			case "splitmix32":
				return new splitmix32(seed as any) as any;
			case "mulberry32":
				return new mulberry32(seed as any) as any;
			case "xoshiro128":
				return new xoshiro128(seed as any) as any;
			default:
				if (new.target === Random)
					throw new Error("Unsupported algorithm: " + algorithm);
				break;
		}
	}
}

