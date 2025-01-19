import Stream from "./Stream.js";
export default class WriteStream extends Stream {
    constructor() {
        super(false, true);
    }
    write(data) {
    }
    flush() {
    }
}
