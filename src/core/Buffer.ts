import { bufferConcat, bufferFrom, emptyBuffer, isArrayBuffer } from "../misc/misc.js";

const Buffer: typeof NettleWeb.Buffer = Object.setPrototypeOf(function __struct__() {
	const func: Function = new.target;
	return Reflect.construct(Uint8Array, arguments, (func == null || func === Buffer) ? Uint8Array : func);
}, null);

const BufferProto = Object.freeze(Object.create(null, {
	[Symbol.toStringTag]: {
		value: "Buffer",
		writable: false,
		enumerable: false,
		configurable: false
	}
}));

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
Object.defineProperty(Buffer, "prototype", {
	value: BufferProto,
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
Object.defineProperty(Buffer, "isArrayBuffer", {
	value: isArrayBuffer,
	writable: false,
	enumerable: false,
	configurable: false
});
Object.defineProperty(Buffer, Symbol.hasInstance, {
	value: (e: any) => {
		if (ArrayBuffer.isView(e)) {
			const tag = (e as any)[Symbol.toStringTag];
			return tag === "Uint8Array" || tag === "Buffer";
		}
		return false;
	},
	writable: false,
	enumerable: false,
	configurable: false
});

export default Object.freeze(Buffer);