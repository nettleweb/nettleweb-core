import Stream from "./Stream.js";
export default class EmptyStream extends Stream {
    #read;
    #write;
    get canRead() {
        return this.#read;
    }
    get canWrite() {
        return this.#write;
    }
    constructor(read, write) {
        super();
        this.#read = read ?? true;
        this.#write = write ?? true;
    }
    _read(buf) {
        return this.#read ? -1 : super._read(buf);
    }
    _write(buf) {
        return this.#write ? 0 : super._write(buf);
    }
}
