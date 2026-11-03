import { Array, imul, Uint32Array } from "../misc/intrinsics.js";
import Null from "../misc/Null.js";
export default class HashStream extends Null {
    #h = new Uint32Array(4);
    get algorithm() {
        return "cyrb128";
    }
    get hashLength() {
        return 16;
    }
    constructor() {
        super();
        this.reset();
    }
    hash() {
        const h = this.#h;
        {
            let [a, b, c, d] = h;
            a = imul(c ^ (a >>> 18), 597399067);
            b = imul(d ^ (b >>> 22), 2869860233);
            c = imul(a ^ (c >>> 17), 951274213);
            d = imul(b ^ (d >>> 19), 2716044179);
            a = ((a ^ b ^ c ^ d) >>> 0);
            b = ((b ^ a) >>> 0);
            c = ((c ^ a) >>> 0);
            d = ((d ^ a) >>> 0);
            h[0] = a;
            h[1] = b;
            h[2] = c;
            h[3] = d;
        }
        const out = new Array(16);
        for (let i = 0, p = 0; i < 4; i++) {
            const e = h[i];
            out[p++] = (e >>> 24) & 0xFF;
            out[p++] = (e >>> 16) & 0xFF;
            out[p++] = (e >>> 8) & 0xFF;
            out[p++] = e & 0xFF;
        }
        this.reset();
        return out;
    }
    reset() {
        const h = this.#h;
        h[0] = 1779033703;
        h[1] = 3144134277;
        h[2] = 1013904242;
        h[3] = 2773480762;
        return this;
    }
    update(buf) {
        const len = buf.length;
        const h = this.#h;
        let [a, b, c, d] = h;
        for (let i = 0; i < len; i++) {
            const k = buf[i];
            a = b ^ imul(a ^ k, 597399067);
            b = c ^ imul(b ^ k, 2869860233);
            c = d ^ imul(c ^ k, 951274213);
            d = a ^ imul(d ^ k, 2716044179);
        }
        h[0] = a;
        h[1] = b;
        h[2] = c;
        h[3] = d;
        return this;
    }
}
