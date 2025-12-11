import Stream from "../io/Stream.js";
import Sha1Stream from "./Sha1Stream.js";
export default class HmacSha1Stream extends Stream {
    #base;
    #k_xor_ipad;
    #k_xor_opad;
    get canWrite() {
        return true;
    }
    get algorithm() {
        return "hmac-sha1";
    }
    get hashLength() {
        return 20;
    }
    constructor(key) {
        super();
        const base = new Sha1Stream();
        const k_xor_ipad = new Array(64);
        const k_xor_opad = new Array(64);
        for (let i = 0; i < 64; i++)
            k_xor_ipad[i] = key[i] ^ 0x36;
        for (let i = 0; i < 64; i++)
            k_xor_opad[i] = key[i] ^ 0x5c;
        base._write(k_xor_ipad);
        this.#base = base;
        this.#k_xor_ipad = k_xor_ipad;
        this.#k_xor_opad = k_xor_opad;
    }
    _write(buf) {
        return this.#base._write(buf);
    }
    hash() {
        const base = this.#base;
        const inner_hash = base.hash();
        base._write(this.#k_xor_opad);
        base._write(inner_hash);
        const outer_hash = base.hash();
        this.reset(); // important -- do not inline outer_hash
        return outer_hash;
    }
    reset() {
        const base = this.#base;
        base.reset();
        base._write(this.#k_xor_ipad);
    }
}
