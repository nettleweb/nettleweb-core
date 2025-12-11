import { bufferConcat, emptyBuffer, isArrayBuffer, isBuffer } from "../misc/misc.js";
import { defProp } from "../misc/objutil.js";

const Buffer: typeof NettleWeb.Buffer = Object.setPrototypeOf(function __struct__() {
	const func: Function = new.target;
	return Reflect.construct(Uint8Array, arguments, (func == null || func === Buffer) ? Uint8Array : func);
}, null);

defProp(Buffer, "prototype", Object.freeze(Object.create(null)));
defProp(Buffer, "emptyBuffer", emptyBuffer);
defProp(Buffer, "concat", bufferConcat);
defProp(Buffer, "isBuffer", isBuffer);
defProp(Buffer, "isArrayBuffer", isArrayBuffer);

export default Object.freeze(Buffer);
