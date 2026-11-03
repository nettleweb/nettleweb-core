import { Error, getProps, global, symToString } from "./misc/intrinsics.js";
import { defProp, defPropEnum, defPropEnumConfig } from "./misc/objutil.js";
import module from "./module.js";

const modules: Record<string, string[]> = { __proto__: null } as any;

defProp(module, "loadModule", (name: string, obj: any) => {
	if (typeof name !== "string" || name === "core")
		throw new Error("Invalid module name: " + name);
	if (name in modules)
		throw new Error("Module has already been loaded: " + name);

	const keys = getProps(obj);
	for (const k of keys)
		defPropEnumConfig(module, k, obj[k]);

	modules[name] = keys;
});
defProp(module, "removeModule", (name: string) => {
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
	const keys = getProps(modules);
	keys.unshift("core");
	return keys;
});

defProp(module, "default", module);
defProp(module, "NettleWeb", module);
defProp(module, "__esModule", true);
defProp(module, symToString, "NettleWeb");

// ! IMPORTANT: Redefine all built-in members as non-configurable to avoid issues when interacting
// with the native c++ addon
for (const k of getProps(module))
	defPropEnum(module, k, module[k]);

defProp(global, "NettleWeb", module);
export default module;
