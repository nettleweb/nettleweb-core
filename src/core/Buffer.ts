import { emptyBuffer, isArrayBuffer, isBuffer } from "../misc/misc.js";

const Buffer: typeof NettleWeb.Buffer = Object.setPrototypeOf(function __struct__() {
	return Reflect.construct(Uint8Array, arguments as any, Buffer);
}, null);

const BufferProto = Object.freeze(Object.create(null, {
	[Symbol.toStringTag]: {
		value: "Buffer",
		writable: false,
		enumerable: false,
		configurable: false
	}
}));

Object.defineProperty(Buffer, "from", {
	value: (data: NettleWeb.BufferSource) => {
		if (data == null || typeof data !== "object")
			throw new Error("Invalid buffer source");

		if (isBuffer(data))
			return data;
		else if (isArrayBuffer(data))
			return new Uint8Array(data);
		else if (ArrayBuffer.isView(data))
			return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
		else
			return Uint8Array.from(data as any);
	},
	writable: false,
	enumerable: false,
	configurable: false
});
Object.defineProperty(Buffer, "concat", {
	value: (data: NettleWeb.BufferBytes[], length?: number | nul) => {
		if (data == null || typeof data !== "object")
			throw new Error("Invalid sources");
		if (!Array.isArray(data))
			data = Array.from(data);

		if (typeof length !== "number") {
			length = 0;

			for (const { byteLength: len } of data) {
				if (!Number.isSafeInteger(len) || len < 0)
					throw new Error("Invalid buffer object");

				length += len;
			}
		}

		const buffer = new Uint8Array(length);
		let offset: number = 0;

		for (const e of data) {
			const length = e.byteLength;
			buffer.set("length" in e ? e : new Uint8Array("buffer" in e ? e.buffer : e, 0, length), offset += length);
		}

		return buffer;
	}
});
Object.defineProperty(Buffer, "prototype", {
	value: BufferProto,
	writable: false,
	enumerable: false,
	configurable: false
});
Object.defineProperty(Buffer, "emptyBuffer", {
	value: emptyBuffer,
	writable: false,
	enumerable: false,
	configurable: false
});
Object.defineProperty(Buffer, "isArrayBuffer", {
	value: isArrayBuffer,
	writable: false,
	enumerable: false,
	configurable: false
});
Object.defineProperty(Buffer, Symbol.hasInstance, {
	value: isBuffer,
	writable: false,
	enumerable: false,
	configurable: false
});

export default Object.freeze(Buffer);