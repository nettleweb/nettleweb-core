import Charset, { UTF_8 } from "../coder/Charset.js";
import Buffer from "./Buffer.js";
import ReadStreamBase from "./ReadStreamBase.js";
export default class SyncReadStream extends ReadStreamBase {
    read() {
        return -1;
    }
    readBuf(buf, off, len) {
        off ||= 0;
        len ||= buf.byteLength;
        for (let i = 0; i < len; i++) {
            const b = this.read();
            if (b >= 0)
                buf[off + i] = b;
            else
                return i;
        }
        return len;
    }
    readText(len, cs) {
        const buffer = this.readNBytes(len);
        if ((cs ||= "utf-8") === "utf-8")
            return UTF_8.decode(buffer);
        else
            return Charset.forName(cs).decode(buffer);
    }
    readNBytes(len) {
        const buffer = new Uint8Array(new ArrayBuffer(len), 0, len);
        let offset = 0;
        while (len > 0) {
            const i = this.readBuf(buffer, offset, Math.min(8192, len));
            if (i < 0)
                break;
            len -= i;
            offset += i;
        }
        return buffer.subarray(0, offset);
    }
    readAllBytes() {
        const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);
        const chunks = [];
        let i = 0;
        let len = 0;
        while ((i = this.readBuf(buffer, 0, 8192)) >= 0) {
            len += i;
            chunks.push(buffer.subarray(0, i));
        }
        return Buffer.concat(chunks, len);
    }
    pipeSync(out) {
        const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);
        let i = 0;
        let len = 0;
        while ((i = this.readBuf(buffer, 0, 8192)) >= 0) {
            out.writeBuf(buffer, 0, i);
            out.flush();
            len += i;
        }
        return len;
    }
}
