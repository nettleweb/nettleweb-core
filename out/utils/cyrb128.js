import { UTF_8 } from "../coder/Charset.js";
export default function cyrb128(data) {
    const msg = Array.from(typeof data === "string" ? UTF_8.encode(data) : data);
    let h1 = 1779033703;
    let h2 = 3144134277;
    let h3 = 1013904242;
    let h4 = 2773480762;
    for (const k of msg) {
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return ((h1 ^ h2 ^ h3 ^ h4) >>> 0).toString(16).padStart(8, "0") +
        ((h2 ^ h1) >>> 0).toString(16).padStart(8, "0") +
        ((h3 ^ h1) >>> 0).toString(16).padStart(8, "0") +
        ((h4 ^ h1) >>> 0).toString(16).padStart(8, "0");
}
