import HmacStream from "./HmacStream.js";
import Sha1Stream from "./Sha1Stream.js";
export default class HmacSha1Stream extends HmacStream {
    get algorithm() {
        return "hmac-sha1";
    }
    get hashLength() {
        return 20;
    }
    constructor(key) {
        super(key, new Sha1Stream(), 64);
    }
}
