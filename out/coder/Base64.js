import { Array, freeze, Uint8Array } from "../misc/intrinsics.js";
import { emptyBuffer } from "../misc/misc.js";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup = new Uint8Array(256);
for (let i = 0; i < 64; i++)
    lookup[chars.charCodeAt(i)] = i;
export function encodeBase64(data) {
    const len = data.length;
    if (len === 0)
        return "";
    const outLen = (((len + 2) / 3) >>> 0) * 4;
    const out = new Array(outLen);
    let i = 0;
    let j = 0;
    const mainEnd = len - (len % 3);
    while (i < mainEnd) {
        const b0 = data[i++];
        const b1 = data[i++];
        const b2 = data[i++];
        out[j++] = chars[b0 >> 2];
        out[j++] = chars[((b0 & 0x03) << 4) | (b1 >> 4)];
        out[j++] = chars[((b1 & 0x0f) << 2) | (b2 >> 6)];
        out[j++] = chars[b2 & 0x3f];
    }
    const rem = len - mainEnd;
    if (rem === 1) {
        const b0 = data[i];
        out[j++] = chars[b0 >> 2];
        out[j++] = chars[(b0 & 0x03) << 4];
        out[j++] = "=";
        out[j++] = "=";
    }
    else if (rem === 2) {
        const b0 = data[i++];
        const b1 = data[i];
        out[j++] = chars[b0 >> 2];
        out[j++] = chars[((b0 & 0x03) << 4) | (b1 >> 4)];
        out[j++] = chars[(b1 & 0x0f) << 2];
        out[j++] = "=";
    }
    return out.join("");
}
export function decodeBase64(data) {
    const len = data.length;
    if (len === 0)
        return emptyBuffer;
    let padding = 0;
    if (data.charCodeAt(len - 1) === 61)
        padding++;
    if (data.charCodeAt(len - 2) === 61)
        padding++;
    const outLen = (((len * 3) / 4) >>> 0) - padding;
    const out = new Uint8Array(outLen);
    let i = 0;
    let j = 0;
    const limit = padding > 0 ? len - 4 : len;
    while (i < limit) {
        const c0 = lookup[data.charCodeAt(i++)];
        const c1 = lookup[data.charCodeAt(i++)];
        const c2 = lookup[data.charCodeAt(i++)];
        const c3 = lookup[data.charCodeAt(i++)];
        out[j++] = (c0 << 2) | (c1 >> 4);
        out[j++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
        out[j++] = ((c2 & 0x03) << 6) | c3;
    }
    if (padding > 0) {
        const c0 = lookup[data.charCodeAt(i++)];
        const c1 = lookup[data.charCodeAt(i++)];
        out[j++] = (c0 << 2) | (c1 >> 4);
        if (padding === 1) {
            const c2 = lookup[data.charCodeAt(i++)];
            out[j++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
        }
    }
    return out;
}
const Base64 = {
    __proto__: null,
    encode: encodeBase64,
    decode: decodeBase64
};
export default freeze(Base64);
