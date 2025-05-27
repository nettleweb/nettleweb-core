import { decodeUTF16BE, decodeUTF16LE, decodeUTF8, encodeUTF8, STUB_FUNC } from "../misc/misc.js";
import Null from "../misc/Null.js";

export const ASCII: NettleWeb.Charset = {
	name: "ascii",
	encode: (data) => Uint8Array.from(data, (e) => e.charCodeAt(0)),
	decode: (data) => Array.from(data, (e) => String.fromCharCode(e)).join("")
};

export const UTF_8: NettleWeb.Charset = {
	name: "utf-8",
	encode: encodeUTF8,
	decode: decodeUTF8
};

export const UTF16: NettleWeb.Charset = {
	name: "utf-16",
	encode: (data: string) => {
		const length = data.length;
		const buffer = new Uint8Array(length * 2 + 2);

		buffer[0] = 0xfe; buffer[1] = 0xff; // big endian byte order mark
		for (let i = 2, p = 0; p < length; p++) {
			const code = data.charCodeAt(p);
			buffer[i++] = (code >> 8) & 0xff;
			buffer[i++] = code & 0xff;
		}

		return buffer;
	},
	decode: (data: NettleWeb.BufferView) => {
		if (data.length > 2) {
			switch (((data[0] & 0xff) | ((data[1] & 0xff) << 8))) {
				case 0xfeff: // little endian
					return decodeUTF16LE(data, 2);
				case 0xfffe: // big endian
					return decodeUTF16BE(data, 2);
				default: // unknown endian
					break;
			}
		}
		return decodeUTF16BE(data, 0); // fallback
	}
};

export const UTF16BE: NettleWeb.Charset = {
	name: "utf-16be",
	encode: (data: string) => {
		const length = data.length;
		const buffer = new Uint8Array(length * 2);

		for (let i = 0, p = 0; p < length; p++) {
			const code = data.charCodeAt(p);
			buffer[i++] = (code >> 8) & 0xff;
			buffer[i++] = code & 0xff;
		}

		return buffer;
	},
	decode: (data: NettleWeb.BufferView) => decodeUTF16BE(data, 0)
};

export const UTF16LE: NettleWeb.Charset = {
	name: "utf-16le",
	encode: (data: string) => {
		const length = data.length;
		const buffer = new Uint8Array(length * 2);

		for (let i = 0, p = 0; p < length; p++) {
			const code = data.charCodeAt(p);
			buffer[i++] = code & 0xff;
			buffer[i++] = (code >> 8) & 0xff;
		}

		return buffer;
	},
	decode: (data: NettleWeb.BufferView) => decodeUTF16LE(data, 0)
};

export const UTF32BE: NettleWeb.Charset = {
	name: "utf-32be",
	encode: (data: string) => {
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
	},
	decode: (data: ArrayLike<number>) => {
		const length = Math.floor(data.length / 4);
		const output = new Array<string>(length);

		for (let i = 0, p = 0; p < length; p++) {
			const code = (((data[i++] & 0xff) << 24) |
				((data[i++] & 0xff) << 16) |
				((data[i++] & 0xff) << 8) |
				(data[i++] & 0xff)) >>> 0;

			output[p] = code > 0x10ffff ? "\ufffd" : String.fromCodePoint(code);
		}

		return output.join("");
	}
};

export const UTF32LE: NettleWeb.Charset = {
	name: "utf32-le",
	encode: (data: string) => {
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
	},
	decode: (data: ArrayLike<number>) => {
		const length = Math.floor(data.length / 4);
		const output = new Array<string>(length);

		for (let i = 0, p = 0; p < length; p++) {
			const code = ((data[i++] & 0xff) |
				((data[i++] & 0xff) << 8) |
				((data[i++] & 0xff) << 16) |
				((data[i++] & 0xff) << 24)) >>> 0;

			output[p] = code > 0x10ffff ? "\ufffd" : String.fromCodePoint(code);
		}

		return output.join("");
	}
};

export default class Charset extends Null implements NettleWeb.Charset {
	readonly #name: string;
	get name(): string {
		return this.#name;
	}

	static #charsetMap: Record<string, Charset> = Object.setPrototypeOf({
		"": UTF_8,
		"utf8": UTF_8,
		"utf-8": UTF_8,

		"utf16": UTF16,
		"utf-16": UTF16,
		"unicode": UTF16,

		"utf16be": UTF16BE,
		"utf16-be": UTF16BE,
		"utf16le": UTF16LE,
		"utf16-le": UTF16LE,

		"utf32be": UTF32BE,
		"utf-32be": UTF32BE,
		"utf32le": UTF32LE,
		"utf-32le": UTF32LE,

		"ascii": ASCII,
		"latin1": ASCII,
		"us-ascii": ASCII,
		"iso-8859-1": ASCII
	}, null);

	static {
		const __proto__ = Object.freeze(Object.defineProperty(this.prototype, Symbol.toStringTag, {
			value: "Charset",
			writable: false,
			enumerable: false,
			configurable: false
		}));
		Object.freeze(Object.setPrototypeOf(ASCII, __proto__));
		Object.freeze(Object.setPrototypeOf(UTF_8, __proto__));
		Object.freeze(Object.setPrototypeOf(UTF16, __proto__));
		Object.freeze(Object.setPrototypeOf(UTF16BE, __proto__));
		Object.freeze(Object.setPrototypeOf(UTF16LE, __proto__));
		Object.freeze(Object.setPrototypeOf(UTF32BE, __proto__));
		Object.freeze(Object.setPrototypeOf(UTF32LE, __proto__));
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
		return UTF_8; // always
	}

	// stub abstract functions
	encode() { return STUB_FUNC(); }
	decode() { return STUB_FUNC(); }
}