import module from "./module.js";

declare var self: any;
declare var global: any;
declare var window: any;

const _global = typeof globalThis === "object" ? globalThis : typeof window === "object" ? window : typeof global === "object" ? global : typeof self === "object" ? self : Function("return this;")();
if (_global == null || typeof _global !== "object")
	throw new Error("Failed to resolve global object");

if (!("NettleWeb" in _global)) {
	Object.defineProperty(_global, "NettleWeb", {
		value: module,
		writable: false,
		enumerable: false,
		configurable: false
	});
}

export default module;