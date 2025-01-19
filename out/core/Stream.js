import Null from "../misc/Null.js";
export default class Stream extends Null {
    #read;
    #write;
    #closed;
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
        this.#closed = false;
    }
    close() {
        this.#closed = true;
    }
}
