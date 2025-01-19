import Null from "../misc/Null.js";
import RandomStream from "./RandomStream.js";
export default class AbstractRandom extends Null {
    #seed;
    get seed() { return this.#seed; }
    static [Symbol.hasInstance](e) {
        try {
            e.#seed;
            return true;
        }
        catch (err) {
            return false;
        }
    }
    constructor(seed) {
        super();
        this.#seed = seed || null;
    }
    rand() {
        throw new Error("Function not implemented");
    }
    randbuf(buffer) {
        const length = buffer.byteLength;
        for (let i = 0; i < length; i++)
            buffer[i] = Math.floor(this.rand() * 256) & 0xff;
        return buffer;
    }
    randint(max, min) {
        return (min ||= 0) + Math.floor(this.rand() * ((max || 0xffff_ffff) - min));
    }
    setSeed(seed) {
        this.#seed = seed || null;
    }
    createStream() {
        return new RandomStream(this);
    }
}
