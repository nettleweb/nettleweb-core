import Charset, { UTF_8 } from "../coder/Charset.js";
import Stream from "./Stream.js";
export default class SyncWriteStream extends Stream {
    constructor() {
        super(false, true);
    }
    flush() {
    }
    write(data) {
    }
    writeBuf(buf, off, len) {
        off ||= 0;
        len ||= buf.byteLength;
        while (off < len)
            this.write(buf[off]);
    }
    writeText(text, cs) {
        const buffer = (((cs ||= "utf-8") === "utf-8") ? UTF_8 : Charset.forName(cs)).encode(text);
        this.writeBuf(buffer, 0, buffer.byteLength);
    }
}
