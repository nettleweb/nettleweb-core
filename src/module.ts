import Buffer from "./io/Buffer.js";
import Stream from "./io/Stream.js";
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
import sha256 from "./utils/sha256.js";
import AES from "./utils/AES.js";
import ReadStream from "./io/ReadStream.js";
import WriteStream from "./io/WriteStream.js";
import TreeMap from "./utils/TreeMap.js";
import ArrayMap from "./utils/ArrayMap.js";
import Path from "./utils/Path.js";
import hmac_sha256 from "./utils/hmac_sha256.js";
import Sha256Stream from "./hash/Sha256Stream.js";
import HashStream from "./hash/HashStream.js";
import Sha1Stream from "./hash/Sha1Stream.js";
import HmacSha1Stream from "./hash/HmacSha1Stream.js";
import HmacSha256Stream from "./hash/HmacSha256Stream.js";
import StringMap from "./utils/StringMap.js";
import URL from "./utils/URL.js";
import URLQueries from "./utils/URLQueries.js";

const module: Omit<NettleWeb, "NettleWeb" | "loadModule" | "removeModule" | "activeModules"> = {
	md5: md5,
	AES: AES,
	URL: URL,
	Hex: Hex,
	Null: Null,
	Path: Path,
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
	TreeMap: TreeMap,
	ArrayMap: ArrayMap,
	StringMap: StringMap,
	AsyncLock: AsyncLock,
	URLQueries: URLQueries,
	ReadStream: ReadStream,
	WriteStream: WriteStream,
	hmac_sha256: hmac_sha256,
	EventEmitter: EventEmitter,
	SecureRandom: SecureRandom,
	HashStream: HashStream,
	Sha1Stream: Sha1Stream,
	Sha256Stream: Sha256Stream,
	HmacSha1Stream: HmacSha1Stream,
	HmacSha256Stream: HmacSha256Stream
};

export default Object.setPrototypeOf(module, null);