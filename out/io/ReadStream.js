import Charset from "../coder/Charset.js";
import { bufferConcat, decodeUTF8, encodeUTF8, singleBuffer } from "../misc/misc.js";
import Stream from "./Stream.js";
function decodeBuffer(buf, cs) {
    if (cs == null)
        return buf;
    else if (cs === "utf-8")
        return decodeUTF8(buf);
    else
        return (typeof cs === "string" ? Charset.forName(cs) : cs).decode(buf);
}
export default class ReadStream extends Stream {
    constructor() {
        super(true, false);
    }
    _read(buf) {
        return -1; // by default
    }
    async read(buf, off, len) {
        if (buf == null) {
            const r = await this._read(singleBuffer);
            return r < 0 ? -1 : singleBuffer[0];
        }
        if (off != null || len != null) {
            off ||= 0;
            len ||= buf.byteLength;
            buf = buf.subarray(off, off + len);
        }
        return await this._read(buf);
    }
    async readLine(cs, sep) {
        const data = [];
        const sepCh = encodeUTF8(sep || "\n");
        const sepLen = sepCh.byteLength;
        loop: while (true) {
            for (let i = 0; i < sepLen; i++) {
                const ch = await this.read();
                data.push(ch);
                if (ch !== sepCh[i])
                    continue loop;
            }
            data.splice(data.length - sepLen, sepLen);
            break;
        }
        return decodeBuffer(Uint8Array.from(data), cs);
    }
    async readNBytes(len, cs) {
        const buffer = new Uint8Array(new ArrayBuffer(len), 0, len);
        let offset = 0;
        while (len > 0) {
            const i = await this.read(buffer, offset, Math.min(8192, len));
            if (i < 0)
                break;
            len -= i;
            offset += i;
        }
        return decodeBuffer(buffer.subarray(0, offset), cs);
    }
    async readAllBytes(cs) {
        const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);
        const chunks = [];
        let i = 0;
        let len = 0;
        while ((i = await this.read(buffer, 0, 8192)) >= 0) {
            len += i;
            chunks.push(buffer.subarray(0, i));
        }
        return decodeBuffer(bufferConcat(chunks, len), cs);
    }
    async pipe(out, close) {
        const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);
        let i = 0;
        let len = 0;
        while ((i = await this.read(buffer, 0, 8192)) >= 0) {
            await out.write(buffer, 0, i);
            await out.flush();
            len += i;
        }
        if (close ?? true) // close by default - match nodejs
            await out.close();
        return len;
    }
}
