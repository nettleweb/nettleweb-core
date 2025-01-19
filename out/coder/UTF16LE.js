const UTF16LE = {
    encode: (data) => {
        const length = data.length * 2;
        const buffer = new ArrayBuffer(length);
        const dataView = new DataView(buffer, 0, length);
        for (let i = 0, p = 0; i < length; i += 2, p++)
            dataView.setUint16(i, data.charCodeAt(p) || 0xfffd, true);
        return new Uint8Array(buffer, 0, length);
    },
    decode: (data) => {
        const length = Math.floor(data.byteLength / 2);
        const output = new Array(length);
        const dataView = new DataView(data.buffer, data.byteOffset, length * 2);
        for (let i = 0, p = 0; p < length; i += 2, p++)
            output[p] = String.fromCharCode(dataView.getUint16(i, true));
        return output.join("");
    }
};
export default Object.freeze(Object.setPrototypeOf(UTF16LE, null));
