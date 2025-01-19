const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const Base32: typeof NettleWeb.Base32 = {
	encode: (data) => {
		let out: string = "";
		let buf: number = 0;
		let bits: number = 0;

		for (let i = 0; i < data.length; i++) {
			buf = (buf << 8) | data[i];
			bits += 8;

			while (bits >= 5) {
				const index = (buf >> (bits - 5)) & 31;
				out += chars[index];
				bits -= 5;
			}
		}

		if (bits > 0)
			out += chars[(buf << (5 - bits)) & 31];
		while (out.length % 8 !== 0)
			out += "=";

		return out;
	},
	decode: (text) => {
		text = text.replace(/=+$/, "");

		const out: number[] = [];
		let buf: number = 0;
		let bits: number = 0;

		for (let i = 0; i < text.length; i++) {
			const index = chars.indexOf(text[i].toUpperCase());
			if (index < 0)
				throw new Error("Invalid character found in Base32 string.");

			buf = (buf << 5) | index;
			bits += 5;

			if (bits >= 8) {
				out.push((buf >> (bits - 8)) & 255);
				bits -= 8;
			}
		}

		return Uint8Array.from(out);
	}
};

export default Object.freeze(Object.setPrototypeOf(Base32, null));