import Charset, { UTF_8 } from "../coder/Charset.js";
import Stream from "./Stream.js";

export default class WriteStream extends Stream implements NettleWeb.WriteStream {
	constructor() {
		super(false, false, true);
	}

	async flush() {
	}

	async write(data: number) {
	}

	async writeBuf(buf: NettleWeb.Buffer, off?: number | nul, len?: number | nul) {
		off ||= 0; len ||= buf.byteLength;
		while (off < len)
			await this.write(buf[off]);
	}

	async writeText(text: string, cs?: string | nul) {
		const buffer = (((cs ||= "utf-8") === "utf-8") ? UTF_8 : Charset.forName(cs)).encode(text);
		await this.writeBuf(buffer, 0, buffer.byteLength);
	}
}