import { STUB_FUNC } from "../misc/misc.js";
import Null from "../misc/Null.js";
export const ASCII = {
    name: "ascii",
    encode: (data) => Uint8Array.from(data, (e) => e.charCodeAt(0)),
    decode: (data) => Array.from(data, (e) => String.fromCharCode(e)).join("")
};
export const UTF_8 = {
    name: "utf-8",
    encode: (data) => {
        const bytes = [];
        for (const ch of data) {
            const cp = ch.codePointAt(0) || 0;
            if (cp < 0x80)
                bytes.push(cp);
            else if (cp < 0x800)
                bytes.push((cp >> 6) | 0xc0, (cp & 0x3f) | 0x80);
            else if (cp < 0x10000)
                bytes.push((cp >> 12) | 0xe0, ((cp >> 6) & 0x3f) | 0x80, (cp & 0x3f) | 0x80);
            else // Surrogate pair, cp < 0x110000
                bytes.push((cp >> 18) | 0xf0, ((cp >> 12) & 0x3f) | 0x80, ((cp >> 6) & 0x3f) | 0x80, (cp & 0x3f) | 0x80);
        }
        return Uint8Array.from(bytes);
    },
    decode: (data) => {
        const len = data.length;
        let str = "";
        for (let i = 0; i < len;) {
            const b1 = data[i++];
            if ((b1 & 0x80) === 0)
                str += String.fromCharCode(b1);
            else if ((b1 & 0xe0) === 0xc0)
                str += String.fromCharCode(((b1 & 0x1f) << 6) | (data[i++] & 0x3f));
            else if ((b1 & 0xf0) === 0xe0)
                str += String.fromCharCode(((b1 & 0x0f) << 12) | ((data[i++] & 0x3f) << 6) | (data[i++] & 0x3f));
            else if ((b1 & 0xf8) === 0xf0) {
                const cp = ((b1 & 0x07) << 18) | ((data[i++] & 0x3f) << 12) | ((data[i++] & 0x3f) << 6) | (data[i++] & 0x3f);
                str += cp > 0x10ffff ? "\ufffd" : String.fromCodePoint(cp);
            }
            else
                str += "\ufffd";
        }
        return str;
    }
};
export const UTF16 = {
    name: "utf-16",
    encode: (data) => {
        const length = data.length;
        const buffer = new Uint8Array(length * 2 + 2);
        buffer[0] = 0xfe;
        buffer[1] = 0xff; // big endian byte order mark
        for (let i = 2, p = 0; p < length; p++) {
            const code = data.charCodeAt(p);
            buffer[i++] = (code >> 8) & 0xff;
            buffer[i++] = code & 0xff;
        }
        return buffer;
    },
    decode: (data) => {
        if (data.length > 2) {
            switch (((data[0] & 0xff) | ((data[1] & 0xff) << 8))) {
                case 0xfeff: // little endian
                    return UTF16LE.decode(data.subarray(2));
                case 0xfffe: // big endian
                    return UTF16BE.decode(data.subarray(2));
                default: // unknown endian
                    break;
            }
        }
        return UTF16BE.decode(data); // fallback
    }
};
export const UTF16BE = {
    name: "utf-16be",
    encode: (data) => {
        const length = data.length;
        const buffer = new Uint8Array(length * 2);
        for (let i = 0, p = 0; p < length; p++) {
            const code = data.charCodeAt(p);
            buffer[i++] = (code >> 8) & 0xff;
            buffer[i++] = code & 0xff;
        }
        return buffer;
    },
    decode: (data) => {
        const length = Math.floor(data.length / 2);
        const output = new Array(length);
        for (let i = 0, p = 0; p < length; p++)
            output[p] = String.fromCharCode(((data[i++] & 0xff) << 8) | (data[i++] & 0xff));
        return output.join("");
    }
};
export const UTF16LE = {
    name: "utf-16le",
    encode: (data) => {
        const length = data.length;
        const buffer = new Uint8Array(length * 2);
        for (let i = 0, p = 0; p < length; p++) {
            const code = data.charCodeAt(p);
            buffer[i++] = code & 0xff;
            buffer[i++] = (code >> 8) & 0xff;
        }
        return buffer;
    },
    decode: (data) => {
        const length = Math.floor(data.length / 2);
        const output = new Array(length);
        for (let i = 0, p = 0; p < length; p++)
            output[p] = String.fromCharCode((data[i++] & 0xff) | ((data[i++] & 0xff) << 8));
        return output.join("");
    }
};
export const UTF32BE = {
    name: "utf-32be",
    encode: (data) => {
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
    decode: (data) => {
        const length = Math.floor(data.length / 4);
        const output = new Array(length);
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
export const UTF32LE = {
    name: "utf32-le",
    encode: (data) => {
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
    decode: (data) => {
        const length = Math.floor(data.length / 4);
        const output = new Array(length);
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
export default class Charset extends Null {
    #name;
    get name() {
        return this.#name;
    }
    static #charsetMap = Object.setPrototypeOf({
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
    constructor(name) {
        super();
        if (new.target !== Charset) { // called from subclass
            const map = Charset.#charsetMap;
            if (!(name in map))
                map[name] = this;
        }
        else
            throw new Error("This abstract class cannot be constructed directly");
        this.#name = name;
    }
    static forName(name) {
        if (typeof name !== "string")
            name = name.#name;
        const charset = this.#charsetMap[name.toLowerCase()];
        if (charset != null)
            return charset;
        throw new Error("Unsupported charset: " + name);
    }
    static isSupported(name) {
        return name.toLowerCase() in this.#charsetMap;
    }
    static defaultCharset() {
        return UTF_8; // always
    }
    // stub abstract functions
    encode() { return STUB_FUNC(); }
    decode() { return STUB_FUNC(); }
}
