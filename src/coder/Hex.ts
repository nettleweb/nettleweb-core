import { decodeHex, encodeHex } from "../misc/misc.js";

const Hex: typeof NettleWeb.Hex = {
	encode: encodeHex,
	decode: decodeHex
};

export default Object.freeze(Object.setPrototypeOf(Hex, null));