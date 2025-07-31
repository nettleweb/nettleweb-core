import HashStream from "../hash/HashStream.js";
import { encodeHex, encodeUTF8 } from "../misc/misc.js";
export default function cyrb128(data) {
    const stream = new HashStream();
    if (typeof data === "string")
        data = encodeUTF8(data);
    stream._write(data);
    return encodeHex(stream.hash());
}
