import HmacSha256Stream from "../hash/HmacSha256Stream.js";

export default function hmac_sha256(key: NettleWeb.BufferView, data: NettleWeb.BufferView): number[] {
	const stream = new HmacSha256Stream(key);
	stream._write(data);
	return stream.hash();
}