import WriteStream from "../io/WriteStream.js";

export default class HashStream extends WriteStream implements NettleWeb.HashStream {
	#h: number[] = [];

	get algorithm(): string {
		return "cyrb128";
	}
	get hashLength(): number {
		return 16;
	}

	constructor() {
		super();
		this.reset();
	}

	_write(buf: NettleWeb.BufferView) {
		const len = buf.length;
		const h = this.#h;

		for (let i = 0; i < len; i++) {
			const k = buf[i];
			h[0] = h[1] ^ Math.imul(h[0] ^ k, 597399067);
			h[1] = h[2] ^ Math.imul(h[1] ^ k, 2869860233);
			h[2] = h[3] ^ Math.imul(h[2] ^ k, 951274213);
			h[3] = h[0] ^ Math.imul(h[3] ^ k, 2716044179);
		}
	}

	hash(): number[] {
		const h = this.#h;

		h[0] = Math.imul(h[2] ^ (h[0] >>> 18), 597399067);
		h[1] = Math.imul(h[3] ^ (h[1] >>> 22), 2869860233);
		h[2] = Math.imul(h[0] ^ (h[2] >>> 17), 951274213);
		h[3] = Math.imul(h[1] ^ (h[3] >>> 19), 2716044179);

		h[0] = ((h[0] ^ h[1] ^ h[2] ^ h[3]) >>> 0);
		h[1] = ((h[1] ^ h[0]) >>> 0);
		h[2] = ((h[2] ^ h[0]) >>> 0);
		h[3] = ((h[3] ^ h[0]) >>> 0);

		const result: number[] = new Array(16);
		for (let i = 0, p = 0; i < 4; i++) {
			const hVal = h[i];
			result[p++] = (hVal >>> 24) & 0xFF;
			result[p++] = (hVal >>> 16) & 0xFF;
			result[p++] = (hVal >>> 8) & 0xFF;
			result[p++] = hVal & 0xFF;
		}

		this.reset();
		return result;
	}

	reset() {
		this.#h = [1779033703, 3144134277, 1013904242, 2773480762];
	}
}