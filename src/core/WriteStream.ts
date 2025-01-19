import Stream from "./Stream.js";

export default class WriteStream extends Stream implements NettleWeb.WriteStream {
	constructor() {
		super(false, true);
	}

	write(data: number | NettleWeb.Buffer) {
	}

	flush() {
	}
}