import Charset from "../coder/Charset.js";
import { bufferConcat, decodeUTF8, encodeUTF8, singleBuffer } from "../misc/misc.js";
import Null from "../misc/Null.js";

function decodeBuffer(buf: NettleWeb.Buffer, cs?: NettleWeb.Charset | string | nul): NettleWeb.Buffer | string {
	if (cs == null)
		return buf;
	else if (cs === "utf-8")
		return decodeUTF8(buf);
	else
		return (typeof cs === "string" ? Charset.forName(cs) : cs).decode(buf);
}

export default class Stream extends Null implements NettleWeb.Stream {
	#closed: boolean = false;

	get closed(): boolean { return this.#closed; }
	get canRead(): boolean { return false; }
	get canWrite(): boolean { return false; }

	_read(buf: NettleWeb.Buffer): Awaitable<number> {
		throw new Error("Stream is not readable.");
	}
	_write(buf: NettleWeb.Buffer): Awaitable<number> {
		throw new Error("Stream is not writable.");
	}
	_flush(): Awaitable<void> {
	}
	_close(): Awaitable<void> {
	}

	async read(buf?: NettleWeb.Buffer | nul, off?: number | nul, len?: number | nul): Promise<number> {
		if (buf == null)
			return (await this._read(singleBuffer)) < 0 ? -1 : singleBuffer[0];

		if (off != null || len != null) {
			off ||= 0; len ||= buf.byteLength;
			buf = buf.subarray(off, off + len);
		}

		return await this._read(buf);
	}

	async readLine(cs?: NettleWeb.Charset | string | nul, sep?: string | NettleWeb.BufferView | nul): Promise<any> {
		const data: number[] = [];
		const sepCh = typeof sep === "string" ? encodeUTF8(sep) : (sep || [10]); // ['\n']
		const sepLen = sepCh.length;

		loop: while (true) {
			for (let i = 0; i < sepLen; i++) {
				if ((await this._read(singleBuffer)) < 0)
					break loop;

				const ch = singleBuffer[0];
				data.push(ch);

				if (ch !== sepCh[i])
					continue loop;
			}

			data.splice(data.length - sepLen, sepLen);
			break;
		}

		return decodeBuffer(Uint8Array.from(data), cs);
	}

	async readNBytes(len: number, cs?: NettleWeb.Charset | string | nul): Promise<any> {
		const buffer = new Uint8Array(len);
		let offset: number = 0;

		while (len > 0) {
			const i = await this._read(buffer.subarray(offset, offset + len));
			if (i < 0)
				break;

			len -= i;
			offset += i;
		}

		return decodeBuffer(buffer.subarray(0, offset), cs);
	}

	async readAllBytes(cs?: NettleWeb.Charset | string | nul): Promise<any> {
		const chunks: NettleWeb.Buffer[] = [];
		let len: number = 0;

		while (true) {
			const buf = new Uint8Array(8192);
			const i = await this._read(buf);

			if (i >= 0) {
				len += i;
				chunks.push(buf.subarray(0, i));
			} else break;
		}

		return decodeBuffer(bufferConcat(chunks, len), cs);
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
				throw new Error("Invalid buffer object");
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

	async pipe(out: NettleWeb.Stream, flush?: boolean | nul, close?: boolean | nul): Promise<number> {
		const buffer = new Uint8Array(8192);

		let i: number = 0;
		let len: number = 0;

		while ((i = await this._read(buffer)) >= 0)
			len += await out._write(buffer.subarray(0, i));

		if (flush ?? true)
			await out._flush();
		if (close ?? true)
			await out._close();

		return len;
	}

	async flush(): Promise<void> {
		await this._flush();
	}

	async close(): Promise<void> {
		await this._close();
		this.#closed = true;
	}

	async *generator(chunkSize?: number | nul): AsyncGenerator<NettleWeb.Buffer> {
		const buffer = new Uint8Array(chunkSize || 8192);
		let i: number;

		while ((i = await this._read(buffer)) >= 0)
			yield buffer.subarray(0, i);

		return buffer;
	}
}
