import Stream from "./Stream.js";
export default class ReadStreamBase extends Stream {
    constructor() {
        super(true, false);
    }
    async pipe(out) {
        const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);
        let i = 0;
        let len = 0;
        while ((i = await this.readBuf(buffer, 0, 8192)) >= 0) {
            await out.writeBuf(buffer, 0, i);
            await out.flush();
            len += i;
        }
        return len;
    }
}
