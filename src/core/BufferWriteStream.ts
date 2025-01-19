import WriteStream from "./WriteStream.js";

export default class BufferWriteStream extends WriteStream implements NettleWeb.BufferWriteStream {
	#data: (NettleWeb.Buffer | number)[] = [];
	#length: number = 0;

	write(data: number | NettleWeb.Buffer) {
		if (typeof data === "number") {
			this.#data.push(data);
			this.#length++;
		} else {
			this.#data.push(data);
			this.#length += data.byteLength;
		}
	}

	toBuffer(): NettleWeb.Buffer {
		const buffer = new Uint8Array(this.#length);
		let offset: number = 0;

		for (const e of this.#data) {
			if (typeof e !== "number") {
				buffer.set(e, offset);
				offset += e.byteLength;
			} else buffer[offset++] = e;
		}

		return buffer;
	}

	// disabled operations
	get closed(): boolean { return false; }
	flush() { }
	close() { }
}