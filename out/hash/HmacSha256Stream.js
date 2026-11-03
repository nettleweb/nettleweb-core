import HmacStream from "./HmacStream.js";
import Sha256Stream from "./Sha256Stream.js";
export default class HmacSha256Stream extends HmacStream {
    get algorithm() {
        return "hmac-sha256";
    }
    get hashLength() {
        return 32;
    }
    constructor(key) {
        super(key, new Sha256Stream(), 64);
    }
}
