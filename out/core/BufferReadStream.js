import SyncReadStream from "./SyncReadStream.js";
export default class BufferReadStream extends SyncReadStream {
    #index;
    #buffer;
    get index() {
        return this.#index;
    }
    set index(v) {
        this.#index = v || 0;
    }
    get buffer() {
        return this.#buffer;
    }
    set buffer(v) {
        this.#buffer = v;
    }
    constructor(buf, i) {
        super();
        this.#index = i || 0;
        this.#buffer = buf;
    }
    read() {
        return this.#buffer[this.#index++];
    }
    readBuf(buf, off, len) {
        const buffer = this.#buffer.subarray(this.#index, this.#index += (len ||= buf.byteLength));
        buf.set(buffer, off || 0);
        return len;
    }
    readNBytes(n) {
        return this.#buffer.subarray(this.#index, this.#index += n);
    }
    readAllBytes() {
        return this.#buffer.subarray(this.#index);
    }
    // buffer read stream cannot be closed
    get closed() { return false; }
    close() { }
}
