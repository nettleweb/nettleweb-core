import { decodeUTF8, encodeUTF8 } from "../coder/Charset.js";
import { DataView, Error, freeze, getProps, isArray, isArrayBuffer, isArrayBufferView, isSafeInteger, isUint8Array, Uint32Array, Uint8Array } from "../misc/intrinsics.js";

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

// Reusable memory pools for encoding
let e_buf = new Uint8Array(1024);
let e_view = new DataView(e_buf.buffer);

let es_keys: any[] = [];
let es_target: any[] = [];
let es_isobject = new Uint8Array(32);
let es_length = new Uint32Array(32);
let es_index = new Uint32Array(32);

// Reusable memory pools for decoding
let decodeInUse = false;
let ds_target: any[] = [];
let ds_isobject = new Uint8Array(32);
let ds_length = new Uint32Array(32);
let ds_index = new Uint32Array(32);

function growEncodeStack() {
	const n_cap = es_length.length * 2;

	const n_isobject = new Uint8Array(n_cap);
	n_isobject.set(es_isobject);
	es_isobject = n_isobject;

	const n_length = new Uint32Array(n_cap);
	n_length.set(es_length);
	es_length = n_length;

	const n_index = new Uint32Array(n_cap);
	n_index.set(es_index);
	es_index = n_index;
}

function growDecodeStack() {
	const n_cap = ds_length.length * 2;

	const n_isobject = new Uint8Array(n_cap);
	n_isobject.set(ds_isobject);
	ds_isobject = n_isobject;

	const newLength = new Uint32Array(n_cap);
	newLength.set(ds_length);
	ds_length = newLength;

	const newIndex = new Uint32Array(n_cap);
	newIndex.set(ds_index);
	ds_index = newIndex;
}

function ensureEncodeCap(offset: number, needed: number) {
	const cur_cap = e_buf.length;
	const min_cap = offset + needed;

	if (min_cap > cur_cap) {
		let new_cap = cur_cap * 2;
		if (new_cap < min_cap)
			new_cap = min_cap;

		const nbuf = new Uint8Array(new_cap);
		nbuf.set(e_buf);
		e_buf = nbuf;
		e_view = new DataView(nbuf.buffer);
	}
}

