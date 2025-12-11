import { defProp } from "./objutil.js";

const Null: typeof NettleWeb.Null = Object.setPrototypeOf(function __struct__(this: unknown) {
	if (typeof new.target === "function") {
		for (let p = Object.getPrototypeOf(this); p != null; p = Object.getPrototypeOf(p)) {
			try {
				delete p["constructor"];
			} catch (err) { }
		}
	}
}, null);

defProp(Null, "prototype", Object.freeze(Object.create(null)));
export default Object.freeze(Null);
