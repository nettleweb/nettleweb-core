import { defineProperty } from "./intrinsics.js";
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
export function defProp(obj, key, value) {
    DESC.value = value;
    defineProperty(obj, key, DESC);
    delete DESC.value; // allow gc
}
export function defPropEnum(obj, key, value) {
    DESC_ENUM.value = value;
    defineProperty(obj, key, DESC_ENUM);
    delete DESC_ENUM.value;
}
export function defPropEnumConfig(obj, key, value) {
    DESC_ENUM_CONFIG.value = value;
    defineProperty(obj, key, DESC_ENUM_CONFIG);
    delete DESC_ENUM_CONFIG.value;
}
