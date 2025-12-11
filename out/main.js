import { defProp, defPropEnum, defPropEnumConfig } from "./misc/objutil.js";
import module from "./module.js";
const modules = Object.create(null);
defProp(module, "loadModule", (name, obj) => {
    if (typeof name !== "string" || name === "core")
        throw new Error("Invalid module name: " + name);
    if (name in modules)
        throw new Error("Module has already been loaded: " + name);
    const keys = Object.keys(obj);
    for (const k of keys)
        defPropEnumConfig(module, k, obj[k]);
    modules[name] = keys;
});
defProp(module, "removeModule", (name) => {
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
});
defProp(module, "activeModules", () => {
    const keys = Object.keys(modules);
    keys.unshift("core");
    return keys;
});
defProp(module, "default", module);
defProp(module, "NettleWeb", module);
defProp(module, "__esModule", true);
defProp(module, Symbol.toStringTag, "NettleWeb");
// ! IMPORTANT: Redefine all built-in members as non-configurable to avoid issues when interacting
// with the native c++ addon
for (const k of Object.keys(module))
    defPropEnum(module, k, module[k]);
{
    const _global = typeof globalThis === "object" ? globalThis : typeof window === "object" ? window : typeof self === "object" ? self : Function("return this;")();
    if (_global == null || typeof _global !== "object" || !Object.isExtensible(_global))
        throw new Error("Failed to retrieve global object.");
    defProp(_global, "NettleWeb", module);
}
export default module;
