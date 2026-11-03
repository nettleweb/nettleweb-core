import { Array, defineProperty, Error, freeze, fromCharCode, fromCodePoint, Uint8Array } from "../misc/intrinsics.js";
import Null from "../misc/Null.js";

export function encodeUTF8(data: string): NettleWeb.Buffer {
	const len = data.length;
	const buf = new Uint8Array(len * 3);
	let off = 0;

	for (let i = 0; i < len; i++) {
		let c = data.charCodeAt(i);
		if (c < 0x80) {
			buf[off++] = c;
		} else if (c < 0x800) {
			buf[off++] = 0xc0 | (c >> 6);
			buf[off++] = 0x80 | (c & 0x3f);
		} else if (c < 0xd800 || c > 0xdfff) {
			buf[off++] = 0xe0 | (c >> 12);
			buf[off++] = 0x80 | ((c >> 6) & 0x3f);
			buf[off++] = 0x80 | (c & 0x3f);
		} else { // Surrogate pair (4 bytes)
			i++;
			c = 0x10000 + (((c & 0x3ff) << 10) | (data.charCodeAt(i) & 0x3ff));
			buf[off++] = 0xf0 | (c >> 18);
			buf[off++] = 0x80 | ((c >> 12) & 0x3f);
			buf[off++] = 0x80 | ((c >> 6) & 0x3f);
			buf[off++] = 0x80 | (c & 0x3f);
		}
	}

	return buf.subarray(0, off);
}

export function decodeUTF8(data: NettleWeb.BufferView): string {
	const len = data.length;
	const out = new Array(len);
	let off = 0;
	let i = 0;

	while (i < len) {
		const b1 = data[i++];
		if ((b1 & 0x80) === 0)
			out[off++] = fromCharCode(b1);
		else if ((b1 & 0xe0) === 0xc0)
			out[off++] = fromCharCode(((b1 & 0x1f) << 6) | (data[i++] & 0x3f));
		else if ((b1 & 0xf0) === 0xe0)
			out[off++] += fromCharCode(((b1 & 0x0f) << 12) | ((data[i++] & 0x3f) << 6) | (data[i++] & 0x3f));
		else if ((b1 & 0xf8) === 0xf0) {
			const cp = ((b1 & 0x07) << 18) | ((data[i++] & 0x3f) << 12) | ((data[i++] & 0x3f) << 6) | (data[i++] & 0x3f);
			if (cp <= 0x10ffff) {
				const m = cp - 0x10000;
				out[off++] = fromCharCode(0xd800 + (m >> 10), 0xdc00 + (m & 0x3ff));
			} else out[off++] = "\ufffd";
		} else out[off++] = "\ufffd";
	}

	out.length = off;
	return out.join("");
}

export function decodeUTF16BE(data: NettleWeb.BufferView, offset?: number | nul): string {
	offset ||= 0;
	const length = ((data.length - offset) / 2) >>> 0;
	const output = new Array<string>(length);

	for (let i = offset, p = 0; p < length; p++)
		output[p] = fromCharCode(((data[i++] & 0xff) << 8) | (data[i++] & 0xff));

	return output.join("");
}

export function decodeUTF16LE(data: NettleWeb.BufferView, offset?: number | nul): string {
	offset ||= 0;
	const length = ((data.length - offset) / 2) >>> 0;
	const output = new Array<string>(length);

	for (let i = offset, p = 0; p < length; p++)
		output[p] = fromCharCode((data[i++] & 0xff) | ((data[i++] & 0xff) << 8));

	return output.join("");
}

export function encodeASCII(data: string): NettleWeb.Buffer {
	const length = data.length;
	const buffer = new Uint8Array(length);

	for (let i = 0; i < length; i++)
		buffer[i] = data.charCodeAt(i);

	return buffer;
}