function encodeNTON(value: any): NettleWeb.Buffer {
	e_buf[0] = 0x80; e_buf[1] = 0x63; e_buf[2] = 0x62;
	e_buf[3] = 0x6a; e_buf[4] = 0x66; e_buf[5] = 0x02;

	let val = value;
	let hasVal = true;
	let depth = 0;
	let off = 6;

	while (hasVal || depth > 0) {
		if (hasVal) {
			hasVal = false;
			switch (typeof val) {
				case "undefined":
					ensureEncodeCap(off, 1);
					e_buf[off++] = DataID.Void;
					break;
				case "boolean":
					ensureEncodeCap(off, 1);
					e_buf[off++] = val ? DataID.True : DataID.False;
					break;
				case "string": {
					const buf = encodeUTF8(val);
					const len = buf.length;
					ensureEncodeCap(off, 5 + len);
					e_buf[off++] = DataID.string;
					e_buf[off++] = len & 0xff;
					e_buf[off++] = (len >> 8) & 0xff;
					e_buf[off++] = (len >> 16) & 0xff;
					e_buf[off++] = (len >> 24) & 0xff;
					e_buf.set(buf, off);
					off += len;
					break;
				}
				case "number": {
					if (isSafeInteger(val)) {
						if (val >= 0) {
							if (val < 0x100) {
								ensureEncodeCap(off, 2);
								e_buf[off++] = DataID.uint8;
								e_buf[off++] = val;
								break;
							}
							if (val < 0x1_0000) {
								ensureEncodeCap(off, 3);
								e_buf[off++] = DataID.uint16;
								e_buf[off++] = val & 0xff;
								e_buf[off++] = (val >> 8) & 0xff;
								break;
							}
							if (val < 0x1_0000_0000) {
								ensureEncodeCap(off, 5);
								e_buf[off++] = DataID.uint32;
								e_buf[off++] = val & 0xff;
								e_buf[off++] = (val >> 8) & 0xff;
								e_buf[off++] = (val >> 16) & 0xff;
								e_buf[off++] = (val >> 24) & 0xff;
								break;
							}
						} else {
							if (val >= -0x80) {
								ensureEncodeCap(off, 2);
								e_buf[off++] = DataID.int8;
								e_buf[off++] = val;
								break;
							}
							if (val >= -0x8000) {
								ensureEncodeCap(off, 3);
								e_buf[off++] = DataID.int16;
								e_buf[off++] = val & 0xff;
								e_buf[off++] = (val >> 8) & 0xff;
								break;
							}
							if (val >= -0x8000_0000) {
								ensureEncodeCap(off, 5);
								e_buf[off++] = val & 0xff;
								e_buf[off++] = (val >> 8) & 0xff;
								e_buf[off++] = (val >> 16) & 0xff;
								e_buf[off++] = (val >> 24) & 0xff;
								break;
							}
						}
					}

					ensureEncodeCap(off, 9);
					e_buf[off++] = DataID.float64;
					e_view.setFloat64(off, val, true);
					off += 8;
					break;
				}
				case "bigint": {
					ensureEncodeCap(off, 9);
					if (val >= 0n) {
						e_buf[off++] = DataID.uint64;
						e_view.setBigUint64(off, val, true);
					} else {
						e_buf[off++] = DataID.int64;
						e_view.setBigInt64(off, val, true);
					}
					off += 8;
					break;
				}
				case "object": {
					if (val === null) {
						ensureEncodeCap(off, 1);
						e_buf[off++] = DataID.Null;
					} else if (isArray(val)) {
						const len = val.length;
						ensureEncodeCap(off, 5);
						e_buf[off++] = DataID.array;
						e_buf[off++] = len & 0xff;
						e_buf[off++] = (len >> 8) & 0xff;
						e_buf[off++] = (len >> 16) & 0xff;
						e_buf[off++] = (len >> 24) & 0xff;

						if (len > 0) {
							if (depth >= es_length.length)
								growEncodeStack();

							es_keys[depth] = null;
							es_target[depth] = val;
							es_isobject[depth] = 0;
							es_length[depth] = len;
							es_index[depth] = 0;
							depth++;
						}
					} else if (isArrayBufferView(val)) {
						if (!isUint8Array(val))
							val = new Uint8Array(val.buffer, val.byteOffset, val.byteLength);

						const len = val.length;
						ensureEncodeCap(off, 5 + len);
						e_buf[off++] = DataID.binary;
						e_buf[off++] = len & 0xff;
						e_buf[off++] = (len >> 8) & 0xff;
						e_buf[off++] = (len >> 16) & 0xff;
						e_buf[off++] = (len >> 24) & 0xff;
						e_buf.set(val, off);
						off += len;
					} else if (isArrayBuffer(val)) {
						const buf = new Uint8Array(val);
						const len = buf.length;
						ensureEncodeCap(off, 5 + len);
						e_buf[off++] = DataID.binary;
						e_buf[off++] = len & 0xff;
						e_buf[off++] = (len >> 8) & 0xff;
						e_buf[off++] = (len >> 16) & 0xff;
						e_buf[off++] = (len >> 24) & 0xff;
						e_buf.set(buf, off);
						off += len;
					} else {
						const keys = getProps(val);
						const len = keys.length;
						ensureEncodeCap(off, 5);

						e_buf[off++] = DataID.object;
						e_buf[off++] = len & 0xff;
						e_buf[off++] = (len >> 8) & 0xff;
						e_buf[off++] = (len >> 16) & 0xff;
						e_buf[off++] = (len >> 24) & 0xff;

						if (len > 0) {
							if (depth >= es_length.length)
								growEncodeStack();

							es_keys[depth] = keys;
							es_target[depth] = val;
							es_isobject[depth] = 1;
							es_length[depth] = len;
							es_index[depth] = 0;
							depth++;
						}
					}
					break;
				}
				default:
					throw new Error("Object contains non-serializable values.");
			}
		}

		while (depth > 0) {
			const top = depth - 1;
			const idx = es_index[top];

			if (idx < es_length[top]) {
				es_index[top] = idx + 1;
				if (es_isobject[top] === 1) {
					const key = es_keys[top][idx];
					const kBuf = encodeUTF8(key);
					const kLen = kBuf.length;

					ensureEncodeCap(off, 4 + kLen);
					e_buf[off++] = kLen & 0xff;
					e_buf[off++] = (kLen >> 8) & 0xff;
					e_buf[off++] = (kLen >> 16) & 0xff;
					e_buf[off++] = (kLen >> 24) & 0xff;
					e_buf.set(kBuf, off);
					off += kLen;
					val = es_target[top][key];
				} else val = es_target[top][idx];

				hasVal = true;
				break;
			} else {
				es_target[top] = null;
				es_keys[top] = null;
				depth--;
			}
		}
	}

	es_keys.length = 0;
	es_target.length = 0;
	return e_buf.slice(0, off);
}

