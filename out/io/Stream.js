import Null from "../misc/Null.js";
export default class Stream extends Null {
    #read;
    #write;
    #closed = false;
    get closed() {
        return this.#closed;
    }
    get canRead() {
        return this.#read;
    }
    get canWrite() {
        return this.#write;
    }
    constructor(read, write) {
        super();
        this.#read = read ?? false;
        this.#write = write ?? false;
    }
    async close() {
        this.#closed = true;
    }
    async *generator(chunkSize) {
        const stream = this;
        const buffer = new Uint8Array(chunkSize || 8192);
        let i;
        while ((i = await stream._read(buffer)) >= 0)
            yield buffer.subarray(0, i);
        return buffer;
    }
}
