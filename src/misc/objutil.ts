import { defineProperty } from "./intrinsics.js";

const DESC: PropertyDescriptor = {
	writable: false,
	enumerable: false,
	configurable: false
};
const DESC_ENUM: PropertyDescriptor = {
	writable: false,
	enumerable: true,
	configurable: false
};
const DESC_ENUM_CONFIG: PropertyDescriptor = {
	writable: false,
	enumerable: true,
	configurable: true
};

export function defProp(obj: any, key: string | symbol, value: any) {
	DESC.value = value;
	defineProperty(obj, key, DESC);
	delete DESC.value; // allow gc
}
export function defPropEnum(obj: any, key: string | symbol, value: any) {
	DESC_ENUM.value = value;
	defineProperty(obj, key, DESC_ENUM);
	delete DESC_ENUM.value;
}
export function defPropEnumConfig(obj: any, key: string | symbol, value: any) {
	DESC_ENUM_CONFIG.value = value;
	defineProperty(obj, key, DESC_ENUM_CONFIG);
	delete DESC_ENUM_CONFIG.value;
}
