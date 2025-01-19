import ReadStream from "../core/ReadStream.js";
export default class RandomStream extends ReadStream {
    #random;
    constructor(rand) {
        super();
        this.#random = rand;
    }
    read() {
        return Math.floor(this.#random.rand() * 256) & 0xff;
    }
    readBuf(buf) {
        this.#random.randbuf(buf);
        return buf.byteLength;
    }
    readNBytes(n) {
        return this.#random.randbuf(new Uint8Array(new ArrayBuffer(n), 0, n));
    }
    // stream cannot be closed
    get closed() { return false; }
    close() { }
}
