const Hex = {
    encode: (data) => Array.from(data, (e) => {
        const n = (e & 0xff).toString(16);
        return n.length === 1 ? "0" + n : n;
    }).join(""),
    decode: (data) => {
        const length = Math.floor(data.length / 2);
        const buffer = new Uint8Array(new ArrayBuffer(length), 0, length);
        for (let i = 0, p = 0; i < length; i++)
            buffer[i] = parseInt(data.slice(p, p += 2), 16);
        return buffer;
    }
};
export default Object.freeze(Object.setPrototypeOf(Hex, null));
