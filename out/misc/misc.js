export const __THROW = Object.freeze((Object.setPrototypeOf(() => {
    throw __THROW;
}, null)));
export const emptyBuffer = new Uint8Array(new ArrayBuffer(0), 0, 0);
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