export function decodeASCII(data: NettleWeb.BufferView): string {
	const length = data.length;
	const output = new Array(length);

	for (let i = 0; i < length; i++)
		output[i] = fromCharCode(data[i]);

	return output.join("");
}

export function encodeUTF16(data: string): NettleWeb.Buffer {
	const length = data.length;
	const buffer = new Uint8Array(length * 2 + 2);

	buffer[0] = 0xfe; buffer[1] = 0xff; // big endian byte order mark
	for (let i = 2, p = 0; p < length; p++) {
		const code = data.charCodeAt(p);
		buffer[i++] = (code >> 8) & 0xff;
		buffer[i++] = code & 0xff;
	}

	return buffer;
}

export function decodeUTF16(data: NettleWeb.BufferView): string {
	if (data.length >= 2) {
		switch (((data[0] & 0xff) | ((data[1] & 0xff) << 8))) {
			case 0xfeff: // little endian
				return decodeUTF16LE(data, 2);
			case 0xfffe: // big endian
				return decodeUTF16BE(data, 2);
			default: // unknown endian
				return decodeUTF16BE(data, 0);
		}
	}
	return "";
}

export function encodeUTF16BE(data: string): NettleWeb.Buffer {
	const length = data.length;
	const buffer = new Uint8Array(length * 2);

	for (let i = 0, p = 0; p < length; p++) {
		const code = data.charCodeAt(p);
		buffer[i++] = (code >> 8) & 0xff;
		buffer[i++] = code & 0xff;
	}

	return buffer;
}

export function encodeUTF16LE(data: string): NettleWeb.Buffer {
	const length = data.length;
	const buffer = new Uint8Array(length * 2);

	for (let i = 0, p = 0; p < length; p++) {
		const code = data.charCodeAt(p);
		buffer[i++] = code & 0xff;
		buffer[i++] = (code >> 8) & 0xff;
	}

	return buffer;
}

export function encodeUTF32BE(data: string): NettleWeb.Buffer {
	const array = Array.from(data);
	const length = array.length; // IMPORTANT: Convert string into code point array before calculating length
	const buffer = new Uint8Array(length * 4);

	for (let i = 0, p = 0; p < length; p++) {
		const code = array[p].codePointAt(0) || 0;
		buffer[i++] = (code >> 24) & 0xff;
		buffer[i++] = (code >> 16) & 0xff;
		buffer[i++] = (code >> 8) & 0xff;
		buffer[i++] = code & 0xff;
	}

	return buffer;
}

export function decodeUTF32BE(data: NettleWeb.BufferView): string {
	const length = (data.length / 4) >>> 0;
	const output = new Array(length);

	for (let i = 0, p = 0; p < length; p++) {
		const code = (((data[i++] & 0xff) << 24) |
			((data[i++] & 0xff) << 16) |
			((data[i++] & 0xff) << 8) |
			(data[i++] & 0xff)) >>> 0;

		output[p] = code > 0x10ffff ? "\ufffd" : fromCodePoint(code);
	}

	return output.join("");
}

export function encodeUTF32LE(data: string): NettleWeb.Buffer {
	const array = Array.from(data);
	const length = array.length;
	const buffer = new Uint8Array(length * 4);

	for (let i = 0, p = 0; p < length; p++) {
		const code = array[p].codePointAt(0) || 0;
		buffer[i++] = code & 0xff;
		buffer[i++] = (code >> 8) & 0xff;
		buffer[i++] = (code >> 16) & 0xff;
		buffer[i++] = (code >> 24) & 0xff;
	}

	return buffer;
}

export function decodeUTF32LE(data: NettleWeb.BufferView): string {
	const length = (data.length / 4) >>> 0;
	const output = new Array<string>(length);

	for (let i = 0, p = 0; p < length; p++) {
		const code = ((data[i++] & 0xff) |
			((data[i++] & 0xff) << 8) |
			((data[i++] & 0xff) << 16) |
			((data[i++] & 0xff) << 24)) >>> 0;

		output[p] = code > 0x10ffff ? "\ufffd" : fromCodePoint(code);
	}

	return output.join("");
}

