const Null = Object.setPrototypeOf(function __struct__() {
    if (typeof new.target === "function") {
        for (let p = Object.getPrototypeOf(this); p != null; p = Object.getPrototypeOf(p)) {
            try {
                delete p["constructor"];
            }
            catch (err) { }
        }
    }
    else
        return Object.create(NullProto);
}, null);
export const NullProto = Object.freeze(Object.create(null));
Object.defineProperty(Null, "prototype", {
    value: NullProto,
    writable: false,
    enumerable: false,
    configurable: false
});
Object.defineProperty(Null, Symbol.hasInstance, {
    value: () => false,
    writable: false,
    enumerable: false,
    configurable: false
});
export default Object.freeze(Null);
