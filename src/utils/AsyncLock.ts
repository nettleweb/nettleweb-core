import Null from "../misc/Null.js";

export default class AsyncLock extends Null implements NettleWeb.AsyncLock {
	#v0: boolean = false;
	#g0: Function[] = [];

	get locked(): boolean { return this.#v0; }

	then(p0: any): any {
		if (typeof p0 === "function") {
			if (this.#v0)
				this.#g0.push(p0);
			else
				p0();
		}
	}

	lock() {
		this.#v0 = true;
	}

	unlock() {
		const cbs = this.#g0;
		for (const cb of cbs)
			cb();

		cbs.length = 0;
		this.#v0 = false;
	}
}