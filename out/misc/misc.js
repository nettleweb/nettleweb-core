export const STUB_FUNC = () => {
    throw new Error("Function not implemented!");
};
export const emptyBuffer = new Uint8Array(new ArrayBuffer(0), 0, 0);
export function initCounter(state) {
    if (state == null) {
        const arr = new Array(16);
        arr[15] = 1;
        return arr;
    }
    else if (typeof state === "number") {
        let value = state;
        const arr = new Array(16);
        for (let i = 15; i >= 0; --i) {
            arr[i] = value % 256;
            value = Math.floor(value / 256);
        }
        return arr;
    }
    else {
        const arr = Array.from(state);
        if (arr.length !== 16)
            throw new Error("Counter state must have a length of 16.");
        return arr;
    }
}
export function incrCounter(counter) {
    for (let i = 15; i >= 0; i--) {
        if (counter[i] < 255) {
            counter[i]++;
            break;
        }
        else
            counter[i] = 0;
    }
}
export function isArrayBuffer(obj) {
    try {
        new DataView(obj, 0, 0);
        return true;
    }
    catch (err) {
        return false;
    }
}
export function bufferFrom(data, mapFn) {
    if (data == null || typeof data !== "object")
        throw new Error("INvalid buffer source");
    if (isArrayBuffer(data)) {
        const buf = new Uint8Array(data);
        if (mapFn != null) {
            for (let i = 0; i < buf.byteLength; i++)
                buf[i] = mapFn(buf[i], i);
        }
        return buf;
    }
    else if (ArrayBuffer.isView(data)) {
        const buf = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        if (mapFn != null) {
            for (let i = 0; i < buf.byteLength; i++)
                buf[i] = mapFn(buf[i], i);
        }
        return buf;
    }
    else
        return Uint8Array.from(data, mapFn || void 0);
}
export function bufferConcat(data, length) {
    if (data == null || typeof data !== "object")
        throw new Error("Invalid buffer data");
    if (!Array.isArray(data))
        data = Array.from(data);
    if (typeof length !== "number" || length < 0) {
        length = 0;
        for (const { byteLength } of data)
            length += byteLength;
    }
    const buffer = new Uint8Array(length);
    let offset = 0;
    for (const e of data) {
        const len = e.byteLength;
        buffer.set("length" in e ? e : new Uint8Array("buffer" in e ? e.buffer : e, e.byteOffset || 0, len), offset);
        offset += len;
    }
    return buffer;
}
export function seedgen() {
    return Math.floor(Math.random() * 4294967296);
}
export function seedgen128() {
    return [seedgen(), seedgen(), seedgen(), seedgen()];
}
export function seedgen256() {
    const seed = new Array(16);
    for (let i = 0, p = 0; i < 4; i++) {
        const rand = seedgen();
        seed[p++] = rand & 0xff;
        seed[p++] = (rand >> 8) & 0xff;
        seed[p++] = (rand >> 16) & 0xff;
        seed[p++] = (rand >> 24) & 0xff;
    }
    return seed;
}
