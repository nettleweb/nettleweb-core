import { Array, freeze, Uint8Array } from "../misc/intrinsics.js";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup = new Uint8Array(256);
for (let i = 0; i < 26; i++)
    lookup[65 + i] = i; // A-Z
for (let i = 0; i < 26; i++)
    lookup[97 + i] = i + 26; // a-z
for (let i = 0; i < 10; i++)
    lookup[48 + i] = i + 52; // 0-9
lookup[43] = 62;
lookup[47] = 63;
lookup[61] = 0;
const Base64 = {
    __proto__: null,
    encode: (data) => {
        const length = data.length;
        const output = new Array(((length / 3) >>> 0) * 4 + (length % 3 ? 4 : 0));
        let i = 0, j = 0;
        while (i < length - 2) {
            const n = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
            output[j] = chars[(n >>> 18) & 0x3F];
            output[j + 1] = chars[(n >>> 12) & 0x3F];
            output[j + 2] = chars[(n >>> 6) & 0x3F];
            output[j + 3] = chars[n & 0x3F];
            i += 3;
            j += 4;
        }
        if (i < length) {
            const a = data[i];
            const b = i + 1 < length ? data[i + 1] : 0;
            const n = (a << 16) | (b << 8);
            output[j] = chars[(n >>> 18) & 0x3F];
            output[j + 1] = chars[(n >>> 12) & 0x3F];
            output[j + 2] = i + 1 < length ? chars[(n >>> 6) & 0x3F] : "=";
            output[j + 3] = "=";
        }
        return output.join("");
    },
    decode: (data) => {
        const len = data.length;
        let pad = 0;
        if (data[len - 1] === "=")
            pad++;
        if (data[len - 2] === "=")
            pad++;
        const outLen = ((len * 3) >>> 2) - pad;
        const output = new Uint8Array(outLen);
        let i = 0, j = 0;
        while (i < len) {
            const a = lookup[data.charCodeAt(i)];
            const b = lookup[data.charCodeAt(i + 1)];
            const c = lookup[data.charCodeAt(i + 2)];
            const d = lookup[data.charCodeAt(i + 3)];
            const n = (a << 18) | (b << 12) | (c << 6) | d;
            output[j] = (n >>> 16) & 0xFF;
            if (j + 1 < outLen)
                output[j + 1] = (n >>> 8) & 0xFF;
            if (j + 2 < outLen)
                output[j + 2] = n & 0xFF;
            i += 4;
            j += 3;
        }
        return output;
    }
};
export default freeze(Base64);
