import { seedgen } from "../misc/misc.js";
import AbstractRandom from "./AbstractRandom.js";
export default class SecureRandom extends AbstractRandom {
    constructor(seed) {
        super(typeof (seed ||= seedgen()) === "number" ? seed = [seed] : seed);
        this.setSeed(seed);
    }
    #m = new Array(256); // internal memory
    #r = new Array(256); // result array
    #acc = 0; // accumulator
    #brs = 0; // last result
    #cnt = 0; // counter
    #gnt = 0; // generation counter
    #add(x, y) {
        const lsb = (x & 0xffff) + (y & 0xffff);
        const msb = (x >>> 16) + (y >>> 16) + (lsb >>> 16);
        return (msb << 16) | (lsb & 0xffff);
    }
    #prng(n) {
        let x;
        let y;
        n = typeof n === "number" ? Math.abs(Math.floor(n)) : 1;
        while (n--) {
            this.#cnt = this.#add(this.#cnt, 1);
            this.#brs = this.#add(this.#brs, this.#cnt);
            for (let i = 0; i < 256; i++) {
                switch (i & 3) {
                    case 0:
                        this.#acc ^= this.#acc << 13;
                        break;
                    case 1:
                        this.#acc ^= this.#acc >>> 6;
                        break;
                    case 2:
                        this.#acc ^= this.#acc << 2;
                        break;
                    case 3:
                        this.#acc ^= this.#acc >>> 16;
                        break;
                }
                this.#acc = this.#add(this.#m[(i + 128) & 0xff], this.#acc);
                x = this.#m[i];
                this.#m[i] = y = this.#add(this.#m[(x >>> 2) & 0xff], this.#add(this.#acc, this.#brs));
                this.#r[i] = this.#brs = this.#add(this.#m[(y >>> 10) & 0xff], x);
            }
        }
    }
    rand() {
        if (!this.#gnt--) {
            this.#prng();
            this.#gnt = 255;
        }
        return (this.#r[this.#gnt] >>> 0) / 4294967296;
    }
    reset() {
        this.#acc = this.#brs = this.#cnt = this.#gnt = 0;
        this.#m.fill(0, 0, 256);
        this.#r.fill(0, 0, 256);
    }
    setSeed(seed) {
        let a, b, c, d, e, f, g, h;
        a = b = c = d = e = f = g = h = 0x9e3779b9;
        if (typeof seed === "number")
            seed = [seed];
        if (!Array.isArray(seed))
            seed = [0];
        this.reset();
        const r = this.#r;
        const m = this.#m;
        for (let i = 0; i < seed.length; i++)
            r[i & 0xff] += (typeof seed[i] === 'number' ? seed[i] : 0);
        const seedMix = () => {
            a ^= b << 11;
            d = this.#add(d, a);
            b = this.#add(b, c);
            b ^= c >>> 2;
            e = this.#add(e, b);
            c = this.#add(c, d);
            c ^= d << 8;
            f = this.#add(f, c);
            d = this.#add(d, e);
            d ^= e >>> 16;
            g = this.#add(g, d);
            e = this.#add(e, f);
            e ^= f << 10;
            h = this.#add(h, e);
            f = this.#add(f, g);
            f ^= g >>> 4;
            a = this.#add(a, f);
            g = this.#add(g, h);
            g ^= h << 8;
            b = this.#add(b, g);
            h = this.#add(h, a);
            h ^= a >>> 9;
            c = this.#add(c, h);
            a = this.#add(a, b);
        };
        /* scramble it */
        for (let i = 0; i < 4; i++)
            seedMix();
        for (let i = 0; i < 256; i += 8) {
            /* use all the information in the seed */
            a = this.#add(a, r[i + 0]);
            b = this.#add(b, r[i + 1]);
            c = this.#add(c, r[i + 2]);
            d = this.#add(d, r[i + 3]);
            e = this.#add(e, r[i + 4]);
            f = this.#add(f, r[i + 5]);
            g = this.#add(g, r[i + 6]);
            h = this.#add(h, r[i + 7]);
            seedMix();
            /* fill in m[] with messy stuff */
            m[i + 0] = a;
            m[i + 1] = b;
            m[i + 2] = c;
            m[i + 3] = d;
            m[i + 4] = e;
            m[i + 5] = f;
            m[i + 6] = g;
            m[i + 7] = h;
        }
        /* do a second pass to make all of the seed affect all of m[] */
        for (let i = 0; i < 256; i += 8) {
            a = this.#add(a, m[i + 0]);
            b = this.#add(b, m[i + 1]);
            c = this.#add(c, m[i + 2]);
            d = this.#add(d, m[i + 3]);
            e = this.#add(e, m[i + 4]);
            f = this.#add(f, m[i + 5]);
            g = this.#add(g, m[i + 6]);
            h = this.#add(h, m[i + 7]);
            seedMix();
            /* fill in m[] with messy stuff (again) */
            m[i + 0] = a;
            m[i + 1] = b;
            m[i + 2] = c;
            m[i + 3] = d;
            m[i + 4] = e;
            m[i + 5] = f;
            m[i + 6] = g;
            m[i + 7] = h;
        }
        /* fill in the first set of results */
        this.#prng();
        /* prepare to use the first set of results */ ;
        this.#gnt = 256;
    }
}
