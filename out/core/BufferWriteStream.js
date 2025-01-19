import WriteStream from "./WriteStream.js";
export default class BufferWriteStream extends WriteStream {
    #data = [];
    #length = 0;
    write(data) {
        if (typeof data === "number") {
            this.#data.push(data);
            this.#length++;
        }
        else {
            this.#data.push(data);
            this.#length += data.byteLength;
        }
    }
    toBuffer() {
        const buffer = new Uint8Array(this.#length);
        let offset = 0;
        for (const e of this.#data) {
            if (typeof e !== "number") {
                buffer.set(e, offset);
                offset += e.byteLength;
            }
            else
                buffer[offset++] = e;
        }
        return buffer;
    }
    // disabled operations
    get closed() { return false; }
    flush() { }
    close() { }
}
