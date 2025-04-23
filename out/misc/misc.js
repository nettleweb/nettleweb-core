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
export function isBuffer(obj) {
    return ArrayBuffer.isView(obj) && obj[Symbol.toStringTag] === "Uint8Array";
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
