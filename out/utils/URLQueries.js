import StringMap, { getEntries } from "./StringMap.js";
export default class URLQueries extends StringMap {
    constructor(init) {
        if (typeof (init ||= "") === "string") {
            super();
            if (init[0] === "?")
                init = init.slice(1);
            const entries = getEntries(this);
            for (const e of init.split("&")) {
                const sep = e.indexOf("=");
                if (sep > 0)
                    entries[decodeURIComponent(e.slice(0, sep))] = decodeURIComponent(e.slice(sep + 1));
                else
                    entries[decodeURIComponent(e)] = "";
            }
        }
        else
            super(init);
    }
    toString() {
        const entries = getEntries(this);
        const keys = Object.keys(entries);
        const len = keys.length;
        const out = new Array(len);
        for (let i = 0; i < len; i++) {
            const k = keys[i];
            out[i] = encodeURIComponent(k) + "=" + encodeURIComponent(entries[k]);
        }
        return out.join("&");
    }
}
