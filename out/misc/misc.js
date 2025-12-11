export const ITER_FUNC = Array.prototype[Symbol.iterator];
export const DEFAULT_CMP = (a, b) => a < b ? -1 : a > b ? 1 : 0;
export const emptyBuffer = new Uint8Array(0);
export const singleBuffer = new Uint8Array(1);
export function initCounter(state) {
    if (state == null) {
        const arr = new Array(16);
        arr[15] = 1;
        return arr;
    }
    else if (typeof state === "number") {
        let value = state;
        const arr = new Array(16);
        for (let i = 15; i >= 0; --i) {
            arr[i] = value % 256;
            value = Math.floor(value / 256);
        }
        return arr;
    }
    else {
        const arr = Array.from(state);
        if (arr.length !== 16)
            throw new Error("Counter state must have a length of 16.");
        return arr;
    }
}
export function incrCounter(counter) {
    for (let i = 15; i >= 0; i--) {
        if (counter[i] < 255) {
            counter[i]++;
            break;
        }
        else
            counter[i] = 0;
    }
}
export function isBuffer(obj) {
    if (ArrayBuffer.isView(obj)) {
        const tag = obj[Symbol.toStringTag];
        return tag === "Uint8Array" || tag === "Buffer";
    }
    return false;
}
export function isArrayBuffer(obj) {
    try {
        new DataView(obj, 0, 0);
        return true;
    }
    catch (err) {
        return false;
    }
}
export function bufferMerge(b1, b2) {
    const offset = b1.length;
    const buffer = new Uint8Array(offset + b2.length);
    buffer.set(b1, 0);
    buffer.set(b2, offset);
    return buffer;
}
export function bufferConcat(data, length) {
    if (typeof length !== "number" || length < 0) {
        length = 0;
        for (const e of data)
            length += e.length;
    }
    const buffer = new Uint8Array(length);
    let offset = 0;
    for (const e of data) {
        const length = e.length;
        buffer.set(e, offset);
        offset += length;
    }
    return buffer;
}
export function seedgen32() {
    return Math.floor(Math.random() * 4294967296);
}
export function seedgen256() {
    const seed = new Array(32);
    for (let i = 0, p = 0; i < 4; i++) {
        const rand = seedgen32();
        seed[p++] = rand & 0xff;
        seed[p++] = (rand >> 8) & 0xff;
        seed[p++] = (rand >> 16) & 0xff;
        seed[p++] = (rand >> 24) & 0xff;
    }
    return seed;
}
export function encodeHex(data) {
    const length = data.length;
    const hex = new Array(length);
    for (let i = 0; i < length; i++)
        hex[i] = data[i].toString(16).padStart(2, "0");
    return hex.join("");
}
export function decodeHex(data) {
    const length = Math.floor(data.length / 2);
    const buffer = new Uint8Array(length);
    for (let i = 0, p = 0; i < length; i++)
        buffer[i] = parseInt(data.slice(p, p += 2), 16);
    return buffer;
}
export function encodeUTF8(data) {
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
}
export function decodeUTF8(data) {
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
export function decodeUTF16BE(data, offset) {
    const length = Math.floor((data.length - offset) / 2);
    const output = new Array(length);
    for (let i = offset, p = 0; p < length; p++)
        output[p] = String.fromCharCode(((data[i++] & 0xff) << 8) | (data[i++] & 0xff));
    return output.join("");
}
export function decodeUTF16LE(data, offset) {
    const length = Math.floor((data.length - offset) / 2);
    const output = new Array(length);
    for (let i = offset, p = 0; p < length; p++)
        output[p] = String.fromCharCode((data[i++] & 0xff) | ((data[i++] & 0xff) << 8));
    return output.join("");
}
export function bytesToInt32(bytes) {
    const length = Math.floor(bytes.length / 4);
    const result = new Array(length);
    for (let i = 0, p = 0; i < length; i++)
        result[i] = ((bytes[p++] & 0xff) << 24) | ((bytes[p++] & 0xff) << 16) | ((bytes[p++] & 0xff) << 8) | (bytes[p++] & 0xff);
    return result;
}
