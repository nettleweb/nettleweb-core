import { decodeHex } from "../misc/misc.js";
import sha256 from "./sha256.js";

export default function hmac_sha256(key: NettleWeb.BufferView, data: NettleWeb.BufferView): NettleWeb.Buffer {
	if (key.length !== 64)
		throw new Error("The provided key must have exactly 64 bytes.");

	// k_xor_ipad = key XOR ipad
	const k_xor_ipad = new Uint8Array(64);
	for (let i = 0; i < 64; i++)
		k_xor_ipad[i] = key[i] ^ 0x36;

	// k_xor_opad = key XOR opad
	const k_xor_opad = new Uint8Array(64);
	for (let i = 0; i < 64; i++)
		k_xor_opad[i] = key[i] ^ 0x5c;

	// inner_hash = HASH(k_xor_ipad || message)
	const innerInput = new Uint8Array(64 + data.length);
	innerInput.set(k_xor_ipad);
	innerInput.set(data, 64);
	const inner_hash = decodeHex(sha256(data));

	// hmac = HASH(k_xor_opad || inner_hash)
	const outerInput = new Uint8Array(128);
	outerInput.set(k_xor_opad);
	outerInput.set(inner_hash, 64);
	return decodeHex(sha256(outerInput));
}