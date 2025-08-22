/*! NettleWeb Core v0.0.4 API Types | MIT License !*/
/// <reference lib="es2015" />

declare global {
	export type nul = null | undefined | void;
	export type Awaitable<T> = T | PromiseLike<T>;
	export type Comparator<T> = (a: T, b: T) => number;
	export type NettleWeb = typeof NettleWeb & { readonly NettleWeb: NettleWeb; };
	export type globalThis = typeof globalThis & { readonly NettleWeb: NettleWeb };

	export module globalThis {
		export var window: globalThis;
		export var globalThis: globalThis;
	}

	export module NettleWeb {
		export const NettleWeb: NettleWeb;

		export function loadModule(name: string, module: object): void;
		export function removeModule(name: string): boolean;
		export function activeModules(): string[];

		//////////////////////////////////////////////////////
		// Null
		//////////////////////////////////////////////////////
		export interface Null {
		}
		export const Null: {
			(): Null;
			new(): Null;
			readonly prototype: Null;
		};

		//////////////////////////////////////////////////////
		// Map
		//////////////////////////////////////////////////////
		export type MapInit<K, V> = MapLike<K, V> | Iterable<[K, V]> | { entries: () => Iterable<[K, V]>; };
		export type StringMapInit = MapInit<string, string> | Record<string, string>;

		export interface MapLike<K, V> {
			readonly size: number;

			has(key: K): boolean;
			get(key: K): V | null;
			set(key: K, value: V): void;
			clear(): void;
			delete(key: K): boolean;

			keys(): K[];
			values(): V[];
			entries(): [K, V][];
		}
		export interface AsyncMap<K, V> {
			has(key: K): Promise<boolean>;
			get(key: K): Promise<V | null>;
			set(key: K, value: V): Promise<void>;
			clear(): Promise<void>;
			delete(key: K): Promise<boolean>;

			keys(): Promise<K[]>;
			values(): Promise<V[]>;
			entries(): Promise<[K, V][]>;
		}

		export interface TreeMap<K, V> extends MapLike<K, V>, Iterable<[K, V]> {
			[Symbol.iterator](): IterableIterator<[K, V]>;
		}
		export const TreeMap: {
			new <K, V>(init?: MapInit<K, V> | nul, cmpFn?: Comparator<K> | nul): TreeMap<K, V>;
			readonly prototype: TreeMap<any, any>;
		};

		export interface ArrayMap<K, V> extends MapLike<K, V>, Iterable<[K, V]> {
			[Symbol.iterator](): IterableIterator<[K, V]>;
		}
		export const ArrayMap: {
			new <K, V>(init?: ArrayMap<K, V> | nul): ArrayMap<K, V>;
			readonly prototype: ArrayMap<any, any>;
		};

		export interface StringMap extends MapLike<string, string>, Iterable<[string, string]> {
			[Symbol.iterator](): IterableIterator<[string, string]>;
		}
		export const StringMap: {
			new(init?: StringMapInit | nul): StringMap;
			readonly prototype: StringMap;
		};

		//////////////////////////////////////////////////////
		// Buffer
		//////////////////////////////////////////////////////
		export type BufferView = Buffer | number[] | ArrayLike<number>;
		export type BufferData = Buffer | ArrayBufferLike | ArrayBufferView;
		export type BufferSource = Iterable<number> | ArrayLike<number> | BufferData;

		export interface Buffer extends Uint8Array, Iterable<number>, ArrayLike<number> {
			readonly length: number;
			[Symbol.iterator](): ArrayIterator<number>;
		}
		export const Buffer: {
			new(): Buffer;
			readonly prototype: Buffer;
			readonly emptyBuffer: Buffer;

			from(data: BufferSource, mapFn?: ((v: any, k: number) => number) | nul): Buffer;
			concat(data: Iterable<BufferData> | ArrayLike<BufferData>, length?: number | nul): Buffer;
			isBuffer(obj: any): obj is Buffer;
			isArrayBuffer(obj: any): obj is ArrayBufferLike;
		};

		//////////////////////////////////////////////////////
		// Random
		//////////////////////////////////////////////////////
		export interface Random<Seed = number> {
			readonly seed: Seed | null;

			setSeed(seed: Seed): void;
			rand(): number;
			randBuf(buf: number[] | Buffer): void;
			randInt(max?: number | nul, min?: number | nul): number;
			randUUID(): string;
		}
		export const Random: {
			new(seed?: number | nul): Random;
			readonly prototype: Random;
		};

		export interface SecureRandom extends Random<number[]> {
			readonly aes: AES;
			readonly counter: number[];
			setCounter(counter: CounterInit): void;
		}
		export const SecureRandom: {
			new(seed?: number[] | nul, counter?: CounterInit | nul): SecureRandom;
			readonly prototype: SecureRandom;
		};

		//////////////////////////////////////////////////////
		// Charset
		//////////////////////////////////////////////////////
		export interface Charset {
			readonly name: string;
			encode(data: string): Buffer;
			decode(data: BufferView): string;
		}
		export const Charset: {
			new(name: string): Charset;
			readonly prototype: Charset;

			forName(name: string): Charset;
			isSupported(name: string): boolean;
			defaultCharset(): Charset;
		};

		//////////////////////////////////////////////////////
		// Streams
		/////////////////////////////////////////////////////
		export interface Closeable {
			close(): Promise<void>;
		}
		export interface Flushable {
			flush(): Promise<void>;
		}

		export interface Stream extends Closeable {
			readonly closed: boolean;
			readonly canRead: boolean;
			readonly canWrite: boolean;
			generator(chunkSize?: number | nul): AsyncGenerator<Buffer>;
		}
		export const Stream: {
			new(canRead?: boolean | nul, canWrite?: boolean | nul): Stream;
			readonly prototype: Stream;
		};

		export interface ReadStream extends Stream {
			pipe(out: WriteStream, close?: boolean | nul): Promise<number>;
			read(): Promise<number>;
			read(buf: Buffer, off?: number | nul, len?: number | nul): Promise<number>;
			readLine(charset?: nul, lineSep?: string | nul): Promise<Buffer>;
			readLine(charset: Charset | string, lineSep?: string | nul): Promise<string>;
			readNBytes(n: number, charset?: nul): Promise<Buffer>;
			readNBytes(n: number, charset: Charset | string): Promise<string>;
			readAllBytes(charset?: nul): Promise<Buffer>;
			readAllBytes(charset: Charset | string): Promise<string>;

			/** 
			 * @abstract - Must override in subclasses
			 * @protected - Should not be invoked directly
			 */
			_read(buf: Buffer): Awaitable<number>;
		}
		export const ReadStream: {
			new(): ReadStream;
			readonly prototype: ReadStream;
		};

		export interface WriteStream extends Stream, Flushable {
			write(b: number): Promise<void>;
			write(buf: string, charset?: Charset | string | nul): Promise<void>;
			write(buf: Buffer, off?: number | nul, len?: number | nul): Promise<void>;
			writeln(buf: string, charset?: Charset | string | nul, lineEnd?: string | nul): Promise<void>;
			writeln(buf: Buffer, off?: number | nul, len?: number | nul, lineEnd?: string | nul): Promise<void>;

			/** 
			 * @abstract - Must override in subclasses
			 * @protected - Should not be invoked directly
			 */
			_write(buf: Buffer): Awaitable<void>;
		}
		export const WriteStream: {
			new(): WriteStream;
			readonly prototype: WriteStream;
		};

		// Proposed New Apis

		// export interface PassThroughStream extends WriteStream {
		// 	readonly readStream: ReadStream;
		// }
		// export const PassThroughStream: {
		// 	new(): PassThroughStream;
		// 	readonly prototype: PassThroughStream;
		// };

		// export interface InMemoryReadStream extends ReadStream {
		// 	buffer: NettleWeb.Buffer;
		// 	offset: number;
		// }
		// export const InMemoryReadStream: {
		// 	new(buffer: NettleWeb.Buffer): InMemoryReadStream;
		// 	readonly prototype: InMemoryReadStream;
		// };

		// export interface InMemoryWriteStream {
		// 	reset(): void;
		// 	buffer(): Buffer;
		// }
		// export const InMemoryWriteStream: {
		// 	new(): InMemoryWriteStream;
		// 	readonly prototype: InMemoryWriteStream;
		// };


		//////////////////////////////////////////////////////
		// Async Lock
		//////////////////////////////////////////////////////
		export interface AsyncLock extends PromiseLike<void> {
			readonly locked: boolean;
			lock(): void;
			unlock(): void;
		}
		export const AsyncLock: {
			new(): AsyncLock;
			readonly prototype: AsyncLock;
		};

		//////////////////////////////////////////////////////
		// URL Parser
		//////////////////////////////////////////////////////
		export interface URLData {
			scheme: string;
			host: string;
			port: string;
			path: string;
			query: string;
			fragment: string;
		}

		export interface URL extends URLData {
			queries(): URLQueries;
			toString(): string;
		}
		export const URL: {
			new(data: string | URLData): URL;
			readonly prototype: URL;
		};

		export interface URLQueries extends StringMap {
			toString(): string;
		}
		export const URLQueries: {
			new(data?: string | StringMapInit | nul): URLQueries;
			readonly prototype: URLQueries;
		};

		//////////////////////////////////////////////////////
		// File System
		//////////////////////////////////////////////////////
		export interface FSMap extends AsyncMap<string, Buffer> {
			readonly persistent: boolean;
		}
		export const FSMap: {
			new(): FSMap;
			readonly prototype: FSMap;
		};

		export interface FileInfo {
			[k: string]: any; // internal attributes
			name: string;
			path: string;
			size: number;
			chunks: number;
			isSymlink: boolean;
			isDirectory: boolean;
			lastModified: number;
		}

		export interface FileSystem {
			list(path: string): Promise<string[]>;
			copy(src: string, dest: string): Promise<void>;
			move(src: string, dest: string): Promise<void>;
			link(src: string, dest: string): Promise<void>;
			read(path: string): Promise<Buffer>;
			mkdir(path: string): Promise<void>;
			write(path: string, data: Buffer): Promise<void>;
			append(path: string, data: Buffer): Promise<void>;
			delete(path: string): Promise<void>;
			exists(path: string): Promise<boolean>;
			getInfo(path: string): Promise<FileInfo | null>;
			isRegular(path: string): Promise<boolean>;
			isSymlink(path: string): Promise<boolean>;
			isDirectory(path: string): Promise<boolean>;
			subFileSystem(root: string): FileSystem;
			createReadStream(path: string, start?: number | nul): ReadStream;
			createWriteStream(path: string, append?: boolean | nul): WriteStream;
		}
		export const FileSystem: {
			new(storage?: FSMap | nul): FileSystem;
			readonly prototype: FileSystem;
		};

		//////////////////////////////////////////////////////
		// Event Emitter
		//////////////////////////////////////////////////////
		export type EventKey = number | string | symbol;
		export type EventListener = (...args: any[]) => void;

		export interface EventEmitter<M extends object = any> {
			on<E extends keyof M>(event: E, listener: M[E]): void;
			off<E extends keyof M>(event: E, listener: M[E]): boolean;
			once<E extends keyof M>(event: E, listener: M[E]): void;
			on(event: EventKey, listener: EventListener): void;
			off(event: EventKey, listener: EventListener): boolean;
			once(event: EventKey, listener: EventListener): void;
			off(event?: EventKey | nul): boolean;
			emit(event: EventKey, ...data: any[]): boolean;
			getListeners(event?: EventKey | nul): EventListener[];
		}
		export const EventEmitter: {
			new <E extends object = any>(): EventEmitter<E>;
			readonly prototype: EventEmitter;
		};

		//////////////////////////////////////////////////////
		// String Coders
		//////////////////////////////////////////////////////
		export const ASCII: Charset;
		export const UTF_8: Charset;
		export const UTF16BE: Charset;
		export const UTF16LE: Charset;
		export const UTF32BE: Charset;
		export const UTF32LE: Charset;

		//////////////////////////////////////////////////////
		// Binary Coders
		//////////////////////////////////////////////////////
		export module Hex {
			export function encode(data: BufferView): string;
			export function decode(data: string): Buffer;
		}
		export module Base32 {
			export function encode(data: BufferView): string;
			export function decode(data: string): Buffer;
		}
		export module Base64 {
			export function encode(data: BufferView): string;
			export function decode(data: string): Buffer;
		}

		//////////////////////////////////////////////////////
		// Object Serializers
		//////////////////////////////////////////////////////
		export module NTON {
			export function encode(data: any): Buffer;
			export function decode(data: Buffer): any;
			export function validate(data: BufferView): boolean;
		}

		//////////////////////////////////////////////////////
		// Encryption Algorithms
		//////////////////////////////////////////////////////
		export type CounterInit = number | BufferView | Iterable<number>;

		export interface AES {
			readonly key: number[];

			encrypt(data: BufferView): number[];
			decrypt(data: BufferView): number[];
			encryptCTR(data: BufferView, counter?: CounterInit | nul): number[];
			decryptCTR(data: BufferView, counter?: CounterInit | nul): number[];
		}
		export const AES: {
			new(seed: BufferView): AES;
			readonly prototype: AES;
		};

		//////////////////////////////////////////////////////
		// Hash Functions
		//////////////////////////////////////////////////////
		export interface HashStream extends WriteStream {
			readonly algorithm: string;
			readonly hashLength: number;

			_write(buf: BufferView): void;
			hash(): number[];
			reset(): void;
		}
		export const HashStream: {
			new(): HashStream;
			readonly prototype: HashStream;
		};

		export interface Sha1Stream extends HashStream {
		}
		export const Sha1Stream: {
			new(): Sha1Stream;
			readonly prototype: Sha1Stream;
		};

		export interface Sha256Stream extends HashStream {
		}
		export const Sha256Stream: {
			new(): Sha256Stream;
			readonly prototype: Sha256Stream;
		};

		export interface HmacSha1Stream extends HashStream {
		}
		export const HmacSha1Stream: {
			new(key: BufferView): HmacSha1Stream;
			readonly prototype: HmacSha1Stream;
		};

		export interface HmacSha256Stream extends HashStream {
		}
		export const HmacSha256Stream: {
			new(key: BufferView): HmacSha256Stream;
			readonly prototype: HmacSha256Stream;
		};

		export function md5(data: string | BufferView): string;
		export function sha256(data: string | BufferView): string;
		export function cyrb128(data: string | BufferView): string;
		export function hmac_sha256(key: BufferView, data: BufferView): number[];

		//////////////////////////////////////////////////////
		// Other Util Functions
		//////////////////////////////////////////////////////
		export module Path {
			export function name(path: string): string;
			export function join(...parts: string[]): string;
			export function parent(path: string): string;
			export function extname(path: string): string;
			export function normalize(path: string): string;
		}
	}
}

export { NettleWeb };
export default NettleWeb;