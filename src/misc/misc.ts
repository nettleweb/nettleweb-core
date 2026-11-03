import { Array, floor, random, Uint8Array } from "./intrinsics.js";

export const DEFAULT_CMP = (a: any, b: any) => a < b ? -1 : a > b ? 1 : 0
export const emptyBuffer = new Uint8Array(0);
export const singleBuffer = new Uint8Array(1);

export function initCounter(state?: NettleWeb.CounterInit | nul): number[] {
	if (state == null) {
		const arr = new Array(16);
		arr[15] = 1;
		return arr;
	} else if (typeof state === "number") {
		let value: number = state;
		const arr = new Array(16);

		for (let i = 15; i >= 0; --i) {
			arr[i] = value % 256;
			value = floor(value / 256);
		}

		return arr;
	} else {
		const arr = Array.from(state);
		if (arr.length !== 16)
			throw new Error("Counter state must have a length of 16.");

		return arr;
	}
}

export function incrCounter(counter: number[]) {
	for (let i = 15; i >= 0; i--) {
		if (counter[i] < 255) {
			counter[i]++;
			break;
		} else counter[i] = 0;
	}
}

export function bufferMerge(b1: NettleWeb.BufferView, b2: NettleWeb.BufferView): NettleWeb.Buffer {
	const offset = b1.length;
	const buffer = new Uint8Array(offset + b2.length);
	buffer.set(b1, 0);
	buffer.set(b2, offset);
	return buffer;
}

export function bufferConcat(data: Iterable<NettleWeb.BufferView>, length?: number | nul): NettleWeb.Buffer {
	if (typeof length !== "number" || length < 0) {
		length = 0;

		for (const e of data)
			length += e.length;
	}

	const buffer = new Uint8Array(length);
	let offset: number = 0;

	for (const e of data) {
		const length = e.length;
		buffer.set(e, offset);
		offset += length;
	}

	return buffer;
}

export function seedgen32(): number {
	return (random() * 4294967296) >>> 0;
}

export function seedgen256(): number[] {
	const seed: number[] = new Array(32);
	for (let i = 0, p = 0; i < 4; i++) {
		const rand = seedgen32();
		seed[p++] = rand & 0xff;
		seed[p++] = (rand >> 8) & 0xff;
		seed[p++] = (rand >> 16) & 0xff;
		seed[p++] = (rand >> 24) & 0xff;
	}
	return seed;
}

export function bytesToInt32(bytes: NettleWeb.BufferView): number[] {
	const length = (bytes.length / 4) >>> 0;
	const result = new Array(length);

	for (let i = 0, p = 0; i < length; i++)
		result[i] = ((bytes[p++] & 0xff) << 24) | ((bytes[p++] & 0xff) << 16) | ((bytes[p++] & 0xff) << 8) | (bytes[p++] & 0xff);

	return result;
}
