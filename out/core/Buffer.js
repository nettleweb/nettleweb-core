import { bufferConcat, bufferFrom, emptyBuffer, isArrayBuffer } from "../misc/misc.js";
const Buffer = Object.setPrototypeOf(function __struct__() {
    const func = new.target;
    return Reflect.construct(Uint8Array, arguments, (func == null || func === Buffer) ? Uint8Array : func);
}, null);
Object.defineProperty(Buffer, "prototype", {
    value: Object.freeze(Object.create(null)),
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
Object.defineProperty(Buffer, "from", {
    value: bufferFrom,
    writable: false,
    enumerable: false,
    configurable: false
});
Object.defineProperty(Buffer, "concat", {
    value: bufferConcat,
    writable: false,
    enumerable: false,
    configurable: false
});
Object.defineProperty(Buffer, "isBuffer", {
    value: (e) => {
        if (ArrayBuffer.isView(e)) {
            const tag = e[Symbol.toStringTag];
            return tag === "Uint8Array" || tag === "Buffer";
        }
        return false;
    },
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
export default Object.freeze(Buffer);
