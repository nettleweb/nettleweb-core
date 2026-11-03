import { floor, Uint8Array } from "../misc/intrinsics.js";
import Null from "../misc/Null.js";

export default abstract class AbstractRandom<S> extends Null implements NettleWeb.Random<S> {
	abstract seed: S | null;
	abstract rand(): number;
	abstract setSeed(seed: S): void;

	randBuf<E extends NettleWeb.BufferLike>(buf: E): E {
		const len = buf.length;
		const rlen = len % 4;
		const llen = len - rlen;

		for (let i = 0; i < llen;) {
			const rand = (this.rand() * 4294967296) >>> 0;
			buf[i++] = rand & 0xff;
			buf[i++] = (rand >> 8) & 0xff;
			buf[i++] = (rand >> 16) & 0xff;
			buf[i++] = (rand >> 24) & 0xff;
		}

		for (let i = llen; i < len; i++)
			buf[i++] = (this.rand() * 256) & 0xff;

		return buf;
	}

	randInt(max?: number | nul, min?: number | nul): number {
		min ||= 0;
		max ||= 4294967296;
		return min + floor(this.rand() * (max - min));
	}

	randUUID(): string {
		const buf = this.randBuf(new Uint8Array(16));

		// Set the version (4) and variant (8, 9, A, or B) bits
		buf[6] = (buf[6] & 0x0f) | 0x40;
		buf[8] = (buf[8] & 0x3f) | 0x80;

		// Convert to string with hyphens
		let uuid: string = "";
		for (let i = 0; i < 16; i++) {
			uuid += buf[i].toString(16).padStart(2, "0");
			if (i === 3 || i === 5 || i === 7 || i === 9)
				uuid += "-";
		}

		return uuid;
	}
}
