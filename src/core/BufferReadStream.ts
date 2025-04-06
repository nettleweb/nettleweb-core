import SyncReadStream from "./SyncReadStream.js";

export default class BufferReadStream extends SyncReadStream implements NettleWeb.BufferReadStream {
	#index: number;
	#buffer: NettleWeb.Buffer;

	get index(): number {
		return this.#index;
	}
	set index(v: number) {
		this.#index = v || 0;
	}
	get buffer(): NettleWeb.Buffer {
		return this.#buffer;
	}
	set buffer(v: NettleWeb.Buffer) {
		this.#buffer = v;
	}

	constructor(buf: NettleWeb.Buffer, i?: number | nul) {
		super();
		this.#index = i || 0;
		this.#buffer = buf;
	}

	read(): number {
		return this.#buffer[this.#index++];
	}

	readBuf(buf: NettleWeb.Buffer, off?: number | nul, len?: number | nul): number {
		const buffer = this.#buffer.subarray(this.#index, this.#index += (len ||= buf.byteLength));
		buf.set(buffer, off || 0);
		return len;
	}

	readNBytes(n: number): NettleWeb.Buffer {
		return this.#buffer.subarray(this.#index, this.#index += n);
	}

	readAllBytes(): NettleWeb.Buffer {
		return this.#buffer.subarray(this.#index);
	}

	// buffer read stream cannot be closed
	get closed(): boolean { return false; }
	close() { }
}