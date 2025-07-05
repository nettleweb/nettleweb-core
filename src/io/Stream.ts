import Null from "../misc/Null.js";

export default class Stream extends Null implements NettleWeb.Stream {
	#read: boolean;
	#write: boolean;
	#closed: boolean = false;

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
	}

	async close(): Promise<void> {
		this.#closed = true;
	}

	async *generator(chunkSize?: number | nul): AsyncGenerator<NettleWeb.Buffer> {
		const stream: NettleWeb.ReadStream = this as any;
		const buffer = new Uint8Array(chunkSize || 8192);
		let i: number;

		while ((i = await stream._read(buffer)) >= 0)
			yield buffer.subarray(0, i);

		return buffer;
	}
}