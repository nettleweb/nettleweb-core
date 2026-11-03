import { Array, freeze, parseInt, Uint8Array } from "../misc/intrinsics.js";

export function encodeHex(data: NettleWeb.BufferView): string {
	const length = data.length;
	const hex = new Array(length);

	for (let i = 0; i < length; i++)
		hex[i] = data[i].toString(16).padStart(2, "0");

	return hex.join("");
}

export function decodeHex(data: string): NettleWeb.Buffer {
	const length = (data.length / 2) >>> 0;
	const buffer = new Uint8Array(length);

	for (let i = 0, p = 0; i < length; i++)
		buffer[i] = parseInt(data.slice(p, p += 2), 16);

	return buffer;
}

const Hex: _NullProto<typeof NettleWeb.Hex> = {
	__proto__: null,
	encode: encodeHex,
	decode: decodeHex
};

export default freeze(Hex);
