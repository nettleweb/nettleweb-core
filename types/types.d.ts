/// <reference lib="es2015" />

declare global {
	export type nul = null | undefined | void;
	export type Awaitable<T> = T | PromiseLike<T>;
	export type NettleWeb = typeof NettleWeb & nul;
	export type globalThis = typeof globalThis & nul;

	export module NettleWeb {
		export const NettleWeb: NettleWeb;

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
		export type BufferBytes = Buffer | ArrayBufferLike | ArrayBufferView;
		export type BufferSource = Iterable<number> | ArrayLike<number> | BufferBytes;

		export interface Buffer extends Uint8Array, Iterable<number>, ArrayLike<number> {
			readonly length: number;
			readonly [Symbol.iterator]: () => IterableIterator<number>;
		}
		export const Buffer: {
			new(): Buffer;
			readonly prototype: Buffer;
			readonly emptyBuffer: Buffer;
			readonly from: (data: BufferSource, arg1?: any) => Buffer;
			readonly concat: (data: Iterable<BufferBytes> | ArrayLike<BufferBytes>, length?: number | nul) => Buffer;
			readonly isArrayBuffer: (obj: any) => obj is ArrayBufferLike;
		};

		//////////////////////////////////////////////////////
		// Random
		//////////////////////////////////////////////////////
		export interface Random<Seed = number> {
			readonly seed: Seed | null;
			readonly rand: () => number;
			readonly randbuf: (buf: Buffer) => Buffer;
			readonly randint: (max?: number | nul, min?: number | nul) => number;
			readonly setSeed: (seed: Seed) => void;
			readonly createStream: () => ReadStream;
		}
		export const Random: {
			new <S>(algorithm?: string | nul, seed?: S | nul): Random<S>;
			new(algorithm: "sfc32", seed?: number[] | nul): Random<number[]>;
			new(algorithm: "splitmix32", seed?: number | nul): Random<number>;
			new(algorithm: "mulberry32", seed?: number | nul): Random<number>;
			new(algorithm: "xoshiro128", seed?: number[] | nul): Random<number[]>;
			readonly prototype: Random;
		};

		export interface SecureRandom extends Random<number[]> {
			readonly setSeed: (seed: number | number[]) => void;
		}
		export const SecureRandom: {
			new(seed?: number | number[] | nul): SecureRandom;
			readonly prototype: SecureRandom;
		};

		//////////////////////////////////////////////////////
		// Streams
		//////////////////////////////////////////////////////
		export interface Stream {
			readonly closed: boolean;
			readonly canRead: boolean;
			readonly canWrite: boolean;
			readonly close: () => Awaitable<void>;
		}
		export const Stream: {
			new(canRead?: boolean | nul, canWrite?: boolean | nul): Stream;
			readonly prototype: Stream;
		};

		export interface ReadStream extends Stream {
			readonly read: () => Awaitable<number>;
			readonly readBuf: (buf: Buffer) => Awaitable<number>;
			readonly readNBytes: (n: number) => Awaitable<Buffer>;
		}
		export const ReadStream: {
			new(): ReadStream;
			readonly prototype: Stream;
		};

		export interface WriteStream extends Stream {
			readonly write: (data: number | Buffer) => Awaitable<void>;
			readonly flush: () => Awaitable<void>;
		}
		export const WriteStream: {
			new(): WriteStream;
			readonly prototype: Stream;
		};

		export interface BufferReadStream extends ReadStream {
			readonly read: () => number;
			readonly readBuf: (buf: Buffer) => number;
			readonly readNBytes: (n: number) => Awaitable<Buffer>;
			readonly setIndex: (i: number) => void;
			readonly setBuffer: (buf: Buffer) => void;
		}
		export const BufferReadStream: {
			new(buf: Buffer, index?: number | nul): BufferReadStream;
			readonly prototype: BufferReadStream;
		};

		export interface BufferWriteStream extends WriteStream {
			readonly write: (data: number | Buffer) => void;
			readonly flush: () => void;
			readonly close: () => void;
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
		export type EventListener<E extends EventEmitter = any> = (this: E, ...args: any[]) => void;

		export interface EventEmitter<M extends object = any> {
			on<E extends keyof M>(event: E, listener: M[E]): void;
			on(event: EventKey, listener: EventListener<this>): void;
			once<E extends keyof M>(event: E, listener: M[E]): void;
			once(event: EventKey, listener: EventListener<this>): void;
			off<E extends keyof M>(event: E, listener: M[E]): boolean;
			off(event: EventKey, listener: EventListener<this>): boolean;
			off(event?: EventKey | nul): boolean;
			emit(event: EventKey, ...data: any[]): boolean;
			getListeners(event?: EventKey | nul): EventListener<this>[];
		}
		export const EventEmitter: {
			new <E extends object = any>(): EventEmitter<E>;
			readonly prototype: EventEmitter;
		};

		//////////////////////////////////////////////////////
		// String Coders
		//////////////////////////////////////////////////////
		export module ASCII {
			export function encode(data: string): Buffer;
			export function decode(data: Buffer): string;
		}
		export module UTF_8 {
			export function encode(data: string): Buffer;
			export function decode(data: Buffer): string;
		}
		export module UTF16BE {
			export function encode(data: string): Buffer;
			export function decode(data: Buffer): string;
		}
		export module UTF16LE {
			export function encode(data: string): Buffer;
			export function decode(data: Buffer): string;
		}
		export module UTF32BE {
			export function encode(data: string): Buffer;
			export function decode(data: Buffer): string;
		}
		export module UTF32LE {
			export function encode(data: string): Buffer;
			export function decode(data: Buffer): string;
		}

		//////////////////////////////////////////////////////
		// Binary Coders
		//////////////////////////////////////////////////////
		export module Hex {
			export function encode(data: Buffer): string;
			export function decode(data: string): Buffer;
		}
		export module Base32 {
			export function encode(data: Buffer): string;
			export function decode(data: string): Buffer;
		}
		export module Base64 {
			export function encode(data: Buffer): string;
			export function decode(data: string): Buffer;
		}

		//////////////////////////////////////////////////////
		// Object Serializers
		//////////////////////////////////////////////////////
		export module NTON {
			export function encode(data: any): Buffer;
			export function decode(data: Buffer): any;
		}

		//////////////////////////////////////////////////////
		// Utils
		//////////////////////////////////////////////////////
		export function md5(data: string): string;
		export function sha256(data: string): string;
		export function cyrb128(data: string): number[];
	}
}

export { NettleWeb };
export default NettleWeb;