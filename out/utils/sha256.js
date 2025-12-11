import Sha256Stream from "../hash/Sha256Stream.js";
import { encodeHex, encodeUTF8 } from "../misc/misc.js";
export default function sha256(data) {
    const stream = new Sha256Stream();
    if (typeof data === "string")
        data = encodeUTF8(data);
    stream._write(data);
    return encodeHex(stream.hash());
}
