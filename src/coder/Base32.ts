import { Array, ceil, freeze, Uint8Array } from "../misc/intrinsics.js";
import { emptyBuffer } from "../misc/misc.js";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const lookup = new Uint8Array(256);

for (let i = 0; i < 32; i++) {
	const code = chars.charCodeAt(i);
	lookup[code] = i;
	lookup[code + 32] = i; // Case-insensitive handling
}

export function encodeBase32(data: NettleWeb.BufferView): string {
	const len = data.length;
	if (len === 0)
		return "";

	const outLen = ceil(len / 5) * 8;
	const out = new Array<string>(outLen).fill("=");

	let i = 0;
	let j = 0;
	const mainEnd = len - (len % 5);

	// Main 5-byte -> 8-char loop
	while (i < mainEnd) {
		const b0 = data[i++];
		const b1 = data[i++];
		const b2 = data[i++];
		const b3 = data[i++];
		const b4 = data[i++];

		out[j++] = chars[b0 >> 3];
		out[j++] = chars[((b0 & 0x07) << 2) | (b1 >> 6)];
		out[j++] = chars[(b1 >> 1) & 0x1f];
		out[j++] = chars[((b1 & 0x01) << 4) | (b2 >> 4)];
		out[j++] = chars[((b2 & 0x0f) << 1) | (b3 >> 7)];
		out[j++] = chars[(b3 >> 2) & 0x1f];
		out[j++] = chars[((b3 & 0x03) << 3) | (b4 >> 5)];
		out[j++] = chars[b4 & 0x1f];
	}

	const rem = len - mainEnd;
	if (rem > 0) {
		const b0 = data[i++];
		out[j++] = chars[b0 >> 3];
		if (rem === 1) {
			out[j++] = chars[(b0 & 0x07) << 2];
		} else {
			const b1 = data[i++];
			out[j++] = chars[((b0 & 0x07) << 2) | (b1 >> 6)];
			out[j++] = chars[(b1 >> 1) & 0x1f];
			if (rem === 2) {
				out[j++] = chars[(b1 & 0x01) << 4];
			} else {
				const b2 = data[i++];
				out[j++] = chars[((b1 & 0x01) << 4) | (b2 >> 4)];
				if (rem === 3) {
					out[j++] = chars[(b2 & 0x0f) << 1];
				} else {
					const b3 = data[i];
					out[j++] = chars[((b2 & 0x0f) << 1) | (b3 >> 7)];
					out[j++] = chars[(b3 >> 2) & 0x1f];
					out[j++] = chars[(b3 & 0x03) << 3];
				}
			}
		}
	}

	return out.join("");
}

export function decodeBase32(data: string): NettleWeb.Buffer {
	let end = data.length;

	// skip paddings
	while (end > 0 && data.charCodeAt(end - 1) === 61)
		end--;
	if (end === 0)
		return emptyBuffer;

	const outLen = (end * 5 / 8) >>> 0;
	const out = new Uint8Array(outLen);

	let buffer = 0;
	let bits = 0;
	let j = 0;

	for (let i = 0; i < end; i++) {
		const val = lookup[data.charCodeAt(i)];
		buffer = (buffer << 5) | val;
		bits += 5;

		if (bits >= 8) {
			bits -= 8;
			out[j++] = (buffer >>> bits) & 0xff;
		}
	}

	return out;
}

const Base32: _NullProto<typeof NettleWeb.Base32> = {
	__proto__: null,
	encode: encodeBase32,
	decode: decodeBase32
};
export default freeze(Base32);
