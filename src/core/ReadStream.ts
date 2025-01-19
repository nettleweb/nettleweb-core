import Stream from "./Stream.js";

export default class ReadStream extends Stream implements NettleWeb.ReadStream {
	constructor() {
		super(true, false);
	}

	read(): number {
		return -1;
	}

	readBuf(buf: NettleWeb.Buffer): number {
		const length = buf.byteLength;
		for (let i = 0; i < length; i++) {
			const b = this.read();
			if (b >= 0)
				buf[i] = b;
			else
				return i;
		}
		return length;
	}

	readNBytes(n: number): NettleWeb.Buffer {
		const buffer = new Uint8Array(n);
		const length = this.readBuf(buffer);

		if (length < n)
			return buffer.slice(0, length);
		else
			return buffer;
	}
}