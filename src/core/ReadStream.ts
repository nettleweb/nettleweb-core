import Charset from "../coder/Charset.js";
import { bufferConcat, decodeUTF8 } from "../misc/misc.js";
import Stream from "./Stream.js";

export default class ReadStream extends Stream implements NettleWeb.ReadStream {
	constructor() {
		super(false, true, false);
	}

	async read(): Promise<number> {
		return -1;
	}

	async readBuf(buf: NettleWeb.Buffer, off?: number | nul, len?: number | nul): Promise<number> {
		off ||= 0; len ||= buf.byteLength;

		for (let i = 0; i < len; i++) {
			const b = await this.read();
			if (b >= 0)
				buf[off + i] = b;
			else
				return i;
		}

		return len;
	}

	async readText(len: number, cs?: string | nul): Promise<string> {
		const buffer = await this.readNBytes(len);

		if ((cs ||= "utf-8") === "utf-8")
			return decodeUTF8(buffer);
		else
			return Charset.forName(cs).decode(buffer);
	}

	async readNBytes(len: number): Promise<NettleWeb.Buffer> {
		const buffer = new Uint8Array(new ArrayBuffer(len), 0, len);
		let offset: number = 0;

		while (len > 0) {
			const i = await this.readBuf(buffer, offset, Math.min(8192, len));
			if (i < 0)
				break;

			len -= i;
			offset += i;
		}

		return buffer.subarray(0, offset);
	}

	async readAllBytes(): Promise<NettleWeb.Buffer> {
		const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192)
		const chunks: NettleWeb.Buffer[] = [];

		let i: number = 0;
		let len: number = 0;

		while ((i = await this.readBuf(buffer, 0, 8192)) >= 0) {
			len += i;
			chunks.push(buffer.subarray(0, i));
		}

		return bufferConcat(chunks, len);
	}

	async pipe(out: NettleWeb.WriteStream): Promise<number> {
		const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);

		let i: number = 0;
		let len: number = 0;

		while ((i = await this.readBuf(buffer, 0, 8192)) >= 0) {
			await out.writeBuf(buffer, 0, i);
			await out.flush();
			len += i;
		}

		return len;
	}
}