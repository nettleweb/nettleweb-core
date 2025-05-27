const Hex: typeof NettleWeb.Hex = {
	encode: (data: NettleWeb.BufferView) => {
		const length = data.length;
		const hex = new Array(length);

		for (let i = 0; i < length; i++)
			hex[i] = data[i].toString(16).padStart(2, "0");

		return hex.join("");
	},
	decode: (data: string) => {
		const length = Math.floor(data.length / 2);
		const buffer = new Uint8Array(length);

		for (let i = 0, p = 0; i < length; i++)
			buffer[i] = parseInt(data.slice(p, p += 2), 16);

		return buffer;
	}
};

export default Object.freeze(Object.setPrototypeOf(Hex, null));