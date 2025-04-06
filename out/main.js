import module from "./module.js";
const _global = typeof globalThis === "object" ? globalThis : typeof window === "object" ? window : typeof global === "object" ? global : typeof self === "object" ? self : Function("return this;")();
if (_global == null || typeof _global !== "object")
    throw new Error("Failed to resolve global object");
const modules = Object.create(null);
Object.defineProperty(module, "loadModule", {
    value: (name, obj) => {
        if (typeof name !== "string" || name === "core")
            throw new Error("Invalid module name: " + name);
        if (name in modules)
            throw new Error("Module has already been loaded: " + name);
        const keys = Object.keys(obj);
        for (const k of keys) {
            Object.defineProperty(module, k, {
                value: obj[k],
                writable: false,
                enumerable: true,
                configurable: true
            });
        }
        modules[name] = keys;
    },
    writable: false,
    enumerable: false,
    configurable: false
});
Object.defineProperty(module, "removeModule", {
    value: (name) => {
        if (typeof name !== "string" || name === "core")
            throw new Error("Invalid module name: " + name);
        const keys = modules[name];
        if (keys != null) {
            for (const k of keys)
                delete module[k];
            return true;
        }
        return false;
    },
    writable: false,
    enumerable: false,
    configurable: false
});
Object.defineProperty(module, "activeModules", {
    value: () => {
        const keys = Object.keys(modules);
        keys.unshift("core");
        return keys;
    },
    writable: false,
    enumerable: false,
    configurable: false
});
if (!("NettleWeb" in _global)) {
    Object.defineProperty(_global, "NettleWeb", {
        value: module,
        writable: false,
        enumerable: false,
        configurable: false
    });
}
export default module;
