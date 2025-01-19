const ASCII = {
    encode: (data) => Uint8Array.from(data, (e) => e.charCodeAt(0)),
    decode: (data) => Array.from(data, (e) => String.fromCharCode(e)).join("")
};
export default Object.freeze(Object.setPrototypeOf(ASCII, null));
