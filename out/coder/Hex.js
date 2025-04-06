const hexDigits = "0123456789abcdef";
const Hex = {
    encode: (data) => {
        let str = "";
        for (const b of data) {
            str += hexDigits[b >> 4];
            str += hexDigits[b & 0x0f];
        }
        return str;
    },
    decode: (data) => {
        const length = Math.floor(data.length / 2);
        const buffer = new Uint8Array(length);
        for (let i = 0, p = 0; i < length; i++)
            buffer[i] = parseInt(data.slice(p, p += 2), 16);
        return buffer;
    }
};
export default Object.freeze(Object.setPrototypeOf(Hex, null));
