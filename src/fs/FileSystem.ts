import { emptyBuffer } from "../misc/misc.js";
import Null from "../misc/Null.js";

export default class FileSystem extends Null implements NettleWeb.FileSystem {
//	#map: NettleWeb.FSMap;

	constructor() {
		super();
		throw new Error("Stub API is used!");
//		this.#map = map || new AsyncMap();
	}

	async list(path: string): Promise<string[]> {
		return [];
	}

	async copy(src: string, dest: string): Promise<void> {
	}

	async move(src: string, dest: string): Promise<void> {
	}

	async link(src: string, dest: string): Promise<void> {
	}

	async read(path: string): Promise<NettleWeb.Buffer> {
		return emptyBuffer;
	}

	async mkdir(path: string): Promise<void> {
	}

	async write(path: string, data: NettleWeb.Buffer): Promise<void> {
	}

	async append(path: string, data: NettleWeb.Buffer): Promise<void> {
	}

	async delete(path: string): Promise<void> {
	}

	async exists(path: string): Promise<boolean> {
		return false;
	}

	async getInfo(path: string): Promise<NettleWeb.FileInfo | null> {
		return null;
	}

	async isRegular(path: string): Promise<boolean> {
		return false;
	}

	async isSymlink(path: string): Promise<boolean> {
		return false;
	}

	async isDirectory(path: string): Promise<boolean> {
		return false;
	}

	subFileSystem(root: string): NettleWeb.FileSystem {
		throw new Error("Function not implemented");
	}

	createReadStream(path: string, start?: number | nul): NettleWeb.ReadStream {
		throw new Error("Function not implemented");
	}

	createWriteStream(path: string, append?: boolean | nul): NettleWeb.WriteStream {
		throw new Error("Function not implemented");
	}
}