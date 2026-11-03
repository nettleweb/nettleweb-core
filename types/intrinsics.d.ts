/// <reference lib="es2015" />

// global object
export declare const global: globalThis;

// math functions
export declare function sin(x: number): number;
export declare function cos(x: number): number;
export declare function tan(x: number): number;
export declare function sinh(x: number): number;
export declare function cosh(x: number): number;
export declare function tanh(x: number): number;
export declare function asin(x: number): number;
export declare function acos(x: number): number;
export declare function atan(x: number): number;
export declare function asinh(x: number): number;
export declare function acosh(x: number): number;
export declare function atanh(x: number): number;
export declare function atan2(y: number, x: number): number;
export declare function abs(x: number): number;
export declare function min(...s: number[]): number;
export declare function max(...s: number[]): number;
export declare function ceil(x: number): number;
export declare function floor(x: number): number;
export declare function exp(x: number): number;
export declare function log(x: number): number;
export declare function log2(x: number): number;
export declare function log10(x: number): number;
export declare function expm1(x: number): number;
export declare function log1p(x: number): number;
export declare function pow(x: number, y: number): number;
export declare function sqrt(x: number): number;
export declare function cbrt(x: number): number;
export declare function sign(x: number): number;
export declare function imul(x: number, y: number): number;
export declare function random(): number;

// json functions
export declare function jsonParse(s: string, unused?: any): any;
export declare function jsonStringify(o: any, unused?: any, spaces?: number | string | nul): string;

// global constructors
export declare const Map: MapConstructor;
export declare const Set: SetConstructor;
export declare const Date: DateConstructor;
export declare const Array: ArrayConstructor;
export declare const Error: ErrorConstructor;
export declare const String: StringConstructor;
export declare const Number: NumberConstructor;
export declare const Object: ObjectConstructor;
export declare const Symbol: SymbolConstructor;
export declare const Boolean: BooleanConstructor;
export declare const Function: FunctionConstructor;
export declare const DataView: DataViewConstructor;
export declare const Uint8Array: Uint8ArrayConstructor;
export declare const Uint16Array: Uint16ArrayConstructor;
export declare const Uint32Array: Uint32ArrayConstructor;
export declare const ArrayBuffer: ArrayBufferConstructor;
export declare const Float32Array: Float32ArrayConstructor;
export declare const Float64Array: Float64ArrayConstructor;

// global functions
export function parseInt(s: string, radix?: number | nul): number;
export function parseFloat(s: string): number;
export function encodeURIComponent(s: string): string;
export function decodeURIComponent(s: string): string;

// number functions
export function isNaN(x: number): boolean;
export function isFinite(x: number): boolean;
export function isSafeInteger(x: number): boolean;

// string functions
export function fromCharCode(...c: number[]): string;
export function fromCodePoint(...c: number[]): string;

// object functions
export function ownKeys(obj: object): (string | symbol)[];
export function getProps(obj: object): string[];
export function objValues(obj: object): any[];
export function objEntries(obj: object): [string, any][];

export function freeze<T extends object>(obj: T): T;
export function getPrototypeOf<T extends object>(obj: T): T;
export function setPrototypeOf<T extends object>(obj: T, proto: object | null): T;
export function defineProperty<T extends object>(obj: T, prop: PropertyKey, attr: PropertyDescriptor): T;
export function defineProperties<T extends object>(obj: T, prop: PropertyDescriptorMap): T;
export function preventExtensions<T extends object>(obj: T): T;

// function helpers
export const apply: typeof Reflect.apply;
export const construct: typeof Reflect.construct;

// symbol constants
export const symIterator: typeof Symbol.iterator;
export const symToString: typeof Symbol.toStringTag;

// type checkers
export function isArray(arg: any): arg is Array<any>;
export function isUint8Array(arg: any): arg is Uint8Array;
export function isArrayBuffer(arg: any): arg is ArrayBuffer;
export function isArrayBufferView(arg: any): arg is ArrayBufferView;
