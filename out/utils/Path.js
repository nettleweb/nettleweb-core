import { freeze } from "../misc/intrinsics.js";
function simplify(path) {
    path = path.replace(/\/+/g, "/");
    if (path[0] === "/")
        path = path.slice(1);
    if (path[path.length - 1] === "/")
        path = path.slice(0, -1);
    return path;
}
export function normalize(path) {
    const newParts = [];
    if (path[0] === "/")
        path = path.slice(1);
    if (path[path.length - 1] === "/")
        path = path.slice(0, -1);
    for (const part of path.split("/")) {
        switch (part) {
            case "":
            case ".":
                break; // ignore
            case "..":
                newParts.pop();
                break;
            default:
                newParts.push(part);
                break;
        }
    }
    return "/" + newParts.join("/");
}
function join(...parts) {
    let path = "";
    for (const p of parts) {
        if (p !== "" && p !== "/")
            path += "/" + simplify(p);
    }
    return path;
}
function name(path) {
    path = simplify(path);
    const i = path.lastIndexOf("/");
    return i < 0 ? path : path.slice(i + 1);
}
function parent(path) {
    path = simplify(path);
    const i = path.lastIndexOf("/");
    return "/" + (i < 0 ? "" : path.slice(0, i));
}
function extname(path) {
    path = name(path);
    const i = path.indexOf(".");
    return i < 0 ? "" : path.slice(i);
}
const Path = {
    __proto__: null,
    name,
    join,
    parent,
    extname,
    normalize
};
export default freeze(Path);
