import Charset, { UTF_8 } from "../coder/Charset.js";
import Stream from "./Stream.js";
export default class WriteStream extends Stream {
    constructor() {
        super(false, false, true);
    }
    async flush() {
    }
    async write(data) {
    }
    async writeBuf(buf, off, len) {
        off ||= 0;
        len ||= buf.byteLength;
        while (off < len)
            await this.write(buf[off]);
    }
    async writeText(text, cs) {
        const buffer = (((cs ||= "utf-8") === "utf-8") ? UTF_8 : Charset.forName(cs)).encode(text);
        await this.writeBuf(buffer, 0, buffer.byteLength);
    }
}
