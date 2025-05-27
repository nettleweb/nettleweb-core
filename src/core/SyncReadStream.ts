import Charset from "../coder/Charset.js";
import { bufferConcat, decodeUTF8 } from "../misc/misc.js";
import SyncStream from "./SyncStream.js";

export default class SyncReadStream extends SyncStream implements NettleWeb.SyncReadStream {
	constructor() {
		super(true, false);
	}

	read(): number {
		return -1;
	}

	readBuf(buf: NettleWeb.Buffer, off?: number | nul, len?: number | nul): number {
		off ||= 0; len ||= buf.byteLength;

		for (let i = 0; i < len; i++) {
			const b = this.read();
			if (b >= 0)
				buf[off + i] = b;
			else
				return i;
		}

		return len;
	}

	readText(len: number, cs?: string | nul): string {
		const buffer = this.readNBytes(len);

		if ((cs ||= "utf-8") === "utf-8")
			return decodeUTF8(buffer);
		else
			return Charset.forName(cs).decode(buffer);
	}

	readNBytes(len: number): NettleWeb.Buffer {
		const buffer = new Uint8Array(new ArrayBuffer(len), 0, len);
		let offset: number = 0;

		while (len > 0) {
			const i = this.readBuf(buffer, offset, Math.min(8192, len));
			if (i < 0)
				break;

			len -= i;
			offset += i;
		}

		return buffer.subarray(0, offset);
	}

	readAllBytes(): NettleWeb.Buffer {
		const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192)
		const chunks: NettleWeb.Buffer[] = [];

		let i: number = 0;
		let len: number = 0;

		while ((i = this.readBuf(buffer, 0, 8192)) >= 0) {
			len += i;
			chunks.push(buffer.subarray(0, i));
		}

		return bufferConcat(chunks, len);
	}

	async pipe(out: NettleWeb.WriteStream): Promise<number> {
		const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);

		let i: number = 0;
		let len: number = 0;

		while ((i = this.readBuf(buffer, 0, 8192)) >= 0) {
			await out.writeBuf(buffer, 0, i);
			await out.flush();
			len += i;
		}

		return len;
	}

	pipeSync(out: NettleWeb.SyncWriteStream): number {
		const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);

		let i: number = 0;
		let len: number = 0;

		while ((i = this.readBuf(buffer, 0, 8192)) >= 0) {
			out.writeBuf(buffer, 0, i);
			out.flush();
			len += i;
		}

		return len;
	}
}