import ReadStream from "../core/ReadStream.js";

export default class RandomStream extends ReadStream {
	readonly #random: NettleWeb.Random<any>;

	constructor(rand: NettleWeb.Random<any>) {
		super();
		this.#random = rand;
	}

	read(): number {
		return Math.floor(this.#random.rand() * 256) & 0xff;
	}

	readBuf(buf: NettleWeb.Buffer): number {
		this.#random.randbuf(buf);
		return buf.byteLength;
	}

	readNBytes(n: number): NettleWeb.Buffer {
		return this.#random.randbuf(new Uint8Array(new ArrayBuffer(n), 0, n));
	}

	// stream cannot be closed
	get closed(): boolean { return false; }
	close() { }
}