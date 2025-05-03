import Null from "../misc/Null.js";

export default class Stream extends Null implements NettleWeb.Stream {
	#sync: boolean;
	#read: boolean;
	#write: boolean;
	#closed: boolean = false;

	get sync(): boolean {
		return this.#sync;
	}
	get closed(): boolean {
		return this.#closed;
	}
	get canRead(): boolean {
		return this.#read;
	}
	get canWrite(): boolean {
		return this.#write;
	}

	constructor(sync?: boolean | nul, read?: boolean | nul, write?: boolean | nul) {
		super();
		this.#sync = sync ?? false;
		this.#read = read ?? false;
		this.#write = write ?? false;
	}

	close(): Awaitable<void> {
		this.#closed = true;
	}
}