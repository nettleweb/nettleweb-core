
export const __THROW: any = Object.freeze((Object.setPrototypeOf(() => {
	throw __THROW;
}, null)));

export const emptyBuffer = new Uint8Array(new ArrayBuffer(0), 0, 0);

export function isArrayBuffer(obj: any): obj is ArrayBuffer {
	try {
		new DataView(obj, 0, 0);
		return true;
	} catch (err) {
		return false;
	}
}

export function isBuffer(obj: any): obj is NettleWeb.Buffer {
	return ArrayBuffer.isView(obj) && (obj as NettleWeb.Buffer)[Symbol.toStringTag] === "Uint8Array";
}

export function seedgen(): number {
	return Math.floor(Math.random() * 4294967296);
}