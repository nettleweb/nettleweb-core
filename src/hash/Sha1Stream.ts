import BlockHashStream from "./BlockHashStream.js";

export default class Sha1Stream extends BlockHashStream implements NettleWeb.Sha1Stream {
	get algorithm(): string {
		return "sha1";
	}
	get hashLength(): number {
		return 20;
	}

	readonly #W: Int32Array = new Int32Array(80);
	readonly #h: Int32Array = new Int32Array(5);

	constructor() {
		super(64);
		this.reset();
	}

	reset(): this {
		const h = this.#h;
		h[0] = 0x67452301;
		h[1] = 0xefcdab89;
		h[2] = 0x98badcfe;
		h[3] = 0x10325476;
		h[4] = 0xc3d2e1f0;
		return super.reset();
	}

	_processBlock(buf: NettleWeb.BufferView, off: number) {
		const h = this.#h;
		const W = this.#W;

		for (let i = 0; i < 16; i++) {
			const p = off + (i << 2);
			W[i] = (buf[p] << 24) | (buf[p + 1] << 16) | (buf[p + 2] << 8) | buf[p + 3];
		}
		for (let i = 16; i < 80; i++) {
			const t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
			W[i] = (t << 1) | (t >>> 31);
		}

		let [a, b, c, d, e] = h;

		for (let i = 0; i < 80; i++) {
			let f = 0;
			let k = 0;

			if (i < 20) {
				f = (b & c) | (~b & d);
				k = 0x5a827999;
			} else if (i < 40) {
				f = b ^ c ^ d;
				k = 0x6ed9eba1;
			} else if (i < 60) {
				f = (b & c) | (b & d) | (c & d);
				k = 0x8f1bbcdc;
			} else {
				f = b ^ c ^ d;
				k = 0xca62c1d6;
			}

			const j = (((a << 5) | (a >>> 27)) + f + e + k + W[i]) | 0;
			e = d;
			d = c;
			c = ((b << 30) | (b >>> 2)) | 0;
			b = a;
			a = j;
		}

		h[0] += a; h[1] += b; h[2] += c;
		h[3] += d; h[4] += e;
	}

	_getDigest(): number[] {
		const out = new Array<number>(20);
		const h = this.#h;

		for (let i = 0; i < 5; i++) {
			const p = i << 2;
			out[p] = (h[i] >>> 24) & 0xff;
			out[p + 1] = (h[i] >>> 16) & 0xff;
			out[p + 2] = (h[i] >>> 8) & 0xff;
			out[p + 3] = h[i] & 0xff;
		}

		return out;
	}
}
