import Null from "../misc/Null.js";
export default class AbstractRandom extends Null {
    #seed;
    get seed() { return this.#seed; }
    constructor(seed) {
        super();
        this.#seed = seed || null;
    }
    setSeed(seed) {
        this.#seed = seed || null;
    }
    rand() {
        throw new Error("Function not implemented");
    }
    randBuf(buf) {
        const len = buf.byteLength;
        const rlen = len % 4;
        const llen = len - rlen;
        for (let i = 0; i < llen;) {
            const rand = (this.rand() * 4294967296) >>> 0;
            buf[i++] = rand & 0xff;
            buf[i++] = (rand >> 8) & 0xff;
            buf[i++] = (rand >> 16) & 0xff;
            buf[i++] = (rand >> 24) & 0xff;
        }
        for (let i = llen; i < len; i++)
            buf[i++] = (this.rand() * 256) & 0xff;
        return buf;
    }
    randInt(max, min) {
        return (min ||= 0) + Math.floor(this.rand() * ((max || 4294967296) - min));
    }
    randUUID() {
        const buf = this.randBuf(new Uint8Array(16));
        // Set the version (4) and variant (8, 9, A, or B) bits
        buf[6] = (buf[6] & 0x0f) | 0x40;
        buf[8] = (buf[8] & 0x3f) | 0x80;
        // Convert to string with hyphens
        let uuid = "";
        for (let i = 0; i < 16; i++) {
            uuid += buf[i].toString(16).padStart(2, "0");
            if (i === 3 || i === 5 || i === 7 || i === 9)
                uuid += "-";
        }
        return uuid;
    }
}
