import { Array, freeze, Uint8Array } from "../misc/intrinsics.js";
import { emptyBuffer } from "../misc/misc.js";
const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const lookup = new Uint8Array(256);
for (let i = 0; i < 58; i++)
    lookup[chars.charCodeAt(i)] = i;
export function encodeBase58(data) {
    const len = data.length;
    if (len === 0)
        return "";
    let zeroes = 0;
    while (zeroes < len && data[zeroes] === 0)
        zeroes++;
    const capacity = ((len - zeroes) * 137 / 100 + 1) >>> 0;
    const buffer = new Uint8Array(capacity);
    let length = 0;
    for (let i = zeroes; i < len; i++) {
        let carry = data[i];
        let j = 0;
        for (let k = capacity - 1; (carry !== 0 || j < length) && k >= 0; k--, j++) {
            carry += (buffer[k] << 8);
            buffer[k] = carry % 58;
            carry = (carry / 58) | 0;
        }
        length = j;
    }
    let start = capacity - length;
    while (start < capacity && buffer[start] === 0)
        start++;
    const out = new Array(zeroes + (capacity - start));
    out.fill("1", 0, zeroes);
    let j = zeroes;
    for (let i = start; i < capacity; i++)
        out[j++] = chars[buffer[i]];
    return out.join("");
}
export function decodeBase58(data) {
    const len = data.length;
    if (len === 0)
        return emptyBuffer;
    let zeroes = 0;
    while (zeroes < len && data.charCodeAt(zeroes) === 49)
        zeroes++;
    const capacity = ((len - zeroes) * 733 / 1000 + 1) >>> 0;
    const buffer = new Uint8Array(capacity);
    let length = 0;
    for (let i = zeroes; i < len; i++) {
        let carry = lookup[data.charCodeAt(i)];
        let j = 0;
        for (let k = capacity - 1; (carry !== 0 || j < length) && k >= 0; k--, j++) {
            carry += buffer[k] * 58;
            buffer[k] = carry & 0xff;
            carry >>= 8;
        }
        length = j;
    }
    let start = capacity - length;
    while (start < capacity && buffer[start] === 0)
        start++;
    const out = new Uint8Array(zeroes + (capacity - start));
    out.set(buffer.subarray(start), zeroes);
    return out;
}
const Base58 = {
    __proto__: null,
    encode: encodeBase58,
    decode: decodeBase58
};
export default freeze(Base58);
