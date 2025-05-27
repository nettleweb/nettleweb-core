import { encodeUTF8 } from "../misc/misc.js";

function rightRotate(value: number, amount: number): number {
	return (value >>> amount) | (value << (32 - amount));
}

function rightShift(value: number, amount: number): number {
	return value >>> amount;
}

// Round constants (first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311):
const K = [
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

/**
 * Secure Hash Algorithm (SHA256)
 * http://www.webtoolkit.info/
 * Original code by Angel Marin, Paul Johnston
 * Corrected implementation based on FIPS PUB 180-4.
 *
 * Re-written for clarity, ES6 features, and better adherence to the standard steps.
 */
export default function sha256(data: string | NettleWeb.BufferView): string {
	const msg: number[] = Array.from(typeof data === "string" ? encodeUTF8(data) : data);

	// Initial hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	const H = [
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
	];

	// --- Preprocessing ---

	const msgByteLength = msg.length;
	const msgBitLength = msgByteLength * 8;

	// 2. Append '1' bit (0x80 byte)
	msg.push(0x80);

	// 3. Append '0' bits (0x00 bytes) until message length in bits is congruent to 448 (mod 512)
	// This means the byte length should be congruent to 56 (mod 64).
	while (msg.length % 64 !== 56) {
		msg.push(0x00);
	}

	// 4. Append original message length in bits as a 64-bit big-endian integer
	// JavaScript numbers are 64-bit floats, but bitwise ops treat them as 32-bit signed integers.
	// We need to handle the 64-bit length carefully.
	// Get the high 32 bits (handle potential overflow for lengths >= 2^32 bits)
	const highBits = (msgBitLength / Math.pow(2, 32)) >>> 0;
	// Get the low 32 bits
	const lowBits = msgBitLength >>> 0;

	// Append length bytes in big-endian order
	for (let i = 24; i >= 0; i -= 8) {
		msg.push((highBits >> i) & 0xff);
	}
	for (let i = 24; i >= 0; i -= 8) {
		msg.push((lowBits >> i) & 0xff);
	}


	// --- Process the message in successive 512-bit (64-byte) chunks ---
	for (let chunkStart = 0; chunkStart < msg.length; chunkStart += 64) {
		const chunk = msg.slice(chunkStart, chunkStart + 64);

		// 1. Prepare the message schedule (W[0..63])
		let W = new Array(64);
		for (let t = 0; t < 16; t++) {
			// Combine 4 bytes into one 32-bit word (big-endian)
			W[t] = (chunk[t * 4] << 24) | (chunk[t * 4 + 1] << 16) | (chunk[t * 4 + 2] << 8) | chunk[t * 4 + 3];
			W[t] = W[t] >>> 0; // Ensure unsigned 32-bit
		}
		for (let t = 16; t < 64; t++) {
			const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ rightShift(W[t - 15], 3);
			const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ rightShift(W[t - 2], 10);
			W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0; // Ensure unsigned 32-bit addition
		}

		// 2. Initialize working variables with the current hash value
		let a = H[0];
		let b = H[1];
		let c = H[2];
		let d = H[3];
		let e = H[4];
		let f = H[5];
		let g = H[6];
		let h = H[7];

		// 3. Compression function main loop
		for (let t = 0; t < 64; t++) {
			const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
			const ch = (e & f) ^ (~e & g); // Choice function
			const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0; // Ensure unsigned 32-bit addition

			const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
			const maj = (a & b) ^ (a & c) ^ (b & c); // Majority function
			const temp2 = (S0 + maj) >>> 0; // Ensure unsigned 32-bit addition

			h = g;
			g = f;
			f = e;
			e = (d + temp1) >>> 0; // Ensure unsigned 32-bit addition
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2) >>> 0; // Ensure unsigned 32-bit addition
		}

		// 4. Compute the intermediate hash value H(i)
		H[0] = (H[0] + a) >>> 0;
		H[1] = (H[1] + b) >>> 0;
		H[2] = (H[2] + c) >>> 0;
		H[3] = (H[3] + d) >>> 0;
		H[4] = (H[4] + e) >>> 0;
		H[5] = (H[5] + f) >>> 0;
		H[6] = (H[6] + g) >>> 0;
		H[7] = (H[7] + h) >>> 0;
	}

	return H.map((e) => e.toString(16).padStart(8, "0")).join("");
}