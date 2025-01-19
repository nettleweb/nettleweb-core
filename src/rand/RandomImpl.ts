import { seedgen } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";

export class sfc32 extends AbstractRandom<number[]> {
	#a: number; #b: number;
	#c: number; #d: number;

	constructor(seed?: number[] | nul) {
		super(seed ||= [seedgen(), seedgen(), seedgen(), seedgen()]);
		if (!Array.isArray(seed) || seed.length !== 4)
			throw new Error("Invalid seed value");

		this.#a = seed[0]; this.#b = seed[1];
		this.#c = seed[2]; this.#d = seed[3];
	}

	rand(): number {
		let a = this.#a |= 0;
		let b = this.#b |= 0;
		let c = this.#c |= 0;
		let d = this.#d |= 0;

		let t = (a + b | 0) + d | 0;
		d = d + 1 | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		c = c + t | 0;

		this.#a = a; this.#b = b;
		this.#c = c; this.#d = d;
		return (t >>> 0) / 4294967296;
	}

	setSeed(seed: number[]) {
		if (!Array.isArray(seed) || seed.length !== 4)
			throw new Error("Invalid seed value");

		this.#a = seed[0]; this.#b = seed[1];
		this.#c = seed[2]; this.#d = seed[3];
		super.setSeed(seed);
	}
}

export class splitmix32 extends AbstractRandom<number> {
	#x: number;

	constructor(seed?: number | nul) {
		super(seed ||= seedgen());
		this.#x = seed;
	}

	rand(): number {
		const a = this.#x = (this.#x | 0) + 0x9e3779b9 | 0;
		let t = a ^ a >>> 16;
		t = Math.imul(t, 0x21f0aaad);
		t = t ^ t >>> 15;
		t = Math.imul(t, 0x735a2d97);
		return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
	}

	setSeed(seed: number) {
		this.#x = seed;
		super.setSeed(seed);
	}
}

export class mulberry32 extends AbstractRandom<number> {
	#x: number;

	constructor(seed?: number | nul) {
		super(seed ||= seedgen());
		this.#x = seed;
	}

	rand(): number {
		let t = this.#x = (this.#x | 0) + 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}

	setSeed(seed: number) {
		this.#x = seed;
		super.setSeed(seed);
	}
}

export class xoshiro128 extends AbstractRandom<number[]> {
	#a: number; #b: number;
	#c: number; #d: number;

	constructor(seed?: number[] | nul) {
		super(seed ||= [seedgen(), seedgen(), seedgen(), seedgen()]);
		if (!Array.isArray(seed) || seed.length !== 4)
			throw new Error("Invalid seed value");

		this.#a = seed[0]; this.#b = seed[1];
		this.#c = seed[2]; this.#d = seed[3];
	}

	rand(): number {
		let a = this.#a |= 0;
		let b = this.#b |= 0;
		let c = this.#c |= 0;
		let d = this.#d |= 0;

		let t = b << 9, r = b * 5;
		r = (r << 7 | r >>> 25) * 9;
		c ^= a; d ^= b; b ^= c; a ^= d;
		c ^= t; d = d << 11 | d >>> 21;

		this.#a = a; this.#b = b;
		this.#c = c; this.#d = d;
		return (r >>> 0) / 4294967296;
	}

	setSeed(seed: number[]) {
		if (!Array.isArray(seed) || seed.length !== 4)
			throw new Error("Invalid seed value");

		this.#a = seed[0]; this.#b = seed[1];
		this.#c = seed[2]; this.#d = seed[3];
		super.setSeed(seed);
	}
}
