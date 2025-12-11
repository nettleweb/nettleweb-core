import { decodeUTF8, encodeUTF8, isArrayBuffer } from "../misc/misc.js";

const enum DataID {
	Void = 0,
	Null = 255,
	True = 1,
	False = 2,

	int8 = 20,
	int16 = 21,
	int32 = 22,
	int64 = 23,
	uint8 = 10,
	uint16 = 11,
	uint32 = 12,
	uint64 = 13,
	float32 = 32,
	float64 = 33,

	array = 99,
	object = 100,
	string = 101,
	binary = 102,
}

function encodeRaw(data: (number | Uint8Array)[], value: any, offset: number): number {
	switch (typeof value) {
		case "undefined":
			data.push(DataID.Void);
			offset++;
			break;
		case "boolean":
			data.push(value ? DataID.True : DataID.False);
			offset++;
			break;
		case "string":
			{
				const buffer = encodeUTF8(value);
				const length = buffer.byteLength;

				data.push(
					DataID.string,
					length & 0xff,
					(length >> 8) & 0xff,
					(length >> 16) & 0xff,
					(length >> 24) & 0xff,
					buffer
				);
				offset += length + 5;
			}
			break;
		case "number":
			{
				if (Number.isSafeInteger(value)) {
					if (value >= 0) {
						if (value < 0x100) {
							data.push(DataID.uint8, value);
							return offset += 2;
						}
						if (value < 0x1_0000) {
							data.push(DataID.uint16, value & 0xff, (value >> 8) & 0xff);
							return offset += 3;
						}
						if (value < 0x1_0000_0000) {
							data.push(DataID.uint32, value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
							return offset += 5;

						}
					} else {
						if (value >= -0x80 && value < 0x80) {
							data.push(DataID.int8, value);
							return offset += 2;
						}
						if (value >= -0x8000 && value < 0x8000) {
							data.push(DataID.int16, value & 0xff, (value >> 8) & 0xff);
							return offset += 3;
						}
						if (value >= -0x8000_0000 && value < 0x8000_0000) {
							data.push(DataID.int32, value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
							return offset += 5;
						}
					}
				}

				data.push(DataID.float64);
				const buffer = new ArrayBuffer(8);
				new DataView(buffer, 0, 8).setFloat64(0, value, true);
				data.push(new Uint8Array(buffer, 0, 8));
				offset += 9;
			}
			break;
		case "bigint":
			data.push(
				value >= 0n ? DataID.uint64 : DataID.int64,
				Number(value & 0xffn),
				Number((value >> 8n) & 0xffn),
				Number((value >> 16n) & 0xffn),
				Number((value >> 24n) & 0xffn),
				Number((value >> 32n) & 0xffn),
				Number((value >> 40n) & 0xffn),
				Number((value >> 48n) & 0xffn),
				Number((value >> 56n) & 0xffn)
			);
			offset += 9;
			break;
		case "object":
			if (value === null) {
				data.push(DataID.Null);
				offset++;
			} else if (Array.isArray(value)) {
				const length = value.length;
				data.push(
					DataID.array,
					length & 0xff,
					(length >> 8) & 0xff,
					(length >> 16) & 0xff,
					(length >> 24) & 0xff
				);
				offset += 5;

				for (const e of value)
					offset = encodeRaw(data, e, offset);
			} else if (ArrayBuffer.isView(value)) {
				const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
				const length = buffer.byteLength;

				data.push(
					DataID.binary,
					length & 0xff,
					(length >> 8) & 0xff,
					(length >> 16) & 0xff,
					(length >> 24) & 0xff,
					buffer
				);
				offset += length + 5;
			} else if (isArrayBuffer(value)) {
				const buffer = new Uint8Array(value);
				const length = buffer.byteLength;

				data.push(
					DataID.binary,
					length & 0xff,
					(length >> 8) & 0xff,
					(length >> 16) & 0xff,
					(length >> 24) & 0xff,
					buffer
				);
				offset += length + 5;
			} else {
				const keys = Object.keys(value);
				const len = keys.length;

				data.push(
					DataID.object,
					len & 0xff,
					(len >> 8) & 0xff,
					(len >> 16) & 0xff,
					(len >> 24) & 0xff
				);
				offset += 5;

				for (const k of keys) {
					const v = value[k];
					switch (typeof v) {
						case "bigint":
						case "number":
						case "object":
						case "string":
						case "boolean":
						case "undefined":
							break
						default:
							continue; // ignore
					}

					const buffer = encodeUTF8(k);
					const length = buffer.byteLength;

					data.push(
						length & 0xff,
						(length >> 8) & 0xff,
						(length >> 16) & 0xff,
						(length >> 24) & 0xff,
						buffer
					);
					offset += length + 4;
					offset = encodeRaw(data, v, offset);
				}
			}
			break;
		default: // ignore unsupported data types
			break;
	}

	return offset;
}

const NTON: typeof NettleWeb.NTON = {
	validate: (data: ArrayLike<number>) => data.length > 6 && data[0] === 0x80 && data[1] === 0x63 && data[2] === 0x62 && data[3] === 0x6a && data[4] === 0x66 && data[5] === 0x02,
	encode: (value) => {
		const data: (number | Uint8Array)[] = [0x80, 0x63, 0x62, 0x6a, 0x66, 0x02];
		const buffer = new Uint8Array(encodeRaw(data, value, 6));

		let offset: number = 0;
		for (const e of data) {
			if (typeof e !== "number") {
				buffer.set(e, offset);
				offset += e.byteLength;
			} else buffer[offset++] = e;
		}

		return buffer;
	},
	decode: (data: NettleWeb.Buffer) => {
		if (data[0] !== 0x80 || data[1] !== 0x63 || data[2] !== 0x62 ||
			data[3] !== 0x6a || data[4] !== 0x66 || data[5] !== 0x02)
			throw new Error("Parse Error: Invalid magic value");

		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
		let offset: number = 6;

		const decode = () => {
			const id: number = data[offset++];
			switch (id) {
				case DataID.Void:
					return;
				case DataID.Null:
					return null;
				case DataID.True:
					return true;
				case DataID.False:
					return false;
				case DataID.int8:
					return data[offset++] << 24 >> 24;
				case DataID.int16:
					return ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8)) << 16 >> 16;
				case DataID.int32:
					return (data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24);
				case DataID.int64:
					return view.getBigInt64((offset += 8) - 8, true);
				case DataID.uint8:
					return data[offset++];
				case DataID.uint16:
					return (data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8);
				case DataID.uint32:
					return ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
				case DataID.uint64:
					return view.getBigUint64((offset += 8) - 8, true);
				case DataID.float32:
					return view.getFloat32((offset += 4) - 4, true);
				case DataID.float64:
					return view.getFloat64((offset += 8) - 8, true);
				case DataID.array:
					{
						const length = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
						const array = new Array(length);

						for (let i = 0; i < length; i++)
							array[i] = decode();

						return array;
					}
				case DataID.object:
					{
						const length = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
						const object = Object.create(null);

						for (let i = 0; i < length; i++) {
							const keyLength = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
							object[decodeUTF8(data.subarray(offset, offset += keyLength))] = decode();
						}

						return object;
					}
				case DataID.binary: // DO NOT INLINE the length as there will break the offset
					{
						const length = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
						return data.subarray(offset, offset += length);
					}
				case DataID.string:
					{
						const length = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
						return decodeUTF8(data.subarray(offset, offset += length));
					}
				default:
					throw new Error("Parse Error: Invalid data ID: " + id);
			}
		};

		return decode();
	}
};

export default Object.freeze(Object.setPrototypeOf(NTON, null));
