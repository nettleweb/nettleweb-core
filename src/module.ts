import Buffer from "./core/Buffer.js";
import BufferReadStream from "./core/BufferReadStream.js";
import BufferWriteStream from "./core/BufferWriteStream.js";
import Stream from "./core/Stream.js";
import Null from "./misc/Null.js";
import AsyncLock from "./utils/AsyncLock.js";
import Base32 from "./coder/Base32.js";
import Base64 from "./coder/Base64.js";
import cyrb128 from "./utils/cyrb128.js";
import EventEmitter from "./utils/EventEmitter.js";
import md5 from "./utils/md5.js";
import Hex from "./coder/Hex.js";
import SecureRandom from "./rand/SecureRandom.js";
import Random from "./rand/Random.js";
import NTON from "./utils/NTON.js";
import Charset, { ASCII, UTF16BE, UTF16LE, UTF32BE, UTF32LE, UTF_8 } from "./coder/Charset.js";
import SyncReadStream from "./core/SyncReadStream.js";
import SyncWriteStream from "./core/SyncWriteStream.js";
import sha256 from "./utils/sha256.js";
import AES from "./utils/AES.js";
import SyncStream from "./core/SyncStream.js";
import ReadStream from "./core/ReadStream.js";
import WriteStream from "./core/WriteStream.js";

const module: Omit<NettleWeb, "NettleWeb" | "loadModule" | "removeModule" | "activeModules"> = {
	md5: md5,
	AES: AES,
	Hex: Hex,
	Null: Null,
	NTON: NTON,
	ASCII: ASCII,
	UTF_8: UTF_8,
	sha256: sha256,
	Base32: Base32,
	Base64: Base64,
	Buffer: Buffer,
	Random: Random,
	Stream: Stream,
	Charset: Charset,
	UTF16BE: UTF16BE,
	UTF16LE: UTF16LE,
	UTF32BE: UTF32BE,
	UTF32LE: UTF32LE,
	cyrb128: cyrb128,
	AsyncLock: AsyncLock,
	SyncStream: SyncStream,
	ReadStream: ReadStream,
	WriteStream: WriteStream,
	EventEmitter: EventEmitter,
	SecureRandom: SecureRandom,
	SyncReadStream: SyncReadStream,
	SyncWriteStream: SyncWriteStream,
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

export default module;