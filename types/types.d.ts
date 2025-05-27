/*! NettleWeb Core v0.0.4 API Types | MIT License !*/
/// <reference lib="es2015" />

declare global {
	export type nul = null | undefined | void;
	export type Awaitable<T> = T | PromiseLike<T>;
	export type NettleWeb = typeof NettleWeb & { readonly NettleWeb: NettleWeb; };
	export type globalThis = typeof globalThis & { readonly NettleWeb: NettleWeb };

	export module globalThis {
		export var window: globalThis;
		export var globalThis: globalThis;
	}

	export module NettleWeb {
		export const NettleWeb: NettleWeb;

		export function loadModule(name: string, module: any): void;
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
		// Buffer
		//////////////////////////////////////////////////////
		export type BufferView = Buffer | number[] | ArrayLike<number>;
		export type BufferData = Buffer | ArrayBufferLike | ArrayBufferView;
		export type BufferSource = Iterable<number> | ArrayLike<number> | BufferData;

		export interface Buffer extends Uint8Array, Iterable<number>, ArrayLike<number> {
			readonly length: number;
			readonly [Symbol.iterator]: () => IterableIterator<number>;
		}
		export const Buffer: {
			new(): Buffer;
			readonly prototype: Buffer;
			readonly emptyBuffer: Buffer;
			readonly from: (data: BufferSource, mapFn?: ((v: any, k: number) => number) | nul) => Buffer;
			readonly concat: (data: Iterable<BufferData> | ArrayLike<BufferData>, length?: number | nul) => Buffer;
			readonly isBuffer: (obj: any) => obj is Buffer;
			readonly isArrayBuffer: (obj: any) => obj is ArrayBufferLike;
		};

		//////////////////////////////////////////////////////
		// Random
		//////////////////////////////////////////////////////
		export interface Random<Seed = number> {
			readonly seed: Seed | null;
			readonly setSeed: (seed: Seed) => void;
			readonly rand: () => number;
			readonly randBuf: (buf: number[] | Buffer) => void;
			readonly randInt: (max?: number | nul, min?: number | nul) => number;
			readonly randUUID: () => string;
		}
		export const Random: {
			new <S>(algorithm?: string | nul, seed?: S | nul): Random<S>;
			new(algorithm: "sfc32", seed?: NettleWeb.BufferView | nul): Random<number[]>;
			new(algorithm: "splitmix32", seed?: number | nul): Random<number>;
			new(algorithm: "mulberry32", seed?: number | nul): Random<number>;
			new(algorithm: "xoshiro128", seed?: NettleWeb.BufferView | nul): Random<number[]>;
			readonly prototype: Random;
		};

		export interface SecureRandom extends Random<number[]> {
			readonly aes: AES;
			readonly counter: number[];
			readonly setCounter: (counter: CounterInit) => void;
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
			readonly encode: (data: string) => Buffer;
			readonly decode: (data: BufferView) => string;
		}
		export const Charset: {
			new(name: string): Charset;
			readonly prototype: Charset;
			readonly forName: (name: string) => Charset;
			readonly isSupported: (name: string) => boolean;
			readonly defaultCharset: () => Charset;
		};

		//////////////////////////////////////////////////////
		// Streams
		/////////////////////////////////////////////////////
		export interface Stream {
			readonly sync: boolean;
			readonly closed: boolean;
			readonly canRead: boolean;
			readonly canWrite: boolean;
			readonly close: () => Awaitable<void>;
		}
		export const Stream: {
			new(sync?: boolean | nul, canRead?: boolean | nul, canWrite?: boolean | nul): Stream;
			readonly prototype: Stream;
		};

		export interface SyncStream extends Stream {
			readonly close: () => void;
		}
		export const SyncStream: {
			new(canRead?: boolean | nul, canWrite?: boolean | nul): SyncStream;
		};

		export interface ReadStream extends Stream {
			readonly pipe: (out: WriteStream) => Promise<number>;
			readonly read: () => Awaitable<number>;
			readonly readBuf: (buf: Buffer, off?: number | nul, len?: number | nul) => Awaitable<number>;
			readonly readText: (len: number, charset?: string | nul) => Awaitable<string>;
			readonly readNBytes: (n: number) => Awaitable<Buffer>;
			readonly readAllBytes: () => Awaitable<Buffer>;
		}
		export const ReadStream: {
			new(): ReadStream;
			readonly prototype: ReadStream;
		};

		export interface SyncReadStream extends SyncStream {
			readonly read: () => number;
			readonly readBuf: (buf: Buffer, off?: number | nul, len?: number | nul) => number;
			readonly readText: (len: number, charset?: string | nul) => string;
			readonly readNBytes: (n: number) => Buffer;
			readonly readAllBytes: () => Buffer;
			readonly pipe: (out: WriteStream) => Promise<number>;
			readonly pipeSync: (out: SyncWriteStream) => number;
		}
		export const SyncReadStream: {
			new(): SyncReadStream;
			readonly prototype: SyncReadStream;
		};

		export interface WriteStream extends Stream {
			readonly flush: () => Awaitable<void>;
			readonly write: (b: number) => Awaitable<void>;
			readonly writeBuf: (buf: Buffer, off?: number | nul, len?: number | nul) => Awaitable<void>;
			readonly writeText: (text: string, charset?: string | nul) => Awaitable<void>;
		}
		export const WriteStream: {
			new(): WriteStream;
			readonly prototype: WriteStream;
		};

		export interface SyncWriteStream extends SyncStream {
			readonly flush: () => void;
			readonly write: (b: number) => void;
			readonly writeBuf: (buf: Buffer, off?: number | nul, len?: number | nul) => void;
			readonly writeText: (text: string, charset?: string | nul) => void;
		}
		export const SyncWriteStream: {
			new(): SyncWriteStream;
			readonly prototype: SyncWriteStream;
		};

		export interface BufferReadStream extends SyncReadStream {
			index: number;
			buffer: Buffer;
		}
		export const BufferReadStream: {
			new(buf: Buffer, index?: number | nul): BufferReadStream;
			readonly prototype: BufferReadStream;
		};

		export interface BufferWriteStream extends SyncWriteStream {
			readonly toBuffer: () => Buffer;
		}
		export const BufferWriteStream: {
			new(): BufferWriteStream;
			readonly prototype: BufferWriteStream;
		};

		//////////////////////////////////////////////////////
		// Async Lock
		//////////////////////////////////////////////////////
		export interface AsyncLock extends PromiseLike<void> {
			readonly locked: boolean;
			readonly lock: () => void;
			readonly unlock: () => void;
		}
		export const AsyncLock: {
			new(): AsyncLock;
			readonly prototype: AsyncLock;
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
			readonly encrypt: (data: BufferView) => number[];
			readonly decrypt: (data: BufferView) => number[];
			readonly encryptCTR: (data: BufferView, counter?: CounterInit | nul) => number[];
			readonly decryptCTR: (data: BufferView, counter?: CounterInit | nul) => number[];
		}
		export const AES: {
			new(seed: BufferView): AES;
			readonly prototype: AES;
		};

		//////////////////////////////////////////////////////
		// Hash Functions
		//////////////////////////////////////////////////////
		export function md5(data: string | BufferView): string;
		export function sha256(data: string | BufferView): string;
		export function cyrb128(data: string | BufferView): string;
	}
}

export { NettleWeb };
export default NettleWeb;