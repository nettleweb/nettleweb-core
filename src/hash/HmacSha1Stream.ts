import HmacStream from "./HmacStream.js";
import Sha1Stream from "./Sha1Stream.js";

export default class HmacSha1Stream extends HmacStream implements NettleWeb.HmacSha1Stream {
	get algorithm(): string {
		return "hmac-sha1";
	}
	get hashLength(): number {
		return 20;
	}

	constructor(key: NettleWeb.BufferView) {
		super(key, new Sha1Stream(), 64);
	}
}
