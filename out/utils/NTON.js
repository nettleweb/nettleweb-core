/*! Simple NTON library based on https://github.com/ruochenjia/nton (MIT License) */
import UTF_8 from "../coder/UTF_8.js";
import { isArrayBuffer } from "../misc/misc.js";
const NTON = {
    encode: (value) => {
        const data = [Uint8Array.of(0x80, 0x63, 0x62, 0x6a, 0x66, 0x02)];
        let length = 6;
        const encode = (value) => {
            switch (typeof value) {
                case "undefined":
                    data.push(0 /* DataID.Void */);
                    length++;
                    break;
                case "boolean":
                    data.push(value ? 1 /* DataID.True */ : 2 /* DataID.False */);
                    length++;
                    break;
                case "string":
                    {
                        const buffer = UTF_8.encode(value);
                        const buflen = buffer.byteLength;
                        data.push(Uint8Array.of(101 /* DataID.string */, buflen & 0xff, (buflen >> 8) & 0xff, (buflen >> 16) & 0xff, (buflen >> 24) & 0xff), buffer);
                        length += buflen + 5;
                    }
                    break;
                case "number":
                    {
                        if (Number.isSafeInteger(value)) {
                            if (value >= 0) {
                                if (value < 0x100) {
                                    data.push(Uint8Array.of(10 /* DataID.uint8 */, value));
                                    length += 2;
                                    return;
                                }
                                if (value < 0x1_0000) {
                                    data.push(Uint8Array.of(11 /* DataID.uint16 */, value & 0xff, (value >> 8) & 0xff));
                                    length += 3;
                                    return;
                                }
                                if (value < 0x1_0000_0000) {
                                    data.push(Uint8Array.of(12 /* DataID.uint32 */, value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff));
                                    length += 5;
                                    return;
                                }
                            }
                            else {
                                if (value >= -0x80 && value < 0x80) {
                                    data.push(Uint8Array.of(20 /* DataID.int8 */, value));
                                    length += 2;
                                    return;
                                }
                                if (value >= -0x8000 && value < 0x8000) {
                                    data.push(Uint8Array.of(21 /* DataID.int16 */, value & 0xff, (value >> 8) & 0xff));
                                    length += 3;
                                    return;
                                }
                                if (value >= -0x8000_0000 && value < 0x8000_0000) {
                                    data.push(Uint8Array.of(22 /* DataID.int32 */, value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff));
                                    length += 5;
                                    return;
                                }
                            }
                        }
                        const buffer = new ArrayBuffer(9);
                        {
                            const view = new DataView(buffer, 0, 9);
                            view.setUint8(0, 33 /* DataID.float64 */);
                            view.setFloat64(1, value, true);
                        }
                        data.push(new Uint8Array(buffer, 0, 9));
                        length += 9;
                    }
                    break;
                case "bigint":
                    {
                        const buffer = new ArrayBuffer(9);
                        {
                            const view = new DataView(buffer, 0, 9);
                            if (value >= 0n) {
                                view.setUint8(0, 13 /* DataID.uint64 */);
                                view.setBigUint64(1, value, true);
                            }
                            else {
                                view.setUint8(0, 23 /* DataID.int64 */);
                                view.setBigInt64(1, value, true);
                            }
                        }
                        data.push(new Uint8Array(buffer, 0, 9));
                        length += 9;
                    }
                    break;
                case "object":
                    if (value === null) {
                        data.push(255 /* DataID.Null */);
                        length++;
                    }
                    else if (Array.isArray(value)) {
                        const len = value.length;
                        data.push(Uint8Array.of(99 /* DataID.array */, len & 0xff, (len >> 8) & 0xff, (len >> 16) & 0xff, (len >> 24) & 0xff));
                        length += 5;
                        for (const e of value)
                            encode(e);
                    }
                    else if (isArrayBuffer(value)) {
                        const buffer = new Uint8Array(value, 0, value.byteLength);
                        const buflen = buffer.byteLength;
                        data.push(Uint8Array.of(102 /* DataID.binary */, buflen & 0xff, (buflen >> 8) & 0xff, (buflen >> 16) & 0xff, (buflen >> 24) & 0xff), buffer);
                        length += buflen + 5;
                    }
                    else if (ArrayBuffer.isView(value)) {
                        const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
                        const buflen = buffer.byteLength;
                        data.push(Uint8Array.of(102 /* DataID.binary */, buflen & 0xff, (buflen >> 8) & 0xff, (buflen >> 16) & 0xff, (buflen >> 24) & 0xff), buffer);
                        length += buflen + 5;
                    }
                    else {
                        const keys = Object.keys(value);
                        const len = keys.length;
                        data.push(Uint8Array.of(100 /* DataID.object */, len & 0xff, (len >> 8) & 0xff, (len >> 16) & 0xff, (len >> 24) & 0xff));
                        length += 5;
                        for (const k of keys) {
                            const v = value[k];
                            switch (typeof v) {
                                case "bigint":
                                case "number":
                                case "object":
                                case "string":
                                case "boolean":
                                case "undefined":
                                    {
                                        const buffer = UTF_8.encode(k);
                                        const buflen = buffer.byteLength;
                                        data.push(Uint8Array.of(buflen & 0xff, (buflen >> 8) & 0xff, (buflen >> 16) & 0xff, (buflen >> 24) & 0xff), buffer);
                                        length += buflen + 4;
                                    }
                                    encode(v);
                                    break;
                                default:
                                    break; // ignore
                            }
                        }
                    }
                    break;
                default: // ignore unsupported data types
                    break;
            }
        };
        encode(value);
        const buffer = new Uint8Array(length);
        let offset = 0;
        for (const e of data) {
            if (typeof e !== "number") {
                buffer.set(e, offset);
                offset += e.byteLength;
            }
            else
                buffer[offset++] = e;
        }
        return buffer;
    },
    decode: (view) => {
        if (!ArrayBuffer.isView(view))
            throw new Error("invalid input value");
        if (view[0] !== 0x80 || view[1] !== 0x63 || view[2] !== 0x62 ||
            view[3] !== 0x6a || view[4] !== 0x66 || view[5] !== 0x02)
            throw new Error("Parse Error: Invalid magic value");
        const dataView = new DataView(view.buffer, view.byteOffset, view.byteLength);
        let index = 6;
        const uint32 = () => ((view[index++] & 0xff) | ((view[index++] & 0xff) << 8) | ((view[index++] & 0xff) << 16) | ((view[index++] & 0xff) << 24)) >>> 0;
        const decode = () => {
            const id = view[index++];
            switch (id) {
                case 0 /* DataID.Void */:
                    return;
                case 255 /* DataID.Null */:
                    return null;
                case 1 /* DataID.True */:
                    return true;
                case 2 /* DataID.False */:
                    return false;
                case 10 /* DataID.uint8 */:
                    return view[index++];
                case 11 /* DataID.uint16 */:
                    return (view[index++] & 0xff) | (view[index++] & 0xff) << 8;
                case 12 /* DataID.uint32 */:
                    return uint32();
                case 13 /* DataID.uint64 */:
                    return dataView.getBigUint64((index += 8) - 8, true);
                case 20 /* DataID.int8 */:
                    return view[index++] << 24 >> 24;
                case 21 /* DataID.int16 */:
                    return ((view[index++] & 0xff) | ((view[index++] & 0xff) << 8)) << 16 >> 16;
                case 22 /* DataID.int32 */:
                    return (view[index++] & 0xff) | ((view[index++] & 0xff) << 8) | ((view[index++] & 0xff) << 16) | ((view[index++] & 0xff) << 24);
                case 23 /* DataID.int64 */:
                    return dataView.getBigInt64((index += 8) - 8, true);
                case 32 /* DataID.float32 */:
                    return dataView.getFloat32((index += 4) - 4, true);
                case 33 /* DataID.float64 */:
                    return dataView.getFloat64((index += 8) - 8, true);
                case 99 /* DataID.array */:
                    {
                        const len = uint32();
                        const arr = new Array(len);
                        for (let i = 0; i < len; i++)
                            arr[i] = decode();
                        return arr;
                    }
                case 100 /* DataID.object */:
                    {
                        const len = uint32();
                        const obj = Object.create(null);
                        for (let i = 0; i < len; i++) {
                            const len = uint32();
                            obj[UTF_8.decode(view.subarray(index, index += len))] = decode();
                        }
                        return obj;
                    }
                case 102 /* DataID.binary */:
                    {
                        const len = uint32();
                        return view.subarray(index, index += len);
                    }
                case 101 /* DataID.string */:
                    {
                        const len = uint32();
                        return UTF_8.decode(view.subarray(index, index += len));
                    }
                default:
                    throw new Error("Parse Error: Invalid data ID: " + id);
            }
        };
        return decode();
    }
};
export default Object.freeze(Object.setPrototypeOf(NTON, null));
