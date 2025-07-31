import Sha256Stream from "../hash/Sha256Stream.js";
import { encodeHex, encodeUTF8 } from "../misc/misc.js";

export default function sha256(data: string | NettleWeb.BufferView): string {
	const stream = new Sha256Stream();
	if (typeof data === "string")
		data = encodeUTF8(data);
	if (!(Symbol.iterator in data))
		data = Uint8Array.from(data);

	stream._write(data as any);
	return encodeHex(stream.hash());
}