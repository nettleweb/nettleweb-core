import Charset, { UTF_8 } from "../coder/Charset.js";
import SyncStream from "./SyncStream.js";

export default class SyncWriteStream extends SyncStream implements NettleWeb.SyncWriteStream {
	constructor() {
		super(false, true);
	}

	flush() {
	}

	write(data: number) {
	}

	writeBuf(buf: NettleWeb.Buffer, off?: number | nul, len?: number | nul) {
		off ||= 0; len ||= buf.byteLength;
		while (off < len)
			this.write(buf[off]);
	}

	writeText(text: string, cs?: string | nul) {
		const buffer = (((cs ||= "utf-8") === "utf-8") ? UTF_8 : Charset.forName(cs)).encode(text);
		this.writeBuf(buffer, 0, buffer.byteLength);
	}
}