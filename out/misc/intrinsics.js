export const { PI, sin, cos, tan, sinh, cosh, tanh, atan2, acos, asin, atan, asinh, acosh, atanh, abs, ceil, floor, round, max, min, exp, expm1, log, log1p, log2, log10, pow, sqrt, cbrt, sign, imul, random } = Math;
export const { parse: jsonParse, stringify: jsonStringify, } = JSON;
export const TWO_PI = 2 * PI;
export const global = typeof globalThis === "object" ? globalThis : typeof window === "object" ? window : typeof self === "object" ? self : Function("return this;")();
export const { Map, Set, Date, Array, Error, String, Number, Object, Symbol, Boolean, DataView, Int32Array, Uint8Array, Uint16Array, Uint32Array, ArrayBuffer, Float32Array, Float64Array, parseInt, parseFloat, encodeURIComponent, decodeURIComponent } = global;
export const { keys: getProps, // rename to prevent conflict as 'keys' is a common identifier
values: objValues, entries: objEntries, seal, freeze, setPrototypeOf, getPrototypeOf, defineProperty, defineProperties, preventExtensions } = Object;
export const { fromCharCode, fromCodePoint } = String;
export const { isNaN, isFinite, isSafeInteger } = Number;
export const { iterator: symIterator, toStringTag: symToString } = Symbol;
export const { now } = Date;
export const { isArray } = Array;
export const { apply, ownKeys, construct, getOwnPropertyDescriptor } = Reflect;
export const { isView: isArrayBufferView } = ArrayBuffer;
export function isArrayBuffer(obj) {
    try {
        new DataView(obj, 0, 0);
        return true;
    }
    catch (err) {
        return false;
    }
}
export function isUint8Array(obj) {
    if (isArrayBufferView(obj)) {
        const tag = obj[symToString];
        return tag === "Uint8Array" || tag === "Buffer";
    }
    return false;
}
for (const { prototype } of [Map, Set, Date, Array, Error, String, Number, Object, Symbol, Boolean, DataView,
    Int32Array, Uint8Array, Uint16Array, Uint32Array, ArrayBuffer, Float32Array, Float64Array]) {
    seal(prototype);
}
const _Function = global.Function;
export { _Function as Function };
