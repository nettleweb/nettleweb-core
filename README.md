# NettleWeb Core
The core JavaScript support framework used by NettleWeb projects.

This library was created for extending the standard JavaScript API while avoiding duplicated dependencies across the modules. It is designed to be fast and lightweight without using dependencies or any platform-specific APIs. It can be safely used in browsers, Node.js or other environments that support the `es2022` standard.

## Install
```
npm install @nettleweb/core@latest
```

## Modules
#### Streams
- `Buffer` - alias for `Uint8Array` but with additional static methods.
- `Stream` - the base class for `ReadStream` and `WriteStream`.
- `ReadStream` - an abstract readable binary stream.
- `WriteStream` - an abstract writable binary stream.
- `BufferReadStream` - a readable stream that uses a `Uint8Array` as source.
- `BufferWriteStream` - a writable stream that writes data into a `Uint8Array`.

#### String Coders
- `ASCII`
- `UTF_8` - useful when `TextEncoder` and `TextDecoder` are not available.
- `UTF16BE`
- `UTF16LE`
- `UTF32BE`
- `UTF32LE`

#### Binary Coders
- `Hex` - a tool for encoding and decoding `Uint8Array` into hexadecimal strings.
- `Base32` - a tool for encoding and decoding `Uint8Array` into Base32 strings.
- `Base64` - a tool for encoding and decoding `Uint8Array` into Base64 strings.

#### Object Serializers
- `NTON` - an object serializer that encodes objects into `Uint8Array`. (based on the [`nton`](https://github.com/ruochenjia/nton) npm module)

#### Random Number Generators
- `Random` - a random number generator interface with multiple algorithm and seeding support.
- `SecureRandom` - a cryptographically secure random number generator with seeding support.

#### Other Utils
- `md5` - generate MD5 checksum from strings.
- `cyrb128` - a 128 bit string hashing function.
- `AsyncLock` - interface for preventing concurrent async executions.
- `EventEmitter` - a polyfill for the `EventEmitter` interface in Node.js.

## Examples
```js
import NettleWeb from "@nettleweb/core";

// extract modules for easier access later
const { UTF_8, Base32 } = NettleWeb;

// encode a string into a Uint8Array using utf-8 encoding
const buf = UTF_8.encode("google");

// encode the Uint8Array into a base32 string
const str = Base32.encode(buf);
```
Note: For more detailed usage information, please refer to the type declarations in `types/types.d.ts`. This library does not perform strict type checking for providing better performance, so it is important to pass the correct values to each API in order to avoid unexpected results.

## License
This repository is licensed under the MIT License. You are free to modify or redistribute this project under the terms stated in LICENSE.md.
