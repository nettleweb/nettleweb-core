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
        for (let i = 0; i < data.length; i++) {
            const ch = data.charCodeAt(i);
            if (ch < 0x80)
                bytes.push(ch);
            else if (ch < 0x800)
                bytes.push((ch >> 6) | 0xc0, (ch & 0x3f) | 0x80);
            else if (ch < 0xd800 || ch >= 0xe000)
                bytes.push((ch >> 12) | 0xe0, ((ch >> 6) & 0x3f) | 0x80, (ch & 0x3f) | 0x80);
            else { // Surrogate pair
                const cp = data.codePointAt(i++) || ch;
                bytes.push((cp >> 18) | 0xf0, ((cp >> 12) & 0x3f) | 0x80, ((cp >> 6) & 0x3f) | 0x80, (cp & 0x3f) | 0x80);
            }
        }
        return Uint8Array.from(bytes);
    },
    decode: (data) => {
        const len = data.byteLength;
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
        const length = data.length * 2;
        const buffer = new ArrayBuffer(length + 2);
        const dataView = new DataView(buffer, 0, length);
        dataView.setUint16(0, 0xfeff, false); // byte order mark
        for (let i = 2, p = 0; i < length; i += 2, p++)
            dataView.setUint16(i, data.charCodeAt(p) || 0xfffd, false);
        return new Uint8Array(buffer, 0, length);
    },
    decode: (data) => {
        if (data.byteLength > 2) {
            switch (((data[0] & 0xff) | ((data[1] & 0xff) << 8))) {
                case 0xfeff: // little endian
                    return UTF16LE.decode(data.subarray(2));
                case 0xfffe: // big endian
                    return UTF16BE.decode(data.subarray(2));
                default: // unknown endian
                    break;
            }
        }
        return UTF16BE.decode(data);
    }
};
export const UTF16BE = {
    name: "utf-16be",
    encode: (data) => {
        const length = data.length * 2;
        const buffer = new ArrayBuffer(length);
        const dataView = new DataView(buffer, 0, length);
        for (let i = 0, p = 0; i < length; i += 2, p++)
            dataView.setUint16(i, data.charCodeAt(p) || 0xfffd, false);
        return new Uint8Array(buffer, 0, length);
    },
    decode: (data) => {
        const length = Math.floor(data.byteLength / 2);
        const output = new Array(length);
        const dataView = new DataView(data.buffer, data.byteOffset, length * 2);
        for (let i = 0, p = 0; p < length; i += 2, p++)
            output[p] = String.fromCharCode(dataView.getUint16(i, false));
        return output.join("");
    }
};
export const UTF16LE = {
    name: "utf-16le",
    encode: (data) => {
        const length = data.length * 2;
        const buffer = new ArrayBuffer(length);
        const dataView = new DataView(buffer, 0, length);
        for (let i = 0, p = 0; i < length; i += 2, p++)
            dataView.setUint16(i, data.charCodeAt(p) || 0xfffd, true);
        return new Uint8Array(buffer, 0, length);
    },
    decode: (data) => {
        const length = Math.floor(data.byteLength / 2);
        const output = new Array(length);
        const dataView = new DataView(data.buffer, data.byteOffset, length * 2);
        for (let i = 0, p = 0; p < length; i += 2, p++)
            output[p] = String.fromCharCode(dataView.getUint16(i, true));
        return output.join("");
    }
};
export const UTF32BE = {
    name: "utf-32be",
    encode: (data) => {
        const array = Array.from(data, (e) => e.codePointAt(0) || 0xfffd);
        const length = array.length * 4;
        const buffer = new ArrayBuffer(length);
        const dataView = new DataView(buffer, 0, length);
        for (let i = 0, p = 0; i < length; i += 4, p++)
            dataView.setUint32(i, array[p], false);
        return new Uint8Array(buffer, 0, length);
    },
    decode: (data) => {
        const length = Math.floor(data.byteLength / 4);
        const output = new Array(length);
        const dataView = new DataView(data.buffer, data.byteOffset, length * 4);
        for (let i = 0, p = 0; p < length; i += 4, p++) {
            const code = dataView.getUint32(i, false);
            output[p] = code > 0x10ffff ? "\ufffd" : String.fromCodePoint(code);
        }
        return output.join("");
    }
};
export const UTF32LE = {
    name: "utf32-le",
    encode: (data) => {
        const array = Array.from(data, (e) => e.codePointAt(0) || 0xfffd);
        const length = array.length * 4;
        const buffer = new ArrayBuffer(length);
        const dataView = new DataView(buffer, 0, length);
        for (let i = 0, p = 0; i < length; i += 4, p++)
            dataView.setUint32(i, array[p], true);
        return new Uint8Array(buffer, 0, length);
    },
    decode: (data) => {
        const length = Math.floor(data.byteLength / 4);
        const output = new Array(length);
        const dataView = new DataView(data.buffer, data.byteOffset, length * 4);
        for (let i = 0, p = 0; p < length; i += 4, p++) {
            const code = dataView.getUint32(i, true);
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
    encode(data) {
        throw new Error("Function not implemented");
    }
    decode(data) {
        throw new Error("Function not implemented");
    }
}
