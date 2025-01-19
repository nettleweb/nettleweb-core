const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lookup = new Uint8Array(new ArrayBuffer(256), 0, 256);
for (let i = 0; i < chars.length; i++)
    lookup[chars.charCodeAt(i)] = i;
const Base64 = {
    encode: (data) => {
        const len = data.byteLength;
        let result = "";
        for (let i = 0; i < len; i += 3) {
            const group = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
            result += chars[(group >> 18) & 63] + chars[(group >> 12) & 63] + chars[(group >> 6) & 63] + chars[group & 63];
        }
        switch (len % 3) {
            case 1:
                return result.slice(0, -2) + "==";
            case 2:
                return result.slice(0, -1) + "=";
            default:
                return result;
        }
    },
    decode: (text) => {
        const len = text.length;
        const buf = new Uint8Array(len * 0.75 - (text.slice(len - 2) === "==" ? 2 : text[len - 1] === "=" ? 1 : 0));
        let index = 0;
        for (let i = 0; i < len; i += 4) {
            const group = (lookup[text.charCodeAt(i)] << 18) | (lookup[text.charCodeAt(i + 1)] << 12) | (lookup[text.charCodeAt(i + 2)] << 6) | lookup[text.charCodeAt(i + 3)];
            buf[index++] = (group >> 16) & 255;
            buf[index++] = (group >> 8) & 255;
            buf[index++] = group & 255;
        }
        return buf;
    }
};
export default Object.freeze(Object.setPrototypeOf(Base64, null));
