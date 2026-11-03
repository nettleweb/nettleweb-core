import HmacStream from "./HmacStream.js";
import Sha256Stream from "./Sha256Stream.js";

export default class HmacSha256Stream extends HmacStream implements NettleWeb.HmacSha256Stream {
	get algorithm(): string {
		return "hmac-sha256";
	}
	get hashLength(): number {
		return 32;
	}

	constructor(key: NettleWeb.BufferView) {
		super(key, new Sha256Stream(), 64);
	}
}
