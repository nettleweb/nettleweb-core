import Stream from "./Stream.js";

export default class EmptyStream extends Stream implements NettleWeb.EmptyStream {
	#read: boolean;
	#write: boolean;

	get canRead(): boolean {
		return this.#read;
	}
	get canWrite(): boolean {
		return this.#write;
	}

	constructor(read?: boolean | nul, write?: boolean | nul) {
		super();
		this.#read = read ?? true;
		this.#write = write ?? true;
	}

	_read(buf: NettleWeb.Buffer): Awaitable<number> {
		return this.#read ? -1 : super._read(buf);
	}

	_write(buf: NettleWeb.Buffer): Awaitable<number> {
		return this.#write ? 0 : super._write(buf);
	}
}
