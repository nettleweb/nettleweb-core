import module from "./module.js";
const modules = Object.create(null);
const defineProp = Object.defineProperty.bind(Object, module);
const DESC = {
    writable: false,
    enumerable: false,
    configurable: false
};
const DESC_ENUM = {
    writable: false,
    enumerable: true,
    configurable: false
};
const DESC_ENUM_CONFIG = {
    writable: false,
    enumerable: true,
    configurable: true
};
DESC.value = (name, obj) => {
    if (typeof name !== "string" || name === "core")
        throw new Error("Invalid module name: " + name);
    if (name in modules)
        throw new Error("Module has already been loaded: " + name);
    const keys = Object.keys(obj);
    for (const k of keys) {
        DESC_ENUM_CONFIG.value = obj[k];
        defineProp(k, DESC_ENUM_CONFIG);
    }
    modules[name] = keys;
};
defineProp("loadModule", DESC);
DESC.value = (name) => {
    if (typeof name !== "string" || name === "core")
        throw new Error("Invalid module name: " + name);
    const keys = modules[name];
    if (keys != null) {
        for (const k of keys)
            delete module[k];
        delete modules[name];
        return true;
    }
    return false;
};
defineProp("removeModule", DESC);
DESC.value = () => {
    const keys = Object.keys(modules);
    keys.unshift("core");
    return keys;
};
defineProp("activeModules", DESC);
DESC.value = module;
defineProp("NettleWeb", DESC);
DESC.value = "NettleWeb";
defineProp(Symbol.toStringTag, DESC);
// ! IMPORTANT: Redefine all built-in members as non-configurable to avoid issues when interacting
// with the native c++ addon
for (const k of Object.keys(module)) {
    DESC_ENUM.value = module[k];
    defineProp(k, DESC_ENUM);
}
{
    const _global = typeof globalThis === "object" ? globalThis : typeof window === "object" ? window : typeof global === "object" ? global : typeof self === "object" ? self : Function("return this;")();
    if (_global == null || typeof _global !== "object")
        throw new Error("Failed to resolve global object");
    if (!("NettleWeb" in _global)) {
        DESC.value = module;
        Object.defineProperty(_global, "NettleWeb", DESC);
    }
}
export default module;
