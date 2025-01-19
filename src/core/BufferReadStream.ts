import ReadStream from "./ReadStream.js";

export default class BufferReadStream extends ReadStream implements NettleWeb.BufferReadStream {
	#index: number;
	#buffer: NettleWeb.Buffer;

	constructor(buf: NettleWeb.Buffer, i?: number | nul) {
		super();
		this.#index = i || 0;
		this.#buffer = buf;
	}

	read(): number {
		return this.#buffer[this.#index++];
	}

	readBuf(buf: NettleWeb.Buffer): number {
		const buffer = this.#buffer.subarray(this.#index, this.#index += buf.byteLength);
		buf.set(buffer, 0);
		return buffer.byteLength;
	}

	readNBytes(n: number): NettleWeb.Buffer {
		return this.#buffer.subarray(this.#index, this.#index += n);
	}

	setIndex(i: number) {
		this.#index = i;
	}

	setBuffer(buf: NettleWeb.Buffer) {
		this.#buffer = buf;
	}

	// buffer read stream cannot be closed
	get closed(): boolean { return false; }
	close() { }
}