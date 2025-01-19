import Buffer from "./core/Buffer.js";
import BufferReadStream from "./core/BufferReadStream.js";
import BufferWriteStream from "./core/BufferWriteStream.js";
import ReadStream from "./core/ReadStream.js";
import Stream from "./core/Stream.js";
import WriteStream from "./core/WriteStream.js";
import Null from "./misc/Null.js";
import AsyncLock from "./utils/AsyncLock.js";
import Base32 from "./coder/Base32.js";
import Base64 from "./coder/Base64.js";
import cyrb128 from "./utils/cyrb128.js";
import EventEmitter from "./utils/EventEmitter.js";
import md5 from "./utils/md5.js";
import UTF_8 from "./coder/UTF_8.js";
import ASCII from "./coder/ASCII.js";
import UTF16BE from "./coder/UTF16BE.js";
import UTF16LE from "./coder/UTF16LE.js";
import UTF32BE from "./coder/UTF32BE.js";
import Hex from "./coder/Hex.js";
import SecureRandom from "./rand/SecureRandom.js";
import Random from "./rand/Random.js";
import NTON from "./utils/NTON.js";

const module: Omit<NettleWeb, "NettleWeb" | "sha256"> = {
	md5: md5,
	Hex: Hex,
	Null: Null,
	NTON: NTON,
	ASCII: ASCII,
	UTF_8: UTF_8,
	Base32: Base32,
	Base64: Base64,
	Buffer: Buffer,
	Random: Random,
	Stream: Stream,
	UTF16BE: UTF16BE,
	UTF16LE: UTF16LE,
	UTF32BE: UTF32BE,
	UTF32LE: UTF16LE,
	cyrb128: cyrb128,
	AsyncLock: AsyncLock,
	ReadStream: ReadStream,
	WriteStream: WriteStream,
	EventEmitter: EventEmitter,
	SecureRandom: SecureRandom,
	BufferReadStream: BufferReadStream,
	BufferWriteStream: BufferWriteStream
};

Object.setPrototypeOf(module, null);
Object.defineProperty(module, "NettleWeb", {
	value: module,
	writable: false,
	enumerable: false,
	configurable: false
});
Object.defineProperty(module, Symbol.toStringTag, {
	value: "NettleWeb",
	writable: false,
	enumerable: false,
	configurable: false
});

export default Object.freeze(module);