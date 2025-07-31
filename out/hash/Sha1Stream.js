import WriteStream from "../io/WriteStream.js";
const k = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];
export default class Sha1Stream extends WriteStream {
    #h = [];
    #buffer = [];
    #totalBitsLow = 0;
    #totalBitsHigh = 0;
    get algorithm() {
        return "sha1";
    }
    get hashLength() {
        return 20;
    }
    constructor() {
        super();
        this.reset();
    }
    reset() {
        this.#h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
        this.#buffer = [];
        this.#totalBitsLow = 0;
        this.#totalBitsHigh = 0;
    }
    _write(input) {
        const combined = [...this.#buffer, ...input];
        const procSize = Math.floor(combined.length / 64) * 64;
        const addBits = procSize * 8;
        let newLow = this.#totalBitsLow + (addBits & 0xFFFFFFFF);
        let newHigh = this.#totalBitsHigh + Math.floor(addBits / 0x100000000);
        if (newLow > 0xFFFFFFFF) {
            newHigh += Math.floor(newLow / 0x100000000);
            newLow &= 0xFFFFFFFF;
        }
        this.#totalBitsHigh = newHigh & 0xFFFFFFFF;
        this.#totalBitsLow = newLow & 0xFFFFFFFF;
        this.#buffer = combined.slice(procSize);
        const w = new Uint32Array(80);
        const h = this.#h;
        for (let chunkStart = 0; chunkStart < procSize; chunkStart += 64) {
            for (let i = 0; i < 16; i++) {
                const pos = chunkStart + i * 4;
                w[i] = (combined[pos] << 24) | (combined[pos + 1] << 16) | (combined[pos + 2] << 8) | combined[pos + 3];
            }
            for (let i = 16; i < 80; i++) {
                const n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
                w[i] = (n << 1) | (n >>> 31);
            }
            let [a, b, c, d, e] = h;
            let temp, f;
            for (let i = 0; i < 80; i++) {
                if (i < 20) {
                    f = (b & c) | (~b & d);
                }
                else if (i < 40) {
                    f = b ^ c ^ d;
                }
                else if (i < 60) {
                    f = (b & c) | (b & d) | (c & d);
                }
                else {
                    f = b ^ c ^ d;
                }
                temp = ((a << 5) | (a >>> 27)) + f + e + k[Math.floor(i / 20)] + w[i];
                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = temp >>> 0;
            }
            h[0] = (h[0] + a) >>> 0;
            h[1] = (h[1] + b) >>> 0;
            h[2] = (h[2] + c) >>> 0;
            h[3] = (h[3] + d) >>> 0;
            h[4] = (h[4] + e) >>> 0;
        }
    }
    hash() {
        const buffer = this.#buffer;
        const bufLen = buffer.length;
        let totalBitsLow = this.#totalBitsLow + (bufLen * 8);
        let totalBitsHigh = this.#totalBitsHigh;
        if (totalBitsLow > 0xFFFFFFFF) {
            totalBitsHigh += (totalBitsLow / 0x100000000) | 0;
            totalBitsLow &= 0xFFFFFFFF;
        }
        totalBitsHigh &= 0xFFFFFFFF;
        const padLen = bufLen < 56 ? 64 : 128;
        const padding = new Uint8Array(padLen);
        padding.set(buffer);
        padding[bufLen] = 0x80;
        padding[padLen - 8] = (totalBitsHigh >>> 24) & 0xFF;
        padding[padLen - 7] = (totalBitsHigh >>> 16) & 0xFF;
        padding[padLen - 6] = (totalBitsHigh >>> 8) & 0xFF;
        padding[padLen - 5] = totalBitsHigh & 0xFF;
        padding[padLen - 4] = (totalBitsLow >>> 24) & 0xFF;
        padding[padLen - 3] = (totalBitsLow >>> 16) & 0xFF;
        padding[padLen - 2] = (totalBitsLow >>> 8) & 0xFF;
        padding[padLen - 1] = totalBitsLow & 0xFF;
        const w = new Uint32Array(80);
        const h = this.#h;
        for (let chunkStart = 0; chunkStart < padLen; chunkStart += 64) {
            for (let i = 0; i < 16; i++) {
                const index = chunkStart + i * 4;
                w[i] = (padding[index] << 24) | (padding[index + 1] << 16) | (padding[index + 2] << 8) | padding[index + 3];
            }
            for (let i = 16; i < 80; i++) {
                const n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
                w[i] = (n << 1) | (n >>> 31);
            }
            let [a, b, c, d, e] = h;
            let temp, f;
            for (let i = 0; i < 80; i++) {
                if (i < 20) {
                    f = (b & c) | (~b & d);
                }
                else if (i < 40) {
                    f = b ^ c ^ d;
                }
                else if (i < 60) {
                    f = (b & c) | (b & d) | (c & d);
                }
                else {
                    f = b ^ c ^ d;
                }
                temp = ((a << 5) | (a >>> 27)) + f + e + k[Math.floor(i / 20)] + w[i];
                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = temp >>> 0;
            }
            h[0] = (h[0] + a) >>> 0;
            h[1] = (h[1] + b) >>> 0;
            h[2] = (h[2] + c) >>> 0;
            h[3] = (h[3] + d) >>> 0;
            h[4] = (h[4] + e) >>> 0;
        }
        const result = new Array(20);
        for (let i = 0, p = 0; i < 5; i++) {
            const hVal = h[i];
            result[p++] = (hVal >>> 24) & 0xFF;
            result[p++] = (hVal >>> 16) & 0xFF;
            result[p++] = (hVal >>> 8) & 0xFF;
            result[p++] = hVal & 0xFF;
        }
        this.reset();
        return result;
    }
}
