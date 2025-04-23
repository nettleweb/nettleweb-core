import { incrCounter, initCounter, seedgen256 } from "../misc/misc.js";
import AES from "../utils/AES.js";
import AbstractRandom from "./AbstractRandom.js";

export default class SecureRandom extends AbstractRandom<number[]> implements NettleWeb.SecureRandom {
	#aes: NettleWeb.AES;
	#index: number = 16;
	#buffer: number[] = new Array(16).fill(0);
	#counter: number[];

	get aes(): NettleWeb.AES {
		return this.#aes;
	}
	get seed(): number[] {
		return this.#aes.key;
	}
	get counter(): number[] {
		return this.#counter;
	}

	constructor(seed?: ArrayLike<number> | nul, counter?: NettleWeb.CounterInit | nul) {
		super();
		this.#aes = new AES(seed ||= seedgen256());
		this.#counter = initCounter(counter);
	}

	rand(): number {
		const view = this.randBuf(new Array(4));
		return (((view[0] & 0xff) |
			((view[1] & 0xff) << 8) |
			((view[2] & 0xff) << 16) |
			((view[3] & 0xff) << 24)) >>> 0) / 4294967296;
	}

	randBuf<E extends number[] | NettleWeb.Buffer>(buf: E): E {
		const counter = this.#counter;
		const length = buf.length;
		const aes = this.#aes;

		let buffer = this.#buffer;
		let index = this.#index;
		let off: number = 0;

		while (off < length) {
			const avail = 16 - index;
			if (avail < 1) {
				buffer = aes.encryptCTR(buffer, counter);
				incrCounter(counter);
				index = 0;
				continue;
			}

			const bytes = Math.min(length - off, avail);
			for (let i = 0; i < bytes; i++)
				buf[off++] = buffer[index++];
		}

		this.#buffer = buffer;
		this.#index = index;
		return buf;
	}

	setSeed(seed: number[]) {
		this.#aes = new AES(seed);
	}

	setCounter(counter: NettleWeb.CounterInit) {
		this.#counter = initCounter(counter);
	}
}