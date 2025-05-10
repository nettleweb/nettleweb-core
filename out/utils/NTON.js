import { UTF_8 } from "../coder/Charset.js";
import { isArrayBuffer } from "../misc/misc.js";
function encodeRaw(data, value, offset) {
    switch (typeof value) {
        case "undefined":
            data.push(0 /* DataID.Void */);
            offset++;
            break;
        case "boolean":
            data.push(value ? 1 /* DataID.True */ : 2 /* DataID.False */);
            offset++;
            break;
        case "string":
            {
                const buffer = UTF_8.encode(value);
                const length = buffer.byteLength;
                data.push(101 /* DataID.string */, length & 0xff, (length >> 8) & 0xff, (length >> 16) & 0xff, (length >> 24) & 0xff, buffer);
                offset += length + 5;
            }
            break;
        case "number":
            {
                if (Number.isSafeInteger(value)) {
                    if (value >= 0) {
                        if (value < 0x100) {
                            data.push(10 /* DataID.uint8 */, value);
                            return offset += 2;
                        }
                        if (value < 0x1_0000) {
                            data.push(11 /* DataID.uint16 */, value & 0xff, (value >> 8) & 0xff);
                            return offset += 3;
                        }
                        if (value < 0x1_0000_0000) {
                            data.push(12 /* DataID.uint32 */, value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
                            return offset += 5;
                        }
                    }
                    else {
                        if (value >= -0x80 && value < 0x80) {
                            data.push(20 /* DataID.int8 */, value);
                            return offset += 2;
                        }
                        if (value >= -0x8000 && value < 0x8000) {
                            data.push(21 /* DataID.int16 */, value & 0xff, (value >> 8) & 0xff);
                            return offset += 3;
                        }
                        if (value >= -0x8000_0000 && value < 0x8000_0000) {
                            data.push(22 /* DataID.int32 */, value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
                            return offset += 5;
                        }
                    }
                }
                data.push(33 /* DataID.float64 */);
                const buffer = new ArrayBuffer(8);
                new DataView(buffer, 0, 8).setFloat64(0, value, true);
                data.push(new Uint8Array(buffer, 0, 8));
                offset += 9;
            }
            break;
        case "bigint":
            data.push(value >= 0n ? 13 /* DataID.uint64 */ : 23 /* DataID.int64 */, Number(value & 0xffn), Number((value >> 8n) & 0xffn), Number((value >> 16n) & 0xffn), Number((value >> 24n) & 0xffn), Number((value >> 32n) & 0xffn), Number((value >> 40n) & 0xffn), Number((value >> 48n) & 0xffn), Number((value >> 56n) & 0xffn));
            offset += 9;
            break;
        case "object":
            if (value === null) {
                data.push(255 /* DataID.Null */);
                offset++;
            }
            else if (Array.isArray(value)) {
                const length = value.length;
                data.push(99 /* DataID.array */, length & 0xff, (length >> 8) & 0xff, (length >> 16) & 0xff, (length >> 24) & 0xff);
                offset += 5;
                for (const e of value)
                    offset = encodeRaw(data, e, offset);
            }
            else if (ArrayBuffer.isView(value)) {
                const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
                const length = buffer.byteLength;
                data.push(102 /* DataID.binary */, length & 0xff, (length >> 8) & 0xff, (length >> 16) & 0xff, (length >> 24) & 0xff, buffer);
                offset += length + 5;
            }
            else if (isArrayBuffer(value)) {
                const buffer = new Uint8Array(value);
                const length = buffer.byteLength;
                data.push(102 /* DataID.binary */, length & 0xff, (length >> 8) & 0xff, (length >> 16) & 0xff, (length >> 24) & 0xff, buffer);
                offset += length + 5;
            }
            else {
                const keys = Object.keys(value);
                const len = keys.length;
                data.push(100 /* DataID.object */, len & 0xff, (len >> 8) & 0xff, (len >> 16) & 0xff, (len >> 24) & 0xff);
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
                            break;
                        default:
                            continue; // ignore
                    }
                    const buffer = UTF_8.encode(k);
                    const length = buffer.byteLength;
                    data.push(length & 0xff, (length >> 8) & 0xff, (length >> 16) & 0xff, (length >> 24) & 0xff, buffer);
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
const NTON = {
    isNTON: (data) => data.length > 6 && data[0] === 0x80 && data[1] === 0x63 && data[2] === 0x62 && data[3] === 0x6a && data[4] === 0x66 && data[5] === 0x02,
    encode: (value) => {
        const data = [0x80, 0x63, 0x62, 0x6a, 0x66, 0x02];
        const buffer = new Uint8Array(encodeRaw(data, value, 6));
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
    decode: (data) => {
        if (data[0] !== 0x80 || data[1] !== 0x63 || data[2] !== 0x62 ||
            data[3] !== 0x6a || data[4] !== 0x66 || data[5] !== 0x02)
            throw new Error("Parse Error: Invalid magic value");
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        let offset = 6;
        const decode = () => {
            const id = data[offset++];
            switch (id) {
                case 0 /* DataID.Void */:
                    return;
                case 255 /* DataID.Null */:
                    return null;
                case 1 /* DataID.True */:
                    return true;
                case 2 /* DataID.False */:
                    return false;
                case 20 /* DataID.int8 */:
                    return data[offset++] << 24 >> 24;
                case 21 /* DataID.int16 */:
                    return ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8)) << 16 >> 16;
                case 22 /* DataID.int32 */:
                    return (data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24);
                case 23 /* DataID.int64 */:
                    return view.getBigInt64((offset += 8) - 8, true);
                case 10 /* DataID.uint8 */:
                    return data[offset++];
                case 11 /* DataID.uint16 */:
                    return (data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8);
                case 12 /* DataID.uint32 */:
                    return ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
                case 13 /* DataID.uint64 */:
                    return view.getBigUint64((offset += 8) - 8, true);
                case 32 /* DataID.float32 */:
                    return view.getFloat32((offset += 4) - 4, true);
                case 33 /* DataID.float64 */:
                    return view.getFloat64((offset += 8) - 8, true);
                case 99 /* DataID.array */:
                    {
                        const length = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
                        const array = new Array(length);
                        for (let i = 0; i < length; i++)
                            array[i] = decode();
                        return array;
                    }
                case 100 /* DataID.object */:
                    {
                        const length = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
                        const object = Object.create(null);
                        for (let i = 0; i < length; i++) {
                            const keyLength = ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0;
                            object[UTF_8.decode(data.subarray(offset, offset += keyLength))] = decode();
                        }
                        return object;
                    }
                case 102 /* DataID.binary */:
                    return data.subarray(offset, offset += ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0);
                case 101 /* DataID.string */:
                    return UTF_8.decode(data.subarray(offset, offset += ((data[offset++] & 0xff) | ((data[offset++] & 0xff) << 8) | ((data[offset++] & 0xff) << 16) | ((data[offset++] & 0xff) << 24)) >>> 0));
                default:
                    throw new Error("Parse Error: Invalid data ID: " + id);
            }
        };
        return decode();
    }
};
export default Object.freeze(Object.setPrototypeOf(NTON, null));