function decodeNTON(data: NettleWeb.Buffer): any {
	if (data.length < 6 || data[0] !== 0x80 || data[1] !== 0x63 || data[2] !== 0x62 ||
		data[3] !== 0x6a || data[4] !== 0x66 || data[5] !== 0x02) {
		throw new Error("Parse Error: Invalid magic value");
	}

	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	const virtualRoot = [null];

	ds_target[0] = virtualRoot;
	ds_isobject[0] = 0;
	ds_length[0] = 1;
	ds_index[0] = 0;
	let depth = 1;
	let off = 6;

	while (depth > 0) {
		const top = depth - 1;
		let key: string;
		let idx: number;

		if (ds_isobject[top] === 1) {
			const kLen = ((data[off++] & 0xff) | ((data[off++] & 0xff) << 8) | ((data[off++] & 0xff) << 16) | ((data[off++] & 0xff) << 24)) >>> 0;
			key = decodeUTF8(data.subarray(off, off + kLen));
			off += kLen;
			ds_index[top]++;
		} else idx = ds_index[top]++;

		const id = data[off++];
		let val;

		switch (id) {
			case DataID.Void:
				break;
			case DataID.Null:
				val = null;
				break;
			case DataID.True:
				val = true;
				break;
			case DataID.False:
				val = false;
				break;
			case DataID.uint8:
				val = data[off++];
				break;
			case DataID.uint16:
				val = view.getUint16(off, true);
				off += 2;
				break;
			case DataID.uint32:
				val = view.getUint32(off, true);
				off += 4;
				break;
			case DataID.uint64:
				val = view.getBigUint64(off, true);
				off += 8;
				break;
			case DataID.int8:
				val = view.getInt8(off++);
				break;
			case DataID.int16:
				val = view.getInt16(off, true);
				off += 2;
				break;
			case DataID.int32:
				val = view.getInt32(off, true);
				off += 4;
				break;
			case DataID.int64:
				val = view.getBigInt64(off, true);
				off += 8;
				break;
			case DataID.float32:
				val = view.getFloat32(off, true);
				off += 4;
				break;
			case DataID.float64:
				val = view.getFloat64(off, true);
				off += 8;
				break;
			case DataID.string: {
				const length = view.getUint32(off, true);
				off += 4;
				val = decodeUTF8(data.subarray(off, off + length));
				off += length;
				break;
			}
			case DataID.binary: {
				const length = view.getUint32(off, true);
				off += 4;
				val = data.subarray(off, off + length);
				off += length;
				break;
			}
			case DataID.array: {
				const length = view.getUint32(off, true);
				off += 4;

				const child = new Array(length);
				if (ds_isobject[top] === 1)
					ds_target[top][key!] = child;
				else
					ds_target[top][idx!] = child;

				if (length > 0) {
					if (depth >= ds_length.length)
						growDecodeStack();

					ds_target[depth] = child;
					ds_isobject[depth] = 0;
					ds_index[depth] = 0;
					ds_length[depth] = length;
					depth++;
				}

				while (depth > 0 && ds_index[depth - 1] === ds_length[depth - 1]) {
					depth--;
					ds_target[depth] = null;
				}

				continue;
			}
			case DataID.object: {
				const length = view.getUint32(off, true);
				off += 4;
				const child = { __proto__: null };
				if (ds_isobject[top] === 1)
					ds_target[top][key!] = child;
				else
					ds_target[top][idx!] = child;

				if (length > 0) {
					if (depth >= ds_length.length)
						growDecodeStack();

					ds_target[depth] = child;
					ds_isobject[depth] = 1;
					ds_index[depth] = 0;
					ds_length[depth] = length;
					depth++;
				}

				while (depth > 0 && ds_index[depth - 1] === ds_length[depth - 1]) {
					depth--;
					ds_target[depth] = null;
				}

				continue;
			}
			default:
				throw new Error("Parse Error: Invalid data ID: " + id);
		}

		if (ds_isobject[top] === 1)
			ds_target[top][key!] = val;
		else
			ds_target[top][idx!] = val;

		while (depth > 0 && ds_index[depth - 1] === ds_length[depth - 1]) {
			depth--;
			ds_target[depth] = null;
		}
	}

	ds_target.length = 0;
	return virtualRoot[0];
}

const NTON: _NullProto<typeof NettleWeb.NTON> = {
	__proto__: null,
	encode: encodeNTON,
	decode: decodeNTON
};
export default freeze(NTON);
