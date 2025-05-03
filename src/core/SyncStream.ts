import Stream from "./Stream.js";

export default class SyncStream extends Stream implements NettleWeb.SyncStream {
	constructor(read?: boolean | nul, write?: boolean | nul) {
		super(true, read, write);
	}

	close() {
		super.close();
	}
}