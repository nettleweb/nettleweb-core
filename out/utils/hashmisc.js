import { encodeUTF8 } from "../coder/Charset.js";
import { encodeHex } from "../coder/Hex.js";
import HashStream from "../hash/HashStream.js";
import HmacSha1Stream from "../hash/HmacSha1Stream.js";
import HmacSha256Stream from "../hash/HmacSha256Stream.js";
import Sha1Stream from "../hash/Sha1Stream.js";
import Sha256Stream from "../hash/Sha256Stream.js";
export function sha1(data) {
    if (typeof data === "string")
        data = encodeUTF8(data);
    return encodeHex(new Sha1Stream().update(data).hash());
}
export function sha256(data) {
    if (typeof data === "string")
        data = encodeUTF8(data);
    return encodeHex(new Sha256Stream().update(data).hash());
}
export function cyrb128(data) {
    if (typeof data === "string")
        data = encodeUTF8(data);
    return encodeHex(new HashStream().update(data).hash());
}
export function hmac_sha1(key, data) {
    return new HmacSha1Stream(key).update(data).hash();
}
export function hmac_sha256(key, data) {
    return new HmacSha256Stream(key).update(data).hash();
}
