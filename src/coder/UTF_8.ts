const UTF_8: typeof NettleWeb.UTF_8 = {
	encode: (data) => {
		const bytes: number[] = [];

		for (const ch of Array.from(data, (v) => v.codePointAt(0) || 0xfffd)) {
			if (ch < 0x80)
				bytes.push(ch);
			else if (ch < 0x800)
				bytes.push((ch >> 6) | 0xc0, (ch & 0x3f) | 0x80);
			else if (ch < 0x10000)
				bytes.push((ch >> 12) | 0xe0, ((ch >> 6) & 0x3f) | 0x80, (ch & 0x3f) | 0x80);
			else
				bytes.push((ch >> 18) | 0xf0, ((ch >> 12) & 0x3f) | 0x80, ((ch >> 6) & 0x3f) | 0x80, (ch & 0x3f) | 0x80);
		}

		return Uint8Array.from(bytes);
	},
	decode: (data) => {
		const len = data.byteLength;
		let str: string = "";

		for (let i = 0; i < len;) {
			const b1 = data[i++];

			if ((b1 & 0x80) === 0)
				str += String.fromCharCode(b1);
			else if ((b1 & 0xe0) === 0xc0)
				str += String.fromCharCode(((b1 & 0x1f) << 6) | (data[i++] & 0x3f));
			else if ((b1 & 0xf0) === 0xe0)
				str += String.fromCharCode(((b1 & 0x0f) << 12) | ((data[i++] & 0x3f) << 6) | (data[i++] & 0x3f));
			else if ((b1 & 0xf8) === 0xf0) {
				const cp = ((b1 & 0x07) << 18) | ((data[i++] & 0x3f) << 12) | ((data[i++] & 0x3f) << 6) | (data[i++] & 0x3f);
				str += cp > 0x10ffff ? "\ufffd" : String.fromCodePoint(cp);
			} else str += "\ufffd";
		}

		return str;
	}
};

export default Object.freeze(Object.setPrototypeOf(UTF_8, null));