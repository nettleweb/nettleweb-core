import Null from "../misc/Null.js";
export default class Stream extends Null {
    #sync;
    #read;
    #write;
    #closed = false;
    get sync() {
        return this.#sync;
    }
    get closed() {
        return this.#closed;
    }
    get canRead() {
        return this.#read;
    }
    get canWrite() {
        return this.#write;
    }
    constructor(sync, read, write) {
        super();
        this.#sync = sync ?? false;
        this.#read = read ?? false;
        this.#write = write ?? false;
    }
    clone() {
        throw new Error("Function not implemented");
    }
    close() {
        this.#closed = true;
    }
}
