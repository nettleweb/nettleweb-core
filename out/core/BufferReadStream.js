import ReadStream from "./ReadStream.js";
export default class BufferReadStream extends ReadStream {
    #index;
    #buffer;
    constructor(buf, i) {
        super();
        this.#index = i || 0;
        this.#buffer = buf;
    }
    read() {
        return this.#buffer[this.#index++];
    }
    readBuf(buf) {
        const buffer = this.#buffer.subarray(this.#index, this.#index += buf.byteLength);
        buf.set(buffer, 0);
        return buffer.byteLength;
    }
    readNBytes(n) {
        return this.#buffer.subarray(this.#index, this.#index += n);
    }
    setIndex(i) {
        this.#index = i;
    }
    setBuffer(buf) {
        this.#buffer = buf;
    }
    // buffer read stream cannot be closed
    get closed() { return false; }
    close() { }
}
