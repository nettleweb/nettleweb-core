import { incrCounter, initCounter, seedgen256 } from "../misc/misc.js";
import AES from "../utils/AES.js";
import AbstractRandom from "./AbstractRandom.js";
export default class SecureRandom extends AbstractRandom {
    #aes;
    #index = 16;
    #buffer = new Array(16).fill(0);
    #counter;
    get aes() {
        return this.#aes;
    }
    get seed() {
        return this.#aes.key;
    }
    get counter() {
        return this.#counter;
    }
    constructor(seed, counter) {
        super();
        this.#aes = new AES(seed ||= seedgen256());
        this.#counter = initCounter(counter);
    }
    rand() {
        const view = this.randBuf(new Array(4));
        return (((view[0] & 0xff) |
            ((view[1] & 0xff) << 8) |
            ((view[2] & 0xff) << 16) |
            ((view[3] & 0xff) << 24)) >>> 0) / 4294967296;
    }
    randBuf(buf) {
        const counter = this.#counter;
        const length = buf.length;
        const aes = this.#aes;
        let buffer = this.#buffer;
        let index = this.#index;
        let off = 0;
        while (off < length) {
            const avail = 16 - index;
            if (avail < 1) {
                buffer = aes.encryptCTR(buffer, counter);
                incrCounter(counter);
                index = 0;
                continue;
            }
            const bytes = Math.min(length - off, avail);
            for (let i = 0; i < bytes; i++)
                buf[off++] = buffer[index++];
        }
        this.#buffer = buffer;
        this.#index = index;
        return buf;
    }
    setSeed(seed) {
        this.#aes = new AES(seed);
    }
    setCounter(counter) {
        this.#counter = initCounter(counter);
    }
}
