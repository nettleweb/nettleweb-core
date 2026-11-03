import Null from "../misc/Null.js";

export default abstract class HmacStream extends Null implements NettleWeb.HashStream {
	#base: NettleWeb.HashStream;
	#ipad: Uint8Array;
	#opad: Uint8Array;

	constructor(key: NettleWeb.BufferView, base: NettleWeb.HashStream, blockSize: number) {
		super();
		const ipad = new Uint8Array(blockSize).fill(0x36);
		const opad = new Uint8Array(blockSize).fill(0x5c);

		let xor_len = key.length;
		if (xor_len > blockSize) {
			const hash = base.update(key).hash();
			xor_len = hash.length;
			key = hash;
		}

		for (let i = 0; i < xor_len; i++) {
			ipad[i] ^= key[i];
			opad[i] ^= key[i];
		}

		this.#ipad = ipad;
		this.#opad = opad;
		this.#base = base.update(ipad);
	}

	hash(): number[] {
		const base = this.#base;
		const hash = base.hash();

		base.update(this.#opad);
		base.update(hash);
		return base.hash();
	}

	reset(): this {
		const base = this.#base;
		base.reset();
		base.update(this.#ipad);
		return this;
	}

	update(buf: NettleWeb.BufferView): this {
		this.#base.update(buf);
		return this;
	}

	abstract get algorithm(): string;
	abstract get hashLength(): number;
}
