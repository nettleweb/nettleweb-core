import Null from "../misc/Null.js";

export default class Stream extends Null implements NettleWeb.Stream {
	#read: boolean;
	#write: boolean;
	#closed: boolean;

	get closed(): boolean {
		return this.#closed;
	}
	get canRead(): boolean {
		return this.#read;
	}
	get canWrite(): boolean {
		return this.#write;
	}

	constructor(read?: boolean | nul, write?: boolean | nul) {
		super();
		this.#read = read ?? false;
		this.#write = write ?? false;
		this.#closed = false;
	}

	close() {
		this.#closed = true;
	}
}