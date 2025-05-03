import Stream from "./Stream.js";
export default class SyncStream extends Stream {
    constructor(read, write) {
        super(true, read, write);
    }
    close() {
        super.close();
    }
}
