import { imul } from "../misc/intrinsics.js";
import { seedgen32 } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";

export default class Random extends AbstractRandom<number> implements NettleWeb.Random {
	#seed: number;

	get seed(): number {
		return this.#seed;
	}

	constructor(seed?: number | nul) {
		super();
		this.#seed = seed || seedgen32();
	}

	rand(): number {
		let t = (this.#seed += 0x6D2B79F5) >>> 0;
		t = imul(t ^ t >>> 15, t | 1);
		t ^= t + imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}

	setSeed(seed: number) {
		this.#seed = seed;
	}
}
