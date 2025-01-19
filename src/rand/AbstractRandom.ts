import Null from "../misc/Null.js";
import RandomStream from "./RandomStream.js";

export default class AbstractRandom<S> extends Null implements NettleWeb.Random<S> {
	#seed: S | null;
	get seed(): S | null { return this.#seed; }

	static [Symbol.hasInstance](e: any): boolean {
		try {
			e.#seed;
			return true;
		} catch(err) {
			return false;
		}
	}

	constructor(seed?: S | nul) {
		super();
		this.#seed = seed || null;
	}

	rand(): number {
		throw new Error("Function not implemented");
	}

	randbuf(buffer: NettleWeb.Buffer): NettleWeb.Buffer {
		const length = buffer.byteLength;
		for (let i = 0; i < length; i++)
			buffer[i] = Math.floor(this.rand() * 256) & 0xff;

		return buffer;
	}

	randint(max?: number | nul, min?: number | nul): number {
		return (min ||= 0) + Math.floor(this.rand() * ((max || 0xffff_ffff) - min));
	}

	setSeed(seed: S) {
		this.#seed = seed || null;
	}

	createStream(): NettleWeb.ReadStream {
		return new RandomStream(this);
	}
}