export var ASCII: _WithProto<NettleWeb.Charset, NettleWeb.Charset>;
export var UTF_8: _WithProto<NettleWeb.Charset, NettleWeb.Charset>;
export var UTF16BE: _WithProto<NettleWeb.Charset, NettleWeb.Charset>;
export var UTF16LE: _WithProto<NettleWeb.Charset, NettleWeb.Charset>;
export var UTF32BE: _WithProto<NettleWeb.Charset, NettleWeb.Charset>;
export var UTF32LE: _WithProto<NettleWeb.Charset, NettleWeb.Charset>;


export default class Charset extends Null implements NettleWeb.Charset {
	readonly #name: string;
	get name(): string {
		return this.#name;
	}

	static #charsetMap: Record<string, NettleWeb.Charset>;

	static {
		const proto = freeze(defineProperty(this.prototype, Symbol.toStringTag, {
			value: "Charset",
			writable: false,
			enumerable: false,
			configurable: false
		}));
		const map: Record<string, _WithProto<NettleWeb.Charset, NettleWeb.Charset>> = { __proto__: null } as any;

		map[""] = map["utf8"] = map["utf-8"] = UTF_8 = {
			__proto__: proto,
			name: "UTF-8",
			encode: encodeUTF8,
			decode: decodeUTF8
		};
		map["utf16"] = map["utf-16"] = map["unicode"] = {
			__proto__: proto,
			name: "UTF-16",
			encode: encodeUTF16,
			decode: decodeUTF16
		};
		map["utf16be"] = map["utf16-be"] = map["utf-16be"] = map["utf-16-be"] = UTF16LE = {
			__proto__: proto,
			name: "UTF-16BE",
			encode: encodeUTF16BE,
			decode: decodeUTF16BE
		};
		map["utf16le"] = map["utf16-le"] = map["utf-16le"] = map["utf-16-le"] = UTF16LE = {
			__proto__: proto,
			name: "UTF-16LE",
			encode: encodeUTF16LE,
			decode: decodeUTF16LE
		};
		map["utf32be"] = map["utf32-be"] = map["utf-32be"] = map["utf-32-be"] = UTF32BE = {
			__proto__: proto,
			name: "UTF-32BE",
			encode: encodeUTF32BE,
			decode: decodeUTF32BE
		};
		map["utf32le"] = map["utf32-le"] = map["utf-32le"] = map["utf-32-le"] = UTF32LE = {
			__proto__: proto,
			name: "UTF-32LE",
			encode: encodeUTF32LE,
			decode: decodeUTF32LE
		};
		map["ascii"] = map["latin1"] = map["us-ascii"] = map["iso-8859-1"] = ASCII = {
			__proto__: proto,
			name: "ascii",
			encode: encodeASCII,
			decode: decodeASCII
		};

		this.#charsetMap = map;
	}

	constructor(name: string) {
		super();
		if (new.target !== Charset) { // called from subclass
			const map = Charset.#charsetMap;
			if (!(name in map))
				map[name] = this;
		} else throw new Error("This abstract class cannot be constructed directly");

		this.#name = name;
	}

	static forName(name: string | Charset): NettleWeb.Charset {
		if (typeof name !== "string")
			name = name.#name;

		const charset = this.#charsetMap[name.toLowerCase()];
		if (charset != null)
			return charset;

		throw new Error("Unsupported charset: " + name);
	}

	static isSupported(name: string): boolean {
		return name.toLowerCase() in this.#charsetMap;
	}

	static defaultCharset(): NettleWeb.Charset {
		return this.#charsetMap["utf-8"]; // always
	}

	encode(data: string): NettleWeb.Buffer {
		return encodeUTF8(data); // dummy
	}
	decode(data: NettleWeb.BufferView): string {
		return decodeUTF8(data); // dummy
	}
}
