import { Array, ceil, floor, freeze, Uint8Array } from "../misc/intrinsics.js";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const lookup = new Uint8Array(256);

for (let i = 0; i < 26; i++)
	lookup[65 + i] = i; // A-Z
for (let i = 0; i < 26; i++)
	lookup[97 + i] = i; // a-z
for (let i = 0; i < 6; i++)
	lookup[50 + i] = 26 + i; // 0-9

const Base32: _NullProto<typeof NettleWeb.Base32> = {
	__proto__: null,

	encode: (data: NettleWeb.BufferView) => {
		const length = data.length;
		if (length === 0)
			return "";

		const output = new Array(ceil(length / 5) * 8);
		let blockCount = floor(length / 5);
		let i = 0, j = 0;

		while (blockCount-- > 0) {
			const b0 = data[i++];
			const b1 = data[i++];
			const b2 = data[i++];
			const b3 = data[i++];
			const b4 = data[i++];

			output[j++] = chars[b0 >>> 3];
			output[j++] = chars[((b0 & 0x07) << 2) | (b1 >>> 6)];
			output[j++] = chars[(b1 >>> 1) & 0x1F];
			output[j++] = chars[((b1 & 0x01) << 4) | (b2 >>> 4)];
			output[j++] = chars[((b2 & 0x0F) << 1) | (b3 >>> 7)];
			output[j++] = chars[(b3 >>> 2) & 0x1F];
			output[j++] = chars[((b3 & 0x03) << 3) | (b4 >>> 5)];
			output[j++] = chars[b4 & 0x1F];
		}

		const remaining = length % 5;
		if (remaining > 0) {
			const b0 = data[i++];
			const b1 = remaining > 1 ? data[i++] : 0;
			const b2 = remaining > 2 ? data[i++] : 0;
			const b3 = remaining > 3 ? data[i++] : 0;

			output[j++] = chars[b0 >>> 3];
			output[j++] = chars[((b0 & 0x07) << 2) | (b1 >>> 6)];
			output[j++] = remaining > 1 ? chars[(b1 >>> 1) & 0x1F] : "=";
			output[j++] = remaining > 1 ? chars[((b1 & 0x01) << 4) | (b2 >>> 4)] : "=";
			output[j++] = remaining > 2 ? chars[((b2 & 0x0F) << 1) | (remaining > 3 ? (b3 >>> 7) : 0)] : "=";
			output[j++] = remaining > 3 ? chars[(b3 >>> 2) & 0x1F] : "=";
			output[j++] = remaining > 3 ? chars[((b3 & 0x03) << 3) | 0] : "=";
			output[j++] = "=";
		}

		return output.join("");
	},
	decode: (data: string) => {
		const length = data.length;
		let n = 0;
		let padStart = length;

		for (let i = 0; i < length; i++) {
			const code = data.charCodeAt(i);
			if (code === 61) {
				padStart = i;
				break;
			}

			if (lookup[code] !== 0xFF)
				n++;
		}

		const output = new Uint8Array((n * 5) >>> 3);
		let buffer = 0;
		let bits = 0;
		let index = 0;

		for (let i = 0; i < padStart; i++) {
			const code = data.charCodeAt(i);
			const val = lookup[code];

			if (val === 0xFF)
				continue;

			buffer = (buffer << 5) | val;
			bits += 5;

			if (bits >= 8) {
				bits -= 8;
				output[index++] = (buffer >>> bits) & 0xFF;
			}
		}

		return output;
	}
};

export default freeze(Base32);
