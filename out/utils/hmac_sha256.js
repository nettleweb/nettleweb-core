import HmacSha256Stream from "../hash/HmacSha256Stream.js";
export default function hmac_sha256(key, data) {
    const stream = new HmacSha256Stream(key);
    stream._write(data);
    return stream.hash();
}
