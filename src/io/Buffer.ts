import { construct, freeze, isArrayBuffer, isUint8Array, setPrototypeOf } from "../misc/intrinsics.js";
import { bufferConcat, emptyBuffer } from "../misc/misc.js";
import { defProp } from "../misc/objutil.js";

const Buffer: typeof NettleWeb.Buffer = setPrototypeOf(function __struct__() {
	const func: Function = new.target;
	return construct(Uint8Array, arguments, (func == null || func === Buffer) ? Uint8Array : func);
}, null);

defProp(Buffer, "prototype", freeze({ __proto__: null }));
defProp(Buffer, "emptyBuffer", emptyBuffer);
defProp(Buffer, "concat", bufferConcat);
defProp(Buffer, "isBuffer", isUint8Array);
defProp(Buffer, "isArrayBuffer", isArrayBuffer);
export default freeze(Buffer);
