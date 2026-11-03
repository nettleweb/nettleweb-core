import Null from "../misc/Null.js";

function arrayCopy(dst: NettleWeb.BufferLike, src: NettleWeb.BufferView, len: number, doff: number, soff: number) {
	for (let d = doff, s = soff, c = 0; c < len; d++, s++, c++)
		dst[d] = src[s];
}

export default abstract class BlockHashStream extends Null implements NettleWeb.HashStream {
	readonly #buffer: Uint8Array;
	readonly #blockSize: number;

	#buffered: number = 0;
	#bytesHashedLow: number = 0;
	#bytesHashedHigh: number = 0;

	constructor(blockSize: number) {
		super();
		this.#blockSize = blockSize;
		this.#buffer = new Uint8Array(blockSize);
	}

	reset(): this {
		this.#buffered = 0;
		this.#bytesHashedLow = 0;
		this.#bytesHashedHigh = 0;
		return this;
	}

	update(data: NettleWeb.BufferView): this {
		let length = data.length;

		// Track total bit count (using 64-bit integer via two 32-bit words)
		this.#bytesHashedLow = (this.#bytesHashedLow + length) | 0;
		if ((this.#bytesHashedLow >>> 0) < (length >>> 0))
			this.#bytesHashedHigh = (this.#bytesHashedHigh + 1) | 0;

		const buffer = this.#buffer;
		const blockSize = this.#blockSize;

		let offset = 0;
		let buffered = this.#buffered;

		if (buffered > 0) {
			const needed = blockSize - buffered;
			const copyLen = length < needed ? length : needed;

			//buffer.set(data.subarray(offset, offset + copyLen), buffered);
			arrayCopy(buffer, data, copyLen, buffered, offset);
			buffered += copyLen;
			offset += copyLen;
			length -= copyLen;

			if (buffered === blockSize) {
				this._processBlock(buffer, 0);
				buffered = 0;
			}
		}

		while (length >= blockSize) {
			this._processBlock(data, offset);
			offset += blockSize;
			length -= blockSize;
		}

		// Cache remaining bytes in the internal buffer
		if (length > 0) {
			arrayCopy(buffer, data, length, 0, offset);
			buffered = length;
		}

		this.#buffered = buffered;
		return this;
	}

	hash() {
		const buffer = this.#buffer;
		const blockSize = this.#blockSize;

		let buffered = this.#buffered;

		// Append 0x80 padding
		buffer[buffered++] = 0x80;

		// If there is not enough room for the 8-byte length, pad and hash
		if (buffered > 56) {
			buffer.fill(0, buffered, blockSize);
			this._processBlock(buffer, 0);
			buffered = 0;
		}

		buffer.fill(0, buffered, 56);

		// Append length in bits as a 64-bit big-endian integer
		const bytesHashedLow = this.#bytesHashedLow;
		const totalBitsLow = (bytesHashedLow << 3) | 0;
		const totalBitsHigh = ((this.#bytesHashedHigh << 3) | (bytesHashedLow >>> 29)) | 0;

		buffer[56] = (totalBitsHigh >>> 24) & 0xff;
		buffer[57] = (totalBitsHigh >>> 16) & 0xff;
		buffer[58] = (totalBitsHigh >>> 8) & 0xff;
		buffer[59] = totalBitsHigh & 0xff;
		buffer[60] = (totalBitsLow >>> 24) & 0xff;
		buffer[61] = (totalBitsLow >>> 16) & 0xff;
		buffer[62] = (totalBitsLow >>> 8) & 0xff;
		buffer[63] = totalBitsLow & 0xff;

		this._processBlock(buffer, 0);
		const raw = this._getDigest();
		this.reset();
		return raw;
	}

	abstract get algorithm(): string;
	abstract get hashLength(): number;

	abstract _processBlock(buffer: NettleWeb.BufferView, offset: number): void;
	abstract _getDigest(): number[];
}
