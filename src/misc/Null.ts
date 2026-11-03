import { freeze, getPrototypeOf, setPrototypeOf } from "./intrinsics.js";
import { defProp } from "./objutil.js";

const Null: typeof NettleWeb.Null = setPrototypeOf(function __struct__(this: unknown) {
	if (typeof new.target === "function") {
		for (let p = getPrototypeOf(this); p != null; p = getPrototypeOf(p)) {
			try {
				delete p["constructor"];
			} catch (err) { }
		}
	}
}, null);

defProp(Null, "prototype", freeze({ __proto__: null }));
export default freeze(Null);
