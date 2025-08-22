import Null from "../misc/Null.js";
import URLQueries from "./URLQueries.js";

export default class URL extends Null implements NettleWeb.URL {
	scheme: string;
	host: string;
	port: string = "";
	path: string = "/";
	query: string = "";
	fragment: string = "";

	constructor(data: string | NettleWeb.URLData) {
		super();
		if (typeof data === "string") {
			let pos_start: number = 0;
			let pos_end: number;

			// Parse scheme
			if ((pos_end = data.indexOf("://")) < 1)
				throw new Error("Invalid URL: Missing scheme");

			this.scheme = data.slice(0, pos_end);
			pos_start = pos_end + 3;

			// Parse fragment
			if ((pos_end = data.indexOf("#", pos_start)) > 0) {
				this.fragment = data.slice(pos_end + 1);
				data = data.slice(0, pos_end); // Modify string to simplify next steps
			}

			// Parse query
			if ((pos_end = data.indexOf("?", pos_start)) > 0) {
				this.query = data.slice(pos_end + 1);
				data = data.slice(0, pos_end);
			}

			// Parse host and path
			let host_port: string;

			if ((pos_end = data.indexOf("/", pos_start)) > 0) {
				host_port = data.slice(pos_start, pos_end);
				this.path = data.slice(pos_end);
			} else {
				// No path, so the rest is host/port
				host_port = data.slice(pos_start);
			}

			if (host_port.length < 1)
				throw new Error("Invalid URL: Missing host");

			if ((pos_start = host_port.indexOf(":")) > 0) {
				this.host = host_port.slice(0, pos_start);
				this.port = host_port.slice(pos_start + 1);
			} else this.host = host_port;
		} else {
			this.scheme = data.scheme;
			this.host = data.host;
			this.port = data.port;
			this.path = data.path;
			this.query = data.query;
			this.fragment = data.fragment;
		}
	}

	queries(): NettleWeb.URLQueries {
		return new URLQueries(this.query);
	}

	toString(): string {
		const { port, host, query, fragment } = this;
		let data = this.scheme + ":";

		if (host.length > 0)
			data += "//" + host;
		if (port.length > 0)
			data += ":" + port;

		data += this.path || "/";
		if (query.length > 0)
			data += "?" + query;
		if (fragment.length > 0)
			data += "#" + fragment;

		return data;
	}
}