const UTF32BE: typeof NettleWeb.UTF32BE = {
	encode: (data) => {
		const array = Array.from(data, (e) => e.codePointAt(0) || 0xfffd);
		const length = array.length * 4;
		const buffer = new ArrayBuffer(length);
		const dataView = new DataView(buffer, 0, length);

		for (let i = 0, p = 0; i < length; i += 4, p++)
			dataView.setUint32(i, array[p], false);

		return new Uint8Array(buffer, 0, length);
	},
	decode: (data) => {
		const length = Math.floor(data.byteLength / 4);
		const output = new Array<string>(length);
		const dataView = new DataView(data.buffer, data.byteOffset, length * 4);

		for (let i = 0, p = 0; p < length; i += 4, p++) {
			const code = dataView.getUint32(i, false);
			output[p] = code > 0x10ffff ? "\ufffd" : String.fromCodePoint(code);
		}

		return output.join("");
	}
};

export default Object.freeze(Object.setPrototypeOf(UTF32BE, null));