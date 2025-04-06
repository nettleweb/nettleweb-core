import Stream from "./Stream.js";

export default abstract class ReadStreamBase extends Stream implements NettleWeb.ReadStreamBase {
	constructor() {
		super(true, false);
	}

	abstract readBuf(buf: NettleWeb.Buffer, off?: number | nul, len?: number | nul): Awaitable<number>;

	async pipe(out: NettleWeb.WriteStream): Promise<number> {
		const buffer = new Uint8Array(new ArrayBuffer(8192), 0, 8192);

		let i: number = 0;
		let len: number = 0;

		while ((i = await this.readBuf(buffer, 0, 8192)) >= 0) {
			await out.writeBuf(buffer, 0, i);
			await out.flush();
			len += i;
		}

		return len;
	}
}