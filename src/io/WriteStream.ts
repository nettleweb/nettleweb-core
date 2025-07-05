import Charset from "../coder/Charset.js";
import { encodeUTF8, singleBuffer } from "../misc/misc.js";
import Stream from "./Stream.js";

export default class WriteStream extends Stream implements NettleWeb.WriteStream {
	constructor() {
		super(false, true);
	}

	_write(buf: NettleWeb.Buffer): Awaitable<void> {
		// no action by default
	}

	async write(buf: NettleWeb.Buffer | string | number, arg1?: NettleWeb.Charset | string | number | nul, len?: number | nul): Promise<void> {
		switch (typeof buf) {
			case "number":
				singleBuffer[0] = buf;
				await this._write(singleBuffer);
				break;
			case "string":
				switch (typeof (arg1 ||= "utf-8")) {
					case "string":
						buf = arg1 === "utf-8" ? encodeUTF8(buf) : Charset.forName(arg1).encode(buf);
						break;
					case "object":
						buf = arg1.encode(buf);
						break;
					default:
						throw new Error("Invalid arguments");
				}
				await this._write(buf);
				break;
			case "object":
				if (arg1 != null || len != null) {
					if (typeof (arg1 ||= 0) !== "number")
						throw new Error("Invalid buffer offset");
					if (typeof (len ||= buf.byteLength) !== "number")
						throw new Error("Invalid buffer length");

					buf = buf.subarray(arg1, arg1 + len);
				}
				await this._write(buf);
				break;
			default:
				throw new Error("Invalid data");
		}

	}

	async writeln(buf: NettleWeb.Buffer | string, arg1?: NettleWeb.Charset | string | number | nul, arg2?: string | number | nul, lineEnd?: string | nul): Promise<void> {
		if (typeof buf === "string") {
			buf += arg2 || "\n"; // append line ending

			switch (typeof (arg1 ||= "utf-8")) {
				case "string":
					buf = arg1 === "utf-8" ? encodeUTF8(buf) : Charset.forName(arg1).encode(buf);
					break;
				case "object":
					buf = arg1.encode(buf);
					break;
				default:
					throw new Error("Invalid arguments");
			}

			await this._write(buf);
		} else {
			if (arg1 != null || arg2 != null) {
				if (typeof (arg1 ||= 0) !== "number")
					throw new Error("Invalid buffer offset");
				if (typeof (arg2 ||= buf.byteLength) !== "number")
					throw new Error("Invalid buffer length");

				buf = buf.subarray(arg1, arg1 + arg2);
			}
			await this._write(buf);
			await this._write(encodeUTF8(lineEnd || "\n"));
		}
	}

	async flush(): Promise<void> {
	}
}