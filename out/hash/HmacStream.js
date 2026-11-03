import { Uint8Array } from "../misc/intrinsics.js";
import Null from "../misc/Null.js";
export default class HmacStream extends Null {
    #base;
    #ipad;
    #opad;
    constructor(key, base, blockSize) {
        super();
        const ipad = new Uint8Array(blockSize).fill(0x36);
        const opad = new Uint8Array(blockSize).fill(0x5c);
        let xor_len = key.length;
        if (xor_len > blockSize) {
            const hash = base.update(key).hash();
            xor_len = hash.length;
            key = hash;
        }
        for (let i = 0; i < xor_len; i++) {
            ipad[i] ^= key[i];
            opad[i] ^= key[i];
        }
        this.#ipad = ipad;
        this.#opad = opad;
        this.#base = base.update(ipad);
    }
    hash() {
        const base = this.#base;
        const hash = base.hash();
        base.update(this.#opad);
        base.update(hash);
        return base.hash();
    }
    reset() {
        const base = this.#base;
        base.reset();
        base.update(this.#ipad);
        return this;
    }
    update(buf) {
        this.#base.update(buf);
        return this;
    }
}
