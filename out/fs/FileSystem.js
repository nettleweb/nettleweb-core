import { emptyBuffer } from "../misc/misc.js";
import Null from "../misc/Null.js";
export default class FileSystem extends Null {
    //	#map: NettleWeb.FSMap;
    constructor() {
        super();
        throw new Error("Stub API is used!");
        //		this.#map = map || new AsyncMap();
    }
    async list(path) {
        return [];
    }
    async copy(src, dest) {
    }
    async move(src, dest) {
    }
    async link(src, dest) {
    }
    async read(path) {
        return emptyBuffer;
    }
    async mkdir(path) {
    }
    async write(path, data) {
    }
    async append(path, data) {
    }
    async delete(path) {
    }
    async exists(path) {
        return false;
    }
    async getInfo(path) {
        return null;
    }
    async isRegular(path) {
        return false;
    }
    async isSymlink(path) {
        return false;
    }
    async isDirectory(path) {
        return false;
    }
    subFileSystem(root) {
        throw new Error("Function not implemented");
    }
    createReadStream(path, start) {
        throw new Error("Function not implemented");
    }
    createWriteStream(path, append) {
        throw new Error("Function not implemented");
    }
}
