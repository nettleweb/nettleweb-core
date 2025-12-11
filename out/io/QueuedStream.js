import Stream from "./Stream.js";
export default class QueuedStream extends Stream {
    #eof = false;
    #offset = 0;
    #queue = [];
    #buffer;
    #resolve;
    get canRead() {
        return true;
    }
    #signal_next() {
        if (this.#eof) {
            this.#resolve = null;
            this.#buffer = null;
            return -1;
        }
        return -2;
    }
    #read() {
        const queue = this.#queue;
        let chunk = queue[0];
        if (chunk == null)
            return this.#signal_next();
        let length = chunk.length;
        let offset = this.#offset;
        let avail = length - offset;
        if (avail <= 0) {
            queue.shift();
            chunk = queue[0];
            offset = this.#offset = 0;
            if (chunk == null)
                return this.#signal_next();
            length = avail = chunk.length;
        }
        const buffer = this.#buffer;
        const bufLen = buffer.length;
        length = avail > bufLen ? bufLen : avail;
        buffer.set(chunk.subarray(offset, offset + length), 0);
        this.#offset += length;
        this.#resolve = null;
        this.#buffer = null;
        return length;
    }
    _read(buf) {
        if (this.#resolve != null)
            throw new Error("Cannot invoke read() before the previous request finalized.");
        this.#buffer = buf;
        {
            const res = this.#read();
            if (res !== -2)
                return res;
        }
        return new Promise((resolve) => {
            this.#resolve = resolve;
        });
    }
    _close() {
        this.#eof = true;
        this.#offset = 0;
        this.#buffer = null;
        this.#resolve = null;
        this.#queue.length = 0;
    }
    enqueue(buf) {
        if (buf == null)
            this.#eof = true;
        else
            this.#queue.push(buf);
        const resolve = this.#resolve;
        if (resolve != null)
            resolve(this.#read());
    }
}
