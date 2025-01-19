import Null from "../misc/Null.js";

export default class EventEmitter extends Null implements NettleWeb.EventEmitter {
	readonly #listeners: Record<NettleWeb.EventKey, {
		$: NettleWeb.EventListener,
		m: boolean;
	}[] | nul> = Object.create(null);

	on(e: NettleWeb.EventKey, f: NettleWeb.EventListener) {
		const list = (this.#listeners[e] ||= []);
		for (const it of list) {
			if (it.$ === f) {
				it.m = false;
				return;
			}
		}

		list.push({ $: f, m: false });
	}

	once(e: NettleWeb.EventKey, f: NettleWeb.EventListener) {
		const list = (this.#listeners[e] ||= []);
		for (const it of list) {
			if (it.$ === f) {
				it.m = true;
				return;
			}
		}
		list.push({ $: f, m: true });
	}

	off(e: NettleWeb.EventKey | nul, f: NettleWeb.EventListener | nul): boolean {
		const map = this.#listeners;
		if (e != null) {
			const list = map[e];
			if (list != null && list.length > 0) {
				if (f != null) {
					for (let i = 0; i < list.length; i++) {
						if (list[i].$ === f) {
							list.splice(i, 1);
							return true;
						}
					}
					return false;
				}
				return delete map[e];
			}
			return false;
		}

		if (f != null) {
			let rt: boolean = false;

			for (const k of Reflect.ownKeys(map)) {
				const list = map[k];
				if (list != null) {
					$: for (let i = 0; i < list.length; i++) {
						if (list[i].$ === f) {
							list.splice(i, 1);
							rt = true;
							break $;
						}
					}
				}
			}

			return rt;
		}


		let rt: boolean = false;

		for (const k of Object.keys(map)) {
			if (delete map[k])
				rt = true;
		}

		return rt;
	}

	emit(e: NettleWeb.EventKey, ...v: any[]): boolean {
		const list = this.#listeners[e];
		if (list != null) {
			let rt: boolean = false;

			for (let i = 0; i < list.length; i++) {
				const it = list[i];

				rt = true;
				if (it.m)
					list.splice(i--, 1);

				Reflect.apply(it.$, this, v);
			}

			return rt;
		}
		return false;
	}

	getListeners(e?: NettleWeb.EventKey | nul): NettleWeb.EventListener[] {
		if (e != null)
			return this.#listeners[e]?.map((e) => e.$) || [];

		const map = this.#listeners;
		const set = new Set<NettleWeb.EventListener>();

		for (const k of Reflect.ownKeys(map)) {
			const list = map[k];
			if (list != null) {
				for (const e of list)
					set.add(e.$);
			}
		}

		return Array.from(set);
	}
}