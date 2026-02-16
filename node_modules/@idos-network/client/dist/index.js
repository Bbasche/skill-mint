import { KwilSigner, NodeKwil, Utils, WebKwil } from "@kwilteam/kwil-js";
import invariant from "tiny-invariant";
import { negate } from "es-toolkit";
import { every, get } from "es-toolkit/compat";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function.");
});

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+hex@1.0.1/node_modules/@stablelib/hex/lib/hex.js
var require_hex = __commonJS({ "../../node_modules/.pnpm/@stablelib+hex@1.0.1/node_modules/@stablelib/hex/lib/hex.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Package hex implements hex encoder and decoder.
	*/
	function encodeNibble(b) {
		var result = b + 48;
		result += 9 - b >>> 8 & 7;
		return String.fromCharCode(result);
	}
	function encodeNibbleLower(b) {
		var result = b + 48;
		result += 9 - b >>> 8 & 39;
		return String.fromCharCode(result);
	}
	var INVALID_HEX_NIBBLE = 256;
	function decodeNibble(c) {
		var result = INVALID_HEX_NIBBLE;
		result += (47 - c & c - 58) >> 8 & -INVALID_HEX_NIBBLE + c - 48;
		result += (64 - c & c - 71) >> 8 & -INVALID_HEX_NIBBLE + c - 65 + 10;
		result += (96 - c & c - 103) >> 8 & -INVALID_HEX_NIBBLE + c - 97 + 10;
		return result;
	}
	/**
	* Returns string with hex-encoded data.
	*/
	function encode$2(data, lowerCase) {
		if (lowerCase === void 0) lowerCase = false;
		var enc = lowerCase ? encodeNibbleLower : encodeNibble;
		var s = "";
		for (var i = 0; i < data.length; i++) {
			s += enc(data[i] >>> 4);
			s += enc(data[i] & 15);
		}
		return s;
	}
	exports.encode = encode$2;
	/**
	* Returns Uint8Array with data decoded from hex string.
	*
	* Throws error if hex string length is not divisible by 2 or has non-hex
	* characters.
	*/
	function decode$2(hex) {
		if (hex.length === 0) return new Uint8Array(0);
		if (hex.length % 2 !== 0) throw new Error("hex: input string must be divisible by two");
		var result = new Uint8Array(hex.length / 2);
		var haveBad = 0;
		for (var i = 0; i < hex.length; i += 2) {
			var v0 = decodeNibble(hex.charCodeAt(i));
			var v1 = decodeNibble(hex.charCodeAt(i + 1));
			result[i / 2] = v0 << 4 | v1;
			haveBad |= v0 & INVALID_HEX_NIBBLE;
			haveBad |= v1 & INVALID_HEX_NIBBLE;
		}
		if (haveBad !== 0) throw new Error("hex: incorrect characters for decoding");
		return result;
	}
	exports.decode = decode$2;
} });

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+int@1.0.1/node_modules/@stablelib/int/lib/int.js
var require_int = __commonJS({ "../../node_modules/.pnpm/@stablelib+int@1.0.1/node_modules/@stablelib/int/lib/int.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Package int provides helper functions for integerss.
	*/
	function imulShim(a, b) {
		var ah = a >>> 16 & 65535, al = a & 65535;
		var bh = b >>> 16 & 65535, bl = b & 65535;
		return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
	}
	/** 32-bit integer multiplication.  */
	exports.mul = Math.imul || imulShim;
	/** 32-bit integer addition.  */
	function add(a, b) {
		return a + b | 0;
	}
	exports.add = add;
	/**  32-bit integer subtraction.  */
	function sub(a, b) {
		return a - b | 0;
	}
	exports.sub = sub;
	/** 32-bit integer left rotation */
	function rotl(x, n) {
		return x << n | x >>> 32 - n;
	}
	exports.rotl = rotl;
	/** 32-bit integer left rotation */
	function rotr(x, n) {
		return x << 32 - n | x >>> n;
	}
	exports.rotr = rotr;
	function isIntegerShim(n) {
		return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
	}
	/**
	* Returns true if the argument is an integer number.
	*
	* In ES2015, Number.isInteger.
	*/
	exports.isInteger = Number.isInteger || isIntegerShim;
	/**
	*  Math.pow(2, 53) - 1
	*
	*  In ES2015 Number.MAX_SAFE_INTEGER.
	*/
	exports.MAX_SAFE_INTEGER = 9007199254740991;
	/**
	* Returns true if the argument is a safe integer number
	* (-MIN_SAFE_INTEGER < number <= MAX_SAFE_INTEGER)
	*
	* In ES2015, Number.isSafeInteger.
	*/
	exports.isSafeInteger = function(n) {
		return exports.isInteger(n) && n >= -exports.MAX_SAFE_INTEGER && n <= exports.MAX_SAFE_INTEGER;
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+binary@1.0.1/node_modules/@stablelib/binary/lib/binary.js
var require_binary = __commonJS({ "../../node_modules/.pnpm/@stablelib+binary@1.0.1/node_modules/@stablelib/binary/lib/binary.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Package binary provides functions for encoding and decoding numbers in byte arrays.
	*/
	var int_1 = require_int();
	/**
	* Reads 2 bytes from array starting at offset as big-endian
	* signed 16-bit integer and returns it.
	*/
	function readInt16BE(array, offset) {
		if (offset === void 0) offset = 0;
		return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
	}
	exports.readInt16BE = readInt16BE;
	/**
	* Reads 2 bytes from array starting at offset as big-endian
	* unsigned 16-bit integer and returns it.
	*/
	function readUint16BE(array, offset) {
		if (offset === void 0) offset = 0;
		return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
	}
	exports.readUint16BE = readUint16BE;
	/**
	* Reads 2 bytes from array starting at offset as little-endian
	* signed 16-bit integer and returns it.
	*/
	function readInt16LE(array, offset) {
		if (offset === void 0) offset = 0;
		return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
	}
	exports.readInt16LE = readInt16LE;
	/**
	* Reads 2 bytes from array starting at offset as little-endian
	* unsigned 16-bit integer and returns it.
	*/
	function readUint16LE(array, offset) {
		if (offset === void 0) offset = 0;
		return (array[offset + 1] << 8 | array[offset]) >>> 0;
	}
	exports.readUint16LE = readUint16LE;
	/**
	* Writes 2-byte big-endian representation of 16-bit unsigned
	* value to byte array starting at offset.
	*
	* If byte array is not given, creates a new 2-byte one.
	*
	* Returns the output byte array.
	*/
	function writeUint16BE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(2);
		if (offset === void 0) offset = 0;
		out[offset + 0] = value >>> 8;
		out[offset + 1] = value >>> 0;
		return out;
	}
	exports.writeUint16BE = writeUint16BE;
	exports.writeInt16BE = writeUint16BE;
	/**
	* Writes 2-byte little-endian representation of 16-bit unsigned
	* value to array starting at offset.
	*
	* If byte array is not given, creates a new 2-byte one.
	*
	* Returns the output byte array.
	*/
	function writeUint16LE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(2);
		if (offset === void 0) offset = 0;
		out[offset + 0] = value >>> 0;
		out[offset + 1] = value >>> 8;
		return out;
	}
	exports.writeUint16LE = writeUint16LE;
	exports.writeInt16LE = writeUint16LE;
	/**
	* Reads 4 bytes from array starting at offset as big-endian
	* signed 32-bit integer and returns it.
	*/
	function readInt32BE(array, offset) {
		if (offset === void 0) offset = 0;
		return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
	}
	exports.readInt32BE = readInt32BE;
	/**
	* Reads 4 bytes from array starting at offset as big-endian
	* unsigned 32-bit integer and returns it.
	*/
	function readUint32BE(array, offset) {
		if (offset === void 0) offset = 0;
		return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
	}
	exports.readUint32BE = readUint32BE;
	/**
	* Reads 4 bytes from array starting at offset as little-endian
	* signed 32-bit integer and returns it.
	*/
	function readInt32LE(array, offset) {
		if (offset === void 0) offset = 0;
		return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
	}
	exports.readInt32LE = readInt32LE;
	/**
	* Reads 4 bytes from array starting at offset as little-endian
	* unsigned 32-bit integer and returns it.
	*/
	function readUint32LE(array, offset) {
		if (offset === void 0) offset = 0;
		return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
	}
	exports.readUint32LE = readUint32LE;
	/**
	* Writes 4-byte big-endian representation of 32-bit unsigned
	* value to byte array starting at offset.
	*
	* If byte array is not given, creates a new 4-byte one.
	*
	* Returns the output byte array.
	*/
	function writeUint32BE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(4);
		if (offset === void 0) offset = 0;
		out[offset + 0] = value >>> 24;
		out[offset + 1] = value >>> 16;
		out[offset + 2] = value >>> 8;
		out[offset + 3] = value >>> 0;
		return out;
	}
	exports.writeUint32BE = writeUint32BE;
	exports.writeInt32BE = writeUint32BE;
	/**
	* Writes 4-byte little-endian representation of 32-bit unsigned
	* value to array starting at offset.
	*
	* If byte array is not given, creates a new 4-byte one.
	*
	* Returns the output byte array.
	*/
	function writeUint32LE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(4);
		if (offset === void 0) offset = 0;
		out[offset + 0] = value >>> 0;
		out[offset + 1] = value >>> 8;
		out[offset + 2] = value >>> 16;
		out[offset + 3] = value >>> 24;
		return out;
	}
	exports.writeUint32LE = writeUint32LE;
	exports.writeInt32LE = writeUint32LE;
	/**
	* Reads 8 bytes from array starting at offset as big-endian
	* signed 64-bit integer and returns it.
	*
	* IMPORTANT: due to JavaScript limitation, supports exact
	* numbers in range -9007199254740991 to 9007199254740991.
	* If the number stored in the byte array is outside this range,
	* the result is not exact.
	*/
	function readInt64BE(array, offset) {
		if (offset === void 0) offset = 0;
		var hi = readInt32BE(array, offset);
		var lo = readInt32BE(array, offset + 4);
		return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
	}
	exports.readInt64BE = readInt64BE;
	/**
	* Reads 8 bytes from array starting at offset as big-endian
	* unsigned 64-bit integer and returns it.
	*
	* IMPORTANT: due to JavaScript limitation, supports values up to 2^53-1.
	*/
	function readUint64BE(array, offset) {
		if (offset === void 0) offset = 0;
		var hi = readUint32BE(array, offset);
		var lo = readUint32BE(array, offset + 4);
		return hi * 4294967296 + lo;
	}
	exports.readUint64BE = readUint64BE;
	/**
	* Reads 8 bytes from array starting at offset as little-endian
	* signed 64-bit integer and returns it.
	*
	* IMPORTANT: due to JavaScript limitation, supports exact
	* numbers in range -9007199254740991 to 9007199254740991.
	* If the number stored in the byte array is outside this range,
	* the result is not exact.
	*/
	function readInt64LE(array, offset) {
		if (offset === void 0) offset = 0;
		var lo = readInt32LE(array, offset);
		var hi = readInt32LE(array, offset + 4);
		return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
	}
	exports.readInt64LE = readInt64LE;
	/**
	* Reads 8 bytes from array starting at offset as little-endian
	* unsigned 64-bit integer and returns it.
	*
	* IMPORTANT: due to JavaScript limitation, supports values up to 2^53-1.
	*/
	function readUint64LE(array, offset) {
		if (offset === void 0) offset = 0;
		var lo = readUint32LE(array, offset);
		var hi = readUint32LE(array, offset + 4);
		return hi * 4294967296 + lo;
	}
	exports.readUint64LE = readUint64LE;
	/**
	* Writes 8-byte big-endian representation of 64-bit unsigned
	* value to byte array starting at offset.
	*
	* Due to JavaScript limitation, supports values up to 2^53-1.
	*
	* If byte array is not given, creates a new 8-byte one.
	*
	* Returns the output byte array.
	*/
	function writeUint64BE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(8);
		if (offset === void 0) offset = 0;
		writeUint32BE(value / 4294967296 >>> 0, out, offset);
		writeUint32BE(value >>> 0, out, offset + 4);
		return out;
	}
	exports.writeUint64BE = writeUint64BE;
	exports.writeInt64BE = writeUint64BE;
	/**
	* Writes 8-byte little-endian representation of 64-bit unsigned
	* value to byte array starting at offset.
	*
	* Due to JavaScript limitation, supports values up to 2^53-1.
	*
	* If byte array is not given, creates a new 8-byte one.
	*
	* Returns the output byte array.
	*/
	function writeUint64LE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(8);
		if (offset === void 0) offset = 0;
		writeUint32LE(value >>> 0, out, offset);
		writeUint32LE(value / 4294967296 >>> 0, out, offset + 4);
		return out;
	}
	exports.writeUint64LE = writeUint64LE;
	exports.writeInt64LE = writeUint64LE;
	/**
	* Reads bytes from array starting at offset as big-endian
	* unsigned bitLen-bit integer and returns it.
	*
	* Supports bit lengths divisible by 8, up to 48.
	*/
	function readUintBE(bitLength, array, offset) {
		if (offset === void 0) offset = 0;
		if (bitLength % 8 !== 0) throw new Error("readUintBE supports only bitLengths divisible by 8");
		if (bitLength / 8 > array.length - offset) throw new Error("readUintBE: array is too short for the given bitLength");
		var result = 0;
		var mul = 1;
		for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
			result += array[i] * mul;
			mul *= 256;
		}
		return result;
	}
	exports.readUintBE = readUintBE;
	/**
	* Reads bytes from array starting at offset as little-endian
	* unsigned bitLen-bit integer and returns it.
	*
	* Supports bit lengths divisible by 8, up to 48.
	*/
	function readUintLE(bitLength, array, offset) {
		if (offset === void 0) offset = 0;
		if (bitLength % 8 !== 0) throw new Error("readUintLE supports only bitLengths divisible by 8");
		if (bitLength / 8 > array.length - offset) throw new Error("readUintLE: array is too short for the given bitLength");
		var result = 0;
		var mul = 1;
		for (var i = offset; i < offset + bitLength / 8; i++) {
			result += array[i] * mul;
			mul *= 256;
		}
		return result;
	}
	exports.readUintLE = readUintLE;
	/**
	* Writes a big-endian representation of bitLen-bit unsigned
	* value to array starting at offset.
	*
	* Supports bit lengths divisible by 8, up to 48.
	*
	* If byte array is not given, creates a new one.
	*
	* Returns the output byte array.
	*/
	function writeUintBE(bitLength, value, out, offset) {
		if (out === void 0) out = new Uint8Array(bitLength / 8);
		if (offset === void 0) offset = 0;
		if (bitLength % 8 !== 0) throw new Error("writeUintBE supports only bitLengths divisible by 8");
		if (!int_1.isSafeInteger(value)) throw new Error("writeUintBE value must be an integer");
		var div = 1;
		for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
			out[i] = value / div & 255;
			div *= 256;
		}
		return out;
	}
	exports.writeUintBE = writeUintBE;
	/**
	* Writes a little-endian representation of bitLen-bit unsigned
	* value to array starting at offset.
	*
	* Supports bit lengths divisible by 8, up to 48.
	*
	* If byte array is not given, creates a new one.
	*
	* Returns the output byte array.
	*/
	function writeUintLE(bitLength, value, out, offset) {
		if (out === void 0) out = new Uint8Array(bitLength / 8);
		if (offset === void 0) offset = 0;
		if (bitLength % 8 !== 0) throw new Error("writeUintLE supports only bitLengths divisible by 8");
		if (!int_1.isSafeInteger(value)) throw new Error("writeUintLE value must be an integer");
		var div = 1;
		for (var i = offset; i < offset + bitLength / 8; i++) {
			out[i] = value / div & 255;
			div *= 256;
		}
		return out;
	}
	exports.writeUintLE = writeUintLE;
	/**
	* Reads 4 bytes from array starting at offset as big-endian
	* 32-bit floating-point number and returns it.
	*/
	function readFloat32BE(array, offset) {
		if (offset === void 0) offset = 0;
		var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
		return view.getFloat32(offset);
	}
	exports.readFloat32BE = readFloat32BE;
	/**
	* Reads 4 bytes from array starting at offset as little-endian
	* 32-bit floating-point number and returns it.
	*/
	function readFloat32LE(array, offset) {
		if (offset === void 0) offset = 0;
		var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
		return view.getFloat32(offset, true);
	}
	exports.readFloat32LE = readFloat32LE;
	/**
	* Reads 8 bytes from array starting at offset as big-endian
	* 64-bit floating-point number ("double") and returns it.
	*/
	function readFloat64BE(array, offset) {
		if (offset === void 0) offset = 0;
		var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
		return view.getFloat64(offset);
	}
	exports.readFloat64BE = readFloat64BE;
	/**
	* Reads 8 bytes from array starting at offset as little-endian
	* 64-bit floating-point number ("double") and returns it.
	*/
	function readFloat64LE(array, offset) {
		if (offset === void 0) offset = 0;
		var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
		return view.getFloat64(offset, true);
	}
	exports.readFloat64LE = readFloat64LE;
	/**
	* Writes 4-byte big-endian floating-point representation of value
	* to byte array starting at offset.
	*
	* If byte array is not given, creates a new 4-byte one.
	*
	* Returns the output byte array.
	*/
	function writeFloat32BE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(4);
		if (offset === void 0) offset = 0;
		var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
		view.setFloat32(offset, value);
		return out;
	}
	exports.writeFloat32BE = writeFloat32BE;
	/**
	* Writes 4-byte little-endian floating-point representation of value
	* to byte array starting at offset.
	*
	* If byte array is not given, creates a new 4-byte one.
	*
	* Returns the output byte array.
	*/
	function writeFloat32LE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(4);
		if (offset === void 0) offset = 0;
		var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
		view.setFloat32(offset, value, true);
		return out;
	}
	exports.writeFloat32LE = writeFloat32LE;
	/**
	* Writes 8-byte big-endian floating-point representation of value
	* to byte array starting at offset.
	*
	* If byte array is not given, creates a new 8-byte one.
	*
	* Returns the output byte array.
	*/
	function writeFloat64BE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(8);
		if (offset === void 0) offset = 0;
		var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
		view.setFloat64(offset, value);
		return out;
	}
	exports.writeFloat64BE = writeFloat64BE;
	/**
	* Writes 8-byte little-endian floating-point representation of value
	* to byte array starting at offset.
	*
	* If byte array is not given, creates a new 8-byte one.
	*
	* Returns the output byte array.
	*/
	function writeFloat64LE(value, out, offset) {
		if (out === void 0) out = new Uint8Array(8);
		if (offset === void 0) offset = 0;
		var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
		view.setFloat64(offset, value, true);
		return out;
	}
	exports.writeFloat64LE = writeFloat64LE;
} });

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js
var require_wipe = __commonJS({ "../../node_modules/.pnpm/@stablelib+wipe@1.0.1/node_modules/@stablelib/wipe/lib/wipe.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Sets all values in the given array to zero and returns it.
	*
	* The fact that it sets bytes to zero can be relied on.
	*
	* There is no guarantee that this function makes data disappear from memory,
	* as runtime implementation can, for example, have copying garbage collector
	* that will make copies of sensitive data before we wipe it. Or that an
	* operating system will write our data to swap or sleep image. Another thing
	* is that an optimizing compiler can remove calls to this function or make it
	* no-op. There's nothing we can do with it, so we just do our best and hope
	* that everything will be okay and good will triumph over evil.
	*/
	function wipe(array) {
		for (var i = 0; i < array.length; i++) array[i] = 0;
		return array;
	}
	exports.wipe = wipe;
} });

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+sha256@1.0.1/node_modules/@stablelib/sha256/lib/sha256.js
var require_sha256 = __commonJS({ "../../node_modules/.pnpm/@stablelib+sha256@1.0.1/node_modules/@stablelib/sha256/lib/sha256.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var binary_1 = require_binary();
	var wipe_1 = require_wipe();
	exports.DIGEST_LENGTH = 32;
	exports.BLOCK_SIZE = 64;
	/**
	* SHA2-256 cryptographic hash algorithm.
	*/
	var SHA256 = function() {
		function SHA256$1() {
			/** Length of hash output */
			this.digestLength = exports.DIGEST_LENGTH;
			/** Block size */
			this.blockSize = exports.BLOCK_SIZE;
			this._state = new Int32Array(8);
			this._temp = new Int32Array(64);
			this._buffer = new Uint8Array(128);
			this._bufferLength = 0;
			this._bytesHashed = 0;
			this._finished = false;
			this.reset();
		}
		SHA256$1.prototype._initState = function() {
			this._state[0] = 1779033703;
			this._state[1] = 3144134277;
			this._state[2] = 1013904242;
			this._state[3] = 2773480762;
			this._state[4] = 1359893119;
			this._state[5] = 2600822924;
			this._state[6] = 528734635;
			this._state[7] = 1541459225;
		};
		/**
		* Resets hash state making it possible
		* to re-use this instance to hash other data.
		*/
		SHA256$1.prototype.reset = function() {
			this._initState();
			this._bufferLength = 0;
			this._bytesHashed = 0;
			this._finished = false;
			return this;
		};
		/**
		* Cleans internal buffers and resets hash state.
		*/
		SHA256$1.prototype.clean = function() {
			wipe_1.wipe(this._buffer);
			wipe_1.wipe(this._temp);
			this.reset();
		};
		/**
		* Updates hash state with the given data.
		*
		* Throws error when trying to update already finalized hash:
		* instance must be reset to update it again.
		*/
		SHA256$1.prototype.update = function(data, dataLength) {
			if (dataLength === void 0) dataLength = data.length;
			if (this._finished) throw new Error("SHA256: can't update because hash was finished.");
			var dataPos = 0;
			this._bytesHashed += dataLength;
			if (this._bufferLength > 0) {
				while (this._bufferLength < this.blockSize && dataLength > 0) {
					this._buffer[this._bufferLength++] = data[dataPos++];
					dataLength--;
				}
				if (this._bufferLength === this.blockSize) {
					hashBlocks(this._temp, this._state, this._buffer, 0, this.blockSize);
					this._bufferLength = 0;
				}
			}
			if (dataLength >= this.blockSize) {
				dataPos = hashBlocks(this._temp, this._state, data, dataPos, dataLength);
				dataLength %= this.blockSize;
			}
			while (dataLength > 0) {
				this._buffer[this._bufferLength++] = data[dataPos++];
				dataLength--;
			}
			return this;
		};
		/**
		* Finalizes hash state and puts hash into out.
		* If hash was already finalized, puts the same value.
		*/
		SHA256$1.prototype.finish = function(out) {
			if (!this._finished) {
				var bytesHashed = this._bytesHashed;
				var left = this._bufferLength;
				var bitLenHi = bytesHashed / 536870912 | 0;
				var bitLenLo = bytesHashed << 3;
				var padLength = bytesHashed % 64 < 56 ? 64 : 128;
				this._buffer[left] = 128;
				for (var i = left + 1; i < padLength - 8; i++) this._buffer[i] = 0;
				binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
				binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
				hashBlocks(this._temp, this._state, this._buffer, 0, padLength);
				this._finished = true;
			}
			for (var i = 0; i < this.digestLength / 4; i++) binary_1.writeUint32BE(this._state[i], out, i * 4);
			return this;
		};
		/**
		* Returns the final hash digest.
		*/
		SHA256$1.prototype.digest = function() {
			var out = new Uint8Array(this.digestLength);
			this.finish(out);
			return out;
		};
		/**
		* Function useful for HMAC/PBKDF2 optimization.
		* Returns hash state to be used with restoreState().
		* Only chain value is saved, not buffers or other
		* state variables.
		*/
		SHA256$1.prototype.saveState = function() {
			if (this._finished) throw new Error("SHA256: cannot save finished state");
			return {
				state: new Int32Array(this._state),
				buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
				bufferLength: this._bufferLength,
				bytesHashed: this._bytesHashed
			};
		};
		/**
		* Function useful for HMAC/PBKDF2 optimization.
		* Restores state saved by saveState() and sets bytesHashed
		* to the given value.
		*/
		SHA256$1.prototype.restoreState = function(savedState) {
			this._state.set(savedState.state);
			this._bufferLength = savedState.bufferLength;
			if (savedState.buffer) this._buffer.set(savedState.buffer);
			this._bytesHashed = savedState.bytesHashed;
			this._finished = false;
			return this;
		};
		/**
		* Cleans state returned by saveState().
		*/
		SHA256$1.prototype.cleanSavedState = function(savedState) {
			wipe_1.wipe(savedState.state);
			if (savedState.buffer) wipe_1.wipe(savedState.buffer);
			savedState.bufferLength = 0;
			savedState.bytesHashed = 0;
		};
		return SHA256$1;
	}();
	exports.SHA256 = SHA256;
	var K = new Int32Array([
		1116352408,
		1899447441,
		3049323471,
		3921009573,
		961987163,
		1508970993,
		2453635748,
		2870763221,
		3624381080,
		310598401,
		607225278,
		1426881987,
		1925078388,
		2162078206,
		2614888103,
		3248222580,
		3835390401,
		4022224774,
		264347078,
		604807628,
		770255983,
		1249150122,
		1555081692,
		1996064986,
		2554220882,
		2821834349,
		2952996808,
		3210313671,
		3336571891,
		3584528711,
		113926993,
		338241895,
		666307205,
		773529912,
		1294757372,
		1396182291,
		1695183700,
		1986661051,
		2177026350,
		2456956037,
		2730485921,
		2820302411,
		3259730800,
		3345764771,
		3516065817,
		3600352804,
		4094571909,
		275423344,
		430227734,
		506948616,
		659060556,
		883997877,
		958139571,
		1322822218,
		1537002063,
		1747873779,
		1955562222,
		2024104815,
		2227730452,
		2361852424,
		2428436474,
		2756734187,
		3204031479,
		3329325298
	]);
	function hashBlocks(w, v, p, pos, len) {
		while (len >= 64) {
			var a = v[0];
			var b = v[1];
			var c = v[2];
			var d = v[3];
			var e = v[4];
			var f = v[5];
			var g = v[6];
			var h = v[7];
			for (var i = 0; i < 16; i++) {
				var j = pos + i * 4;
				w[i] = binary_1.readUint32BE(p, j);
			}
			for (var i = 16; i < 64; i++) {
				var u = w[i - 2];
				var t1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
				u = w[i - 15];
				var t2 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
				w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
			}
			for (var i = 0; i < 64; i++) {
				var t1 = (((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
				var t2 = ((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + (a & b ^ a & c ^ b & c) | 0;
				h = g;
				g = f;
				f = e;
				e = d + t1 | 0;
				d = c;
				c = b;
				b = a;
				a = t1 + t2 | 0;
			}
			v[0] += a;
			v[1] += b;
			v[2] += c;
			v[3] += d;
			v[4] += e;
			v[5] += f;
			v[6] += g;
			v[7] += h;
			pos += 64;
			len -= 64;
		}
		return pos;
	}
	function hash(data) {
		var h = new SHA256();
		h.update(data);
		var digest = h.digest();
		h.clean();
		return digest;
	}
	exports.hash = hash;
} });

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+utf8@1.0.2/node_modules/@stablelib/utf8/lib/utf8.js
var require_utf8 = __commonJS({ "../../node_modules/.pnpm/@stablelib+utf8@1.0.2/node_modules/@stablelib/utf8/lib/utf8.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decode = exports.encodedLength = exports.encode = void 0;
	/**
	* Package utf8 implements UTF-8 encoding and decoding.
	*/
	const INVALID_UTF16 = "utf8: invalid string";
	const INVALID_UTF8 = "utf8: invalid source encoding";
	/**
	* Encodes the given string into UTF-8 byte array.
	* Throws if the source string has invalid UTF-16 encoding.
	*/
	function encode$1(s) {
		const arr = new Uint8Array(encodedLength(s));
		let pos = 0;
		for (let i = 0; i < s.length; i++) {
			let c = s.charCodeAt(i);
			if (c >= 55296 && c <= 56319) c = (c - 55296 << 10) + (s.charCodeAt(++i) - 56320) + 65536;
			if (c < 128) arr[pos++] = c;
			else if (c < 2048) {
				arr[pos++] = 192 | c >> 6;
				arr[pos++] = 128 | c & 63;
			} else if (c < 65536) {
				arr[pos++] = 224 | c >> 12;
				arr[pos++] = 128 | c >> 6 & 63;
				arr[pos++] = 128 | c & 63;
			} else {
				arr[pos++] = 240 | c >> 18;
				arr[pos++] = 128 | c >> 12 & 63;
				arr[pos++] = 128 | c >> 6 & 63;
				arr[pos++] = 128 | c & 63;
			}
		}
		return arr;
	}
	exports.encode = encode$1;
	/**
	* Returns the number of bytes required to encode the given string into UTF-8.
	* Throws if the source string has invalid UTF-16 encoding.
	*/
	function encodedLength(s) {
		let result = 0;
		for (let i = 0; i < s.length; i++) {
			let c = s.charCodeAt(i);
			if (c >= 55296 && c <= 56319) {
				if (i === s.length - 1) throw new Error(INVALID_UTF16);
				i++;
				const c2 = s.charCodeAt(i);
				if (c2 < 56320 || c2 > 57343) throw new Error(INVALID_UTF16);
				c = (c - 55296 << 10) + (c2 - 56320) + 65536;
			}
			if (c < 128) result += 1;
			else if (c < 2048) result += 2;
			else if (c < 65536) result += 3;
			else result += 4;
		}
		return result;
	}
	exports.encodedLength = encodedLength;
	/**
	* Decodes the given byte array from UTF-8 into a string.
	* Throws if encoding is invalid.
	*/
	function decode$1(arr) {
		const chars = [];
		for (let i = 0; i < arr.length; i++) {
			let b = arr[i];
			if (b & 128) {
				let min;
				if (b < 224) {
					if (i >= arr.length) throw new Error(INVALID_UTF8);
					const n1 = arr[++i];
					if ((n1 & 192) !== 128) throw new Error(INVALID_UTF8);
					b = (b & 31) << 6 | n1 & 63;
					min = 128;
				} else if (b < 240) {
					if (i >= arr.length - 1) throw new Error(INVALID_UTF8);
					const n1 = arr[++i];
					const n2 = arr[++i];
					if ((n1 & 192) !== 128 || (n2 & 192) !== 128) throw new Error(INVALID_UTF8);
					b = (b & 15) << 12 | (n1 & 63) << 6 | n2 & 63;
					min = 2048;
				} else if (b < 248) {
					if (i >= arr.length - 2) throw new Error(INVALID_UTF8);
					const n1 = arr[++i];
					const n2 = arr[++i];
					const n3 = arr[++i];
					if ((n1 & 192) !== 128 || (n2 & 192) !== 128 || (n3 & 192) !== 128) throw new Error(INVALID_UTF8);
					b = (b & 15) << 18 | (n1 & 63) << 12 | (n2 & 63) << 6 | n3 & 63;
					min = 65536;
				} else throw new Error(INVALID_UTF8);
				if (b < min || b >= 55296 && b <= 57343) throw new Error(INVALID_UTF8);
				if (b >= 65536) {
					if (b > 1114111) throw new Error(INVALID_UTF8);
					b -= 65536;
					chars.push(String.fromCharCode(55296 | b >> 10));
					b = 56320 | b & 1023;
				}
			}
			chars.push(String.fromCharCode(b));
		}
		return chars.join("");
	}
	exports.decode = decode$1;
} });

//#endregion
//#region ../../node_modules/.pnpm/base-x@5.0.0/node_modules/base-x/src/esm/index.js
function base(ALPHABET$1) {
	if (ALPHABET$1.length >= 255) throw new TypeError("Alphabet too long");
	const BASE_MAP = new Uint8Array(256);
	for (let j = 0; j < BASE_MAP.length; j++) BASE_MAP[j] = 255;
	for (let i = 0; i < ALPHABET$1.length; i++) {
		const x = ALPHABET$1.charAt(i);
		const xc = x.charCodeAt(0);
		if (BASE_MAP[xc] !== 255) throw new TypeError(x + " is ambiguous");
		BASE_MAP[xc] = i;
	}
	const BASE = ALPHABET$1.length;
	const LEADER = ALPHABET$1.charAt(0);
	const FACTOR = Math.log(BASE) / Math.log(256);
	const iFACTOR = Math.log(256) / Math.log(BASE);
	function encode$3(source) {
		if (source instanceof Uint8Array) {} else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		let zeroes = 0;
		let length = 0;
		let pbegin = 0;
		const pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		const size = (pend - pbegin) * iFACTOR + 1 >>> 0;
		const b58 = new Uint8Array(size);
		while (pbegin !== pend) {
			let carry = source[pbegin];
			let i = 0;
			for (let it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			pbegin++;
		}
		let it2 = size - length;
		while (it2 !== size && b58[it2] === 0) it2++;
		let str = LEADER.repeat(zeroes);
		for (; it2 < size; ++it2) str += ALPHABET$1.charAt(b58[it2]);
		return str;
	}
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return new Uint8Array();
		let psz = 0;
		let zeroes = 0;
		let length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		const size = (source.length - psz) * FACTOR + 1 >>> 0;
		const b256 = new Uint8Array(size);
		while (source[psz]) {
			let carry = BASE_MAP[source.charCodeAt(psz)];
			if (carry === 255) return;
			let i = 0;
			for (let it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			psz++;
		}
		let it4 = size - length;
		while (it4 !== size && b256[it4] === 0) it4++;
		const vch = new Uint8Array(zeroes + (size - it4));
		let j = zeroes;
		while (it4 !== size) vch[j++] = b256[it4++];
		return vch;
	}
	function decode$3(string) {
		const buffer = decodeUnsafe(string);
		if (buffer) return buffer;
		throw new Error("Non-base" + BASE + " character");
	}
	return {
		encode: encode$3,
		decodeUnsafe,
		decode: decode$3
	};
}
var esm_default$1 = base;

//#endregion
//#region ../../node_modules/.pnpm/bs58@6.0.0/node_modules/bs58/src/esm/index.js
var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var esm_default = esm_default$1(ALPHABET);

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+base64@1.0.1/node_modules/@stablelib/base64/lib/base64.js
var require_base64 = __commonJS({ "../../node_modules/.pnpm/@stablelib+base64@1.0.1/node_modules/@stablelib/base64/lib/base64.js"(exports) {
	var __extends$1 = void 0 && (void 0).__extends || function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (b$1.hasOwnProperty(p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	}();
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Package base64 implements Base64 encoding and decoding.
	*/
	var INVALID_BYTE = 256;
	/**
	* Implements standard Base64 encoding.
	*
	* Operates in constant time.
	*/
	var Coder = function() {
		function Coder$1(_paddingCharacter) {
			if (_paddingCharacter === void 0) _paddingCharacter = "=";
			this._paddingCharacter = _paddingCharacter;
		}
		Coder$1.prototype.encodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 8 + 5) / 6 | 0;
			return (length + 2) / 3 * 4 | 0;
		};
		Coder$1.prototype.encode = function(data) {
			var out = "";
			var i = 0;
			for (; i < data.length - 2; i += 3) {
				var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
				out += this._encodeByte(c >>> 3 * 6 & 63);
				out += this._encodeByte(c >>> 2 * 6 & 63);
				out += this._encodeByte(c >>> 1 * 6 & 63);
				out += this._encodeByte(c >>> 0 & 63);
			}
			var left = data.length - i;
			if (left > 0) {
				var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
				out += this._encodeByte(c >>> 3 * 6 & 63);
				out += this._encodeByte(c >>> 2 * 6 & 63);
				if (left === 2) out += this._encodeByte(c >>> 1 * 6 & 63);
				else out += this._paddingCharacter || "";
				out += this._paddingCharacter || "";
			}
			return out;
		};
		Coder$1.prototype.maxDecodedLength = function(length) {
			if (!this._paddingCharacter) return (length * 6 + 7) / 8 | 0;
			return length / 4 * 3 | 0;
		};
		Coder$1.prototype.decodedLength = function(s) {
			return this.maxDecodedLength(s.length - this._getPaddingLength(s));
		};
		Coder$1.prototype.decode = function(s) {
			if (s.length === 0) return new Uint8Array(0);
			var paddingLength = this._getPaddingLength(s);
			var length = s.length - paddingLength;
			var out = new Uint8Array(this.maxDecodedLength(length));
			var op = 0;
			var i = 0;
			var haveBad = 0;
			var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
			for (; i < length - 4; i += 4) {
				v0 = this._decodeChar(s.charCodeAt(i + 0));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v0 << 2 | v1 >>> 4;
				out[op++] = v1 << 4 | v2 >>> 2;
				out[op++] = v2 << 6 | v3;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
				haveBad |= v2 & INVALID_BYTE;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (i < length - 1) {
				v0 = this._decodeChar(s.charCodeAt(i));
				v1 = this._decodeChar(s.charCodeAt(i + 1));
				out[op++] = v0 << 2 | v1 >>> 4;
				haveBad |= v0 & INVALID_BYTE;
				haveBad |= v1 & INVALID_BYTE;
			}
			if (i < length - 2) {
				v2 = this._decodeChar(s.charCodeAt(i + 2));
				out[op++] = v1 << 4 | v2 >>> 2;
				haveBad |= v2 & INVALID_BYTE;
			}
			if (i < length - 3) {
				v3 = this._decodeChar(s.charCodeAt(i + 3));
				out[op++] = v2 << 6 | v3;
				haveBad |= v3 & INVALID_BYTE;
			}
			if (haveBad !== 0) throw new Error("Base64Coder: incorrect characters for decoding");
			return out;
		};
		Coder$1.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -15;
			result += 62 - b >>> 8 & 3;
			return String.fromCharCode(result);
		};
		Coder$1.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
			result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		Coder$1.prototype._getPaddingLength = function(s) {
			var paddingLength = 0;
			if (this._paddingCharacter) {
				for (var i = s.length - 1; i >= 0; i--) {
					if (s[i] !== this._paddingCharacter) break;
					paddingLength++;
				}
				if (s.length < 4 || paddingLength > 2) throw new Error("Base64Coder: incorrect padding");
			}
			return paddingLength;
		};
		return Coder$1;
	}();
	exports.Coder = Coder;
	var stdCoder = new Coder();
	function encode(data) {
		return stdCoder.encode(data);
	}
	exports.encode = encode;
	function decode(s) {
		return stdCoder.decode(s);
	}
	exports.decode = decode;
	/**
	* Implements URL-safe Base64 encoding.
	* (Same as Base64, but '+' is replaced with '-', and '/' with '_').
	*
	* Operates in constant time.
	*/
	var URLSafeCoder = function(_super) {
		__extends$1(URLSafeCoder$1, _super);
		function URLSafeCoder$1() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		URLSafeCoder$1.prototype._encodeByte = function(b) {
			var result = b;
			result += 65;
			result += 25 - b >>> 8 & 6;
			result += 51 - b >>> 8 & -75;
			result += 61 - b >>> 8 & -13;
			result += 62 - b >>> 8 & 49;
			return String.fromCharCode(result);
		};
		URLSafeCoder$1.prototype._decodeChar = function(c) {
			var result = INVALID_BYTE;
			result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
			result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
			result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
			result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
			result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
			return result;
		};
		return URLSafeCoder$1;
	}(Coder);
	exports.URLSafeCoder = URLSafeCoder;
	var urlSafeCoder = new URLSafeCoder();
	function encodeURLSafe(data) {
		return urlSafeCoder.encode(data);
	}
	exports.encodeURLSafe = encodeURLSafe;
	function decodeURLSafe(s) {
		return urlSafeCoder.decode(s);
	}
	exports.decodeURLSafe = decodeURLSafe;
	exports.encodedLength = function(length) {
		return stdCoder.encodedLength(length);
	};
	exports.maxDecodedLength = function(length) {
		return stdCoder.maxDecodedLength(length);
	};
	exports.decodedLength = function(s) {
		return stdCoder.decodedLength(s);
	};
} });

//#endregion
//#region ../../node_modules/.pnpm/@stablelib+bytes@1.0.1/node_modules/@stablelib/bytes/lib/bytes.js
var require_bytes = __commonJS({ "../../node_modules/.pnpm/@stablelib+bytes@1.0.1/node_modules/@stablelib/bytes/lib/bytes.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	function concat() {
		var totalLength = 0;
		for (var i = 0; i < arguments.length; i++) totalLength += arguments[i].length;
		var result = new Uint8Array(totalLength);
		var offset = 0;
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			result.set(arg, offset);
			offset += arg.length;
		}
		return result;
	}
	exports.concat = concat;
} });

//#endregion
//#region ../../node_modules/.pnpm/borsh@1.0.0/node_modules/borsh/lib/esm/types.js
var integers = [
	"u8",
	"u16",
	"u32",
	"u64",
	"u128",
	"i8",
	"i16",
	"i32",
	"i64",
	"i128",
	"f32",
	"f64"
];

//#endregion
//#region ../../node_modules/.pnpm/borsh@1.0.0/node_modules/borsh/lib/esm/buffer.js
var EncodeBuffer = function() {
	function EncodeBuffer$1() {
		this.offset = 0;
		this.buffer_size = 256;
		this.buffer = new ArrayBuffer(this.buffer_size);
		this.view = new DataView(this.buffer);
	}
	EncodeBuffer$1.prototype.resize_if_necessary = function(needed_space) {
		if (this.buffer_size - this.offset < needed_space) {
			this.buffer_size = Math.max(this.buffer_size * 2, this.buffer_size + needed_space);
			var new_buffer = new ArrayBuffer(this.buffer_size);
			new Uint8Array(new_buffer).set(new Uint8Array(this.buffer));
			this.buffer = new_buffer;
			this.view = new DataView(new_buffer);
		}
	};
	EncodeBuffer$1.prototype.get_used_buffer = function() {
		return new Uint8Array(this.buffer).slice(0, this.offset);
	};
	EncodeBuffer$1.prototype.store_value = function(value, type) {
		var bSize = type.substring(1);
		var size = parseInt(bSize) / 8;
		this.resize_if_necessary(size);
		var toCall = type[0] === "f" ? "setFloat".concat(bSize) : type[0] === "i" ? "setInt".concat(bSize) : "setUint".concat(bSize);
		this.view[toCall](this.offset, value, true);
		this.offset += size;
	};
	EncodeBuffer$1.prototype.store_bytes = function(from) {
		this.resize_if_necessary(from.length);
		new Uint8Array(this.buffer).set(new Uint8Array(from), this.offset);
		this.offset += from.length;
	};
	return EncodeBuffer$1;
}();
var DecodeBuffer = function() {
	function DecodeBuffer$1(buf) {
		this.offset = 0;
		this.buffer_size = buf.length;
		this.buffer = new ArrayBuffer(buf.length);
		new Uint8Array(this.buffer).set(buf);
		this.view = new DataView(this.buffer);
	}
	DecodeBuffer$1.prototype.assert_enough_buffer = function(size) {
		if (this.offset + size > this.buffer.byteLength) throw new Error("Error in schema, the buffer is smaller than expected");
	};
	DecodeBuffer$1.prototype.consume_value = function(type) {
		var bSize = type.substring(1);
		var size = parseInt(bSize) / 8;
		this.assert_enough_buffer(size);
		var toCall = type[0] === "f" ? "getFloat".concat(bSize) : type[0] === "i" ? "getInt".concat(bSize) : "getUint".concat(bSize);
		var ret = this.view[toCall](this.offset, true);
		this.offset += size;
		return ret;
	};
	DecodeBuffer$1.prototype.consume_bytes = function(size) {
		this.assert_enough_buffer(size);
		var ret = this.buffer.slice(this.offset, this.offset + size);
		this.offset += size;
		return ret;
	};
	return DecodeBuffer$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/borsh@1.0.0/node_modules/borsh/lib/esm/utils.js
var __extends = void 0 && (void 0).__extends || function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
			d$1.__proto__ = b$1;
		} || function(d$1, b$1) {
			for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
		};
		return extendStatics(d, b);
	};
	return function(d, b) {
		if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		extendStatics(d, b);
		function __() {
			this.constructor = d;
		}
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
}();
function isArrayLike(value) {
	return Array.isArray(value) || !!value && typeof value === "object" && "length" in value && typeof value.length === "number" && (value.length === 0 || value.length > 0 && value.length - 1 in value);
}
function expect_type(value, type, fieldPath) {
	if (typeof value !== type) throw new Error("Expected ".concat(type, " not ").concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
}
function expect_bigint(value, fieldPath) {
	var basicType = [
		"number",
		"string",
		"bigint",
		"boolean"
	].includes(typeof value);
	var strObject = typeof value === "object" && value !== null && "toString" in value;
	if (!basicType && !strObject) throw new Error("Expected bigint, number, boolean or string not ".concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
}
function expect_same_size(length, expected, fieldPath) {
	if (length !== expected) throw new Error("Array length ".concat(length, " does not match schema length ").concat(expected, " at ").concat(fieldPath.join(".")));
}
function expect_enum(value, fieldPath) {
	if (typeof value !== "object" || value === null) throw new Error("Expected object not ".concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
}
var VALID_STRING_TYPES = integers.concat(["bool", "string"]);
var VALID_OBJECT_KEYS = [
	"option",
	"enum",
	"array",
	"set",
	"map",
	"struct"
];
var ErrorSchema = function(_super) {
	__extends(ErrorSchema$1, _super);
	function ErrorSchema$1(schema, expected) {
		var message = "Invalid schema: ".concat(JSON.stringify(schema), " expected ").concat(expected);
		return _super.call(this, message) || this;
	}
	return ErrorSchema$1;
}(Error);
function validate_schema(schema) {
	if (typeof schema === "string" && VALID_STRING_TYPES.includes(schema)) return;
	if (schema && typeof schema === "object") {
		var keys = Object.keys(schema);
		if (keys.length === 1 && VALID_OBJECT_KEYS.includes(keys[0])) {
			var key = keys[0];
			if (key === "option") return validate_schema(schema[key]);
			if (key === "enum") return validate_enum_schema(schema[key]);
			if (key === "array") return validate_array_schema(schema[key]);
			if (key === "set") return validate_schema(schema[key]);
			if (key === "map") return validate_map_schema(schema[key]);
			if (key === "struct") return validate_struct_schema(schema[key]);
		}
	}
	throw new ErrorSchema(schema, VALID_OBJECT_KEYS.join(", ") + " or " + VALID_STRING_TYPES.join(", "));
}
function validate_enum_schema(schema) {
	if (!Array.isArray(schema)) throw new ErrorSchema(schema, "Array");
	for (var _i = 0, schema_1 = schema; _i < schema_1.length; _i++) {
		var sch = schema_1[_i];
		if (typeof sch !== "object" || !("struct" in sch)) throw new Error("Missing \"struct\" key in enum schema");
		if (typeof sch.struct !== "object" || Object.keys(sch.struct).length !== 1) throw new Error("The \"struct\" in each enum must have a single key");
		validate_schema({ struct: sch.struct });
	}
}
function validate_array_schema(schema) {
	if (typeof schema !== "object") throw new ErrorSchema(schema, "{ type, len? }");
	if (schema.len && typeof schema.len !== "number") throw new Error("Invalid schema: ".concat(schema));
	if ("type" in schema) return validate_schema(schema.type);
	throw new ErrorSchema(schema, "{ type, len? }");
}
function validate_map_schema(schema) {
	if (typeof schema === "object" && "key" in schema && "value" in schema) {
		validate_schema(schema.key);
		validate_schema(schema.value);
	} else throw new ErrorSchema(schema, "{ key, value }");
}
function validate_struct_schema(schema) {
	if (typeof schema !== "object") throw new ErrorSchema(schema, "object");
	for (var key in schema) validate_schema(schema[key]);
}

//#endregion
//#region ../../node_modules/.pnpm/borsh@1.0.0/node_modules/borsh/lib/esm/serialize.js
var BorshSerializer = function() {
	function BorshSerializer$1(checkTypes) {
		this.encoded = new EncodeBuffer();
		this.fieldPath = ["value"];
		this.checkTypes = checkTypes;
	}
	BorshSerializer$1.prototype.encode = function(value, schema) {
		this.encode_value(value, schema);
		return this.encoded.get_used_buffer();
	};
	BorshSerializer$1.prototype.encode_value = function(value, schema) {
		if (typeof schema === "string") {
			if (integers.includes(schema)) return this.encode_integer(value, schema);
			if (schema === "string") return this.encode_string(value);
			if (schema === "bool") return this.encode_boolean(value);
		}
		if (typeof schema === "object") {
			if ("option" in schema) return this.encode_option(value, schema);
			if ("enum" in schema) return this.encode_enum(value, schema);
			if ("array" in schema) return this.encode_array(value, schema);
			if ("set" in schema) return this.encode_set(value, schema);
			if ("map" in schema) return this.encode_map(value, schema);
			if ("struct" in schema) return this.encode_struct(value, schema);
		}
	};
	BorshSerializer$1.prototype.encode_integer = function(value, schema) {
		var size = parseInt(schema.substring(1));
		if (size <= 32 || schema == "f64") {
			this.checkTypes && expect_type(value, "number", this.fieldPath);
			this.encoded.store_value(value, schema);
		} else {
			this.checkTypes && expect_bigint(value, this.fieldPath);
			this.encode_bigint(BigInt(value), size);
		}
	};
	BorshSerializer$1.prototype.encode_bigint = function(value, size) {
		var buffer_len = size / 8;
		var buffer = new Uint8Array(buffer_len);
		for (var i = 0; i < buffer_len; i++) {
			buffer[i] = Number(value & BigInt(255));
			value = value >> BigInt(8);
		}
		this.encoded.store_bytes(new Uint8Array(buffer));
	};
	BorshSerializer$1.prototype.encode_string = function(value) {
		this.checkTypes && expect_type(value, "string", this.fieldPath);
		var _value = value;
		this.encoded.store_value(_value.length, "u32");
		for (var i = 0; i < _value.length; i++) this.encoded.store_value(_value.charCodeAt(i), "u8");
	};
	BorshSerializer$1.prototype.encode_boolean = function(value) {
		this.checkTypes && expect_type(value, "boolean", this.fieldPath);
		this.encoded.store_value(value ? 1 : 0, "u8");
	};
	BorshSerializer$1.prototype.encode_option = function(value, schema) {
		if (value === null || value === void 0) this.encoded.store_value(0, "u8");
		else {
			this.encoded.store_value(1, "u8");
			this.encode_value(value, schema.option);
		}
	};
	BorshSerializer$1.prototype.encode_enum = function(value, schema) {
		this.checkTypes && expect_enum(value, this.fieldPath);
		var valueKey = Object.keys(value)[0];
		for (var i = 0; i < schema["enum"].length; i++) {
			var valueSchema = schema["enum"][i];
			if (valueKey === Object.keys(valueSchema.struct)[0]) {
				this.encoded.store_value(i, "u8");
				return this.encode_struct(value, valueSchema);
			}
		}
		throw new Error("Enum key (".concat(valueKey, ") not found in enum schema: ").concat(JSON.stringify(schema), " at ").concat(this.fieldPath.join(".")));
	};
	BorshSerializer$1.prototype.encode_array = function(value, schema) {
		if (isArrayLike(value)) return this.encode_arraylike(value, schema);
		if (value instanceof ArrayBuffer) return this.encode_buffer(value, schema);
		throw new Error("Expected Array-like not ".concat(typeof value, "(").concat(value, ") at ").concat(this.fieldPath.join(".")));
	};
	BorshSerializer$1.prototype.encode_arraylike = function(value, schema) {
		if (schema.array.len) expect_same_size(value.length, schema.array.len, this.fieldPath);
		else this.encoded.store_value(value.length, "u32");
		for (var i = 0; i < value.length; i++) this.encode_value(value[i], schema.array.type);
	};
	BorshSerializer$1.prototype.encode_buffer = function(value, schema) {
		if (schema.array.len) expect_same_size(value.byteLength, schema.array.len, this.fieldPath);
		else this.encoded.store_value(value.byteLength, "u32");
		this.encoded.store_bytes(new Uint8Array(value));
	};
	BorshSerializer$1.prototype.encode_set = function(value, schema) {
		this.checkTypes && expect_type(value, "object", this.fieldPath);
		var isSet = value instanceof Set;
		var values = isSet ? Array.from(value.values()) : Object.values(value);
		this.encoded.store_value(values.length, "u32");
		for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
			var value_1 = values_1[_i];
			this.encode_value(value_1, schema.set);
		}
	};
	BorshSerializer$1.prototype.encode_map = function(value, schema) {
		this.checkTypes && expect_type(value, "object", this.fieldPath);
		var isMap = value instanceof Map;
		var keys = isMap ? Array.from(value.keys()) : Object.keys(value);
		this.encoded.store_value(keys.length, "u32");
		for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
			var key = keys_1[_i];
			this.encode_value(key, schema.map.key);
			this.encode_value(isMap ? value.get(key) : value[key], schema.map.value);
		}
	};
	BorshSerializer$1.prototype.encode_struct = function(value, schema) {
		this.checkTypes && expect_type(value, "object", this.fieldPath);
		for (var _i = 0, _a = Object.keys(schema.struct); _i < _a.length; _i++) {
			var key = _a[_i];
			this.fieldPath.push(key);
			this.encode_value(value[key], schema.struct[key]);
			this.fieldPath.pop();
		}
	};
	return BorshSerializer$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/borsh@1.0.0/node_modules/borsh/lib/esm/deserialize.js
var BorshDeserializer = function() {
	function BorshDeserializer$1(bufferArray) {
		this.buffer = new DecodeBuffer(bufferArray);
	}
	BorshDeserializer$1.prototype.decode = function(schema) {
		return this.decode_value(schema);
	};
	BorshDeserializer$1.prototype.decode_value = function(schema) {
		if (typeof schema === "string") {
			if (integers.includes(schema)) return this.decode_integer(schema);
			if (schema === "string") return this.decode_string();
			if (schema === "bool") return this.decode_boolean();
		}
		if (typeof schema === "object") {
			if ("option" in schema) return this.decode_option(schema);
			if ("enum" in schema) return this.decode_enum(schema);
			if ("array" in schema) return this.decode_array(schema);
			if ("set" in schema) return this.decode_set(schema);
			if ("map" in schema) return this.decode_map(schema);
			if ("struct" in schema) return this.decode_struct(schema);
		}
		throw new Error("Unsupported type: ".concat(schema));
	};
	BorshDeserializer$1.prototype.decode_integer = function(schema) {
		var size = parseInt(schema.substring(1));
		if (size <= 32 || schema == "f64") return this.buffer.consume_value(schema);
		return this.decode_bigint(size, schema.startsWith("i"));
	};
	BorshDeserializer$1.prototype.decode_bigint = function(size, signed) {
		if (signed === void 0) signed = false;
		var buffer_len = size / 8;
		var buffer = new Uint8Array(this.buffer.consume_bytes(buffer_len));
		var bits = buffer.reduceRight(function(r, x) {
			return r + x.toString(16).padStart(2, "0");
		}, "");
		if (signed && buffer[buffer_len - 1]) return BigInt.asIntN(size, BigInt("0x".concat(bits)));
		return BigInt("0x".concat(bits));
	};
	BorshDeserializer$1.prototype.decode_string = function() {
		var len = this.decode_integer("u32");
		var buffer = new Uint8Array(this.buffer.consume_bytes(len));
		return String.fromCharCode.apply(null, buffer);
	};
	BorshDeserializer$1.prototype.decode_boolean = function() {
		return this.buffer.consume_value("u8") > 0;
	};
	BorshDeserializer$1.prototype.decode_option = function(schema) {
		var option = this.buffer.consume_value("u8");
		if (option === 1) return this.decode_value(schema.option);
		if (option !== 0) throw new Error("Invalid option ".concat(option));
		return null;
	};
	BorshDeserializer$1.prototype.decode_enum = function(schema) {
		var _a;
		var valueIndex = this.buffer.consume_value("u8");
		if (valueIndex > schema["enum"].length) throw new Error("Enum option ".concat(valueIndex, " is not available"));
		var struct = schema["enum"][valueIndex].struct;
		var key = Object.keys(struct)[0];
		return _a = {}, _a[key] = this.decode_value(struct[key]), _a;
	};
	BorshDeserializer$1.prototype.decode_array = function(schema) {
		var result = [];
		var len = schema.array.len ? schema.array.len : this.decode_integer("u32");
		for (var i = 0; i < len; ++i) result.push(this.decode_value(schema.array.type));
		return result;
	};
	BorshDeserializer$1.prototype.decode_set = function(schema) {
		var len = this.decode_integer("u32");
		var result = new Set();
		for (var i = 0; i < len; ++i) result.add(this.decode_value(schema.set));
		return result;
	};
	BorshDeserializer$1.prototype.decode_map = function(schema) {
		var len = this.decode_integer("u32");
		var result = new Map();
		for (var i = 0; i < len; ++i) {
			var key = this.decode_value(schema.map.key);
			var value = this.decode_value(schema.map.value);
			result.set(key, value);
		}
		return result;
	};
	BorshDeserializer$1.prototype.decode_struct = function(schema) {
		var result = {};
		for (var key in schema.struct) result[key] = this.decode_value(schema.struct[key]);
		return result;
	};
	return BorshDeserializer$1;
}();

//#endregion
//#region ../../node_modules/.pnpm/borsh@1.0.0/node_modules/borsh/lib/esm/index.js
function serialize(schema, value, validate) {
	if (validate === void 0) validate = true;
	if (validate) validate_schema(schema);
	var serializer = new BorshSerializer(validate);
	return serializer.encode(value, schema);
}

//#endregion
//#region ../@core/src/codecs/index.ts
var import_hex = __toESM(require_hex(), 1);
var import_sha256 = __toESM(require_sha256(), 1);
var import_utf8 = __toESM(require_utf8(), 1);
var import_base64 = __toESM(require_base64(), 1);
var import_binary = __toESM(require_binary(), 1);
var import_bytes = __toESM(require_bytes(), 1);
var import_hex$1 = __toESM(require_hex(), 1);
var import_utf8$1 = __toESM(require_utf8(), 1);
function hexEncodeSha256Hash(data) {
	return (0, import_hex.encode)((0, import_sha256.hash)(data), true);
}
function bs58Decode(data) {
	return esm_default.decode(data);
}

//#endregion
//#region ../@core/src/kwil-actions/attributes.ts
/**
* Returns all the attributes for the given `signer`.
*/
async function getAttributes(kwilClient) {
	return kwilClient.call({
		name: "get_attributes",
		inputs: {}
	});
}
/**
* Creates a new attribute for the given `signer`.
*/
async function createAttribute(kwilClient, attribute) {
	await kwilClient.execute({
		name: "add_attribute",
		description: "Create a new attribute in your idOS profile",
		inputs: attribute
	});
	return attribute;
}

//#endregion
//#region ../@core/src/kwil-actions/credentials.ts
/**
* Returns the shared idOS Credential for the given `dataId`.
*/
async function getSharedCredential(kwilClient, id) {
	const [credential] = await kwilClient.call({
		name: "get_credential_shared",
		inputs: { id }
	});
	return credential;
}
/**
* Returns the owned idOS Credential for the given `id`.
*/
async function getCredentialOwned(kwilClient, id) {
	const [credential] = await kwilClient.call({
		name: "get_credential_owned",
		inputs: { id }
	});
	return credential;
}
/**
* Returns all idOSCredentials
*/
async function getAllCredentials(kwilClient) {
	return kwilClient.call({
		name: "get_credentials",
		inputs: {}
	});
}
/**
* Removes an idOSCredential by the given `id`.
*/
async function removeCredential(kwilClient, id) {
	await kwilClient.execute({
		name: "remove_credential",
		description: "Remove a credential from your idOS profile",
		inputs: { id }
	});
	return { id };
}
/**
* Returns an idOSCredential by the given `id`.
*/
async function getCredentialById(kwilClient, id) {
	const response = await kwilClient.call({
		name: "get_credential_owned",
		inputs: { id }
	});
	return response.find((r) => r.id === id);
}
/**
* Shares an idOSCredential to the given `userId`.
*/
async function shareCredential(kwilClient, credential) {
	await kwilClient.execute({
		name: "share_credential",
		description: "Share a credential with another user on idOS",
		inputs: credential
	});
	return credential;
}
/**
* Creates a new idOSCredential as a copy of the given `originalCredentialId` without creating an Access Grant
* Used only for passporting flows
*/
async function createCredentialCopy(kwilClient, params) {
	await kwilClient.execute({
		name: "create_credential_copy",
		description: "Share a credential with another user on idOS",
		inputs: params
	});
	return params;
}

//#endregion
//#region ../@core/src/kwil-actions/grants.ts
/**
* Returns the amount of Access Grants that have been granted for the given `signer`.
*/
async function getGrantsCount(kwilClient, params = { user_id: null }) {
	const [{ count }] = await kwilClient.call({
		name: "get_access_grants_granted_count",
		inputs: params
	});
	return count;
}
const GET_GRANTS_DEFAULT_RECORDS_PER_PAGE = 10;
async function getGrants(kwilClient, params = {
	page: 1,
	size: GET_GRANTS_DEFAULT_RECORDS_PER_PAGE,
	user_id: null
}) {
	return kwilClient.call({
		name: "get_access_grants_granted",
		inputs: {
			page: params.page ?? 1,
			size: params.size ?? 10,
			user_id: params.user_id ?? null
		}
	});
}
/**
* Revokes an Access Grant for the given `id`.
*/
async function revokeAccessGrant(kwilClient, id) {
	await kwilClient.execute({
		name: "revoke_access_grant",
		description: "Revoke an Access Grant from idOS",
		inputs: { id }
	});
	return { id };
}
/**
* Returns all the Access Grants that have been granted by the given `signer`.
*/
async function getAccessGrantsOwned(kwilClient) {
	return kwilClient.call({
		name: "get_access_grants_owned",
		inputs: {}
	});
}
/**
* Request a signature for a Delegated Access Grant
*/
async function requestDAGMessage(kwilClient, params) {
	const [{ message }] = await kwilClient.call({
		name: "dag_message",
		inputs: params
	});
	return message;
}
/**
* Request a signature for a delegated write grant.
*/
async function requestDWGMessage(kwilClient, params) {
	const [{ message }] = await kwilClient.call({
		name: "dwg_message",
		inputs: params
	});
	return message;
}

//#endregion
//#region ../@core/src/kwil-actions/user.ts
/**
* Checks if the user has a profile in the idOS associated with its wallet address.
*/
async function hasProfile(kwilClient, address) {
	const [{ has_profile }] = await kwilClient.call({
		name: "has_profile",
		inputs: { address }
	}, void 0);
	return has_profile;
}
/**
* Get the profile of the current user.
*/
async function getUserProfile(kwilClient) {
	const [user] = await kwilClient.call({
		name: "get_user",
		inputs: {}
	});
	return user;
}

//#endregion
//#region ../@core/src/kwil-actions/wallets.ts
async function addWallet(kwilClient, params) {
	await kwilClient.execute({
		name: "add_wallet",
		description: "Add a wallet to idOS",
		inputs: params
	});
	return params;
}
async function addWallets(kwilClient, params) {
	await Promise.all(params.map((param) => kwilClient.execute({
		name: "add_wallet",
		description: "Add a wallet to idOS",
		inputs: param
	})));
	return params;
}
async function getWallets(kwilClient) {
	return kwilClient.call({
		name: "get_wallets",
		inputs: {}
	});
}
async function removeWallet(kwilClient, id) {
	await kwilClient.execute({
		name: "remove_wallet",
		description: "Remove a wallet from idOS",
		inputs: { id }
	});
	return { id };
}
async function removeWallets(kwilClient, ids) {
	await Promise.all(ids.map((id) => kwilClient.execute({
		name: "remove_wallet",
		description: "Remove a wallet from idOS",
		inputs: { id }
	})));
	return ids;
}

//#endregion
//#region ../@core/src/kwil-actions/schema.ts
const DataType = Utils.DataType;
const actionSchema = {
	add_user_as_inserter: [{
		name: "id",
		type: DataType.Uuid
	}, {
		name: "recipient_encryption_public_key",
		type: DataType.Text
	}],
	update_user_pub_key_as_inserter: [{
		name: "id",
		type: DataType.Uuid
	}, {
		name: "recipient_encryption_public_key",
		type: DataType.Text
	}],
	get_user: [],
	get_user_as_inserter: [{
		name: "id",
		type: DataType.Uuid
	}],
	upsert_wallet_as_inserter: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "user_id",
			type: DataType.Uuid
		},
		{
			name: "address",
			type: DataType.Text
		},
		{
			name: "public_key",
			type: DataType.Text
		},
		{
			name: "wallet_type",
			type: DataType.Text
		},
		{
			name: "message",
			type: DataType.Text
		},
		{
			name: "signature",
			type: DataType.Text
		}
	],
	add_wallet: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "address",
			type: DataType.Text
		},
		{
			name: "public_key",
			type: DataType.Text
		},
		{
			name: "message",
			type: DataType.Text
		},
		{
			name: "signature",
			type: DataType.Text
		}
	],
	get_wallets: [],
	remove_wallet: [{
		name: "id",
		type: DataType.Uuid
	}],
	upsert_credential_as_inserter: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "user_id",
			type: DataType.Uuid
		},
		{
			name: "issuer_auth_public_key",
			type: DataType.Text
		},
		{
			name: "encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "content",
			type: DataType.Text
		},
		{
			name: "public_notes",
			type: DataType.Text
		},
		{
			name: "public_notes_signature",
			type: DataType.Text
		},
		{
			name: "broader_signature",
			type: DataType.Text
		}
	],
	add_credential: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "issuer_auth_public_key",
			type: DataType.Text
		},
		{
			name: "encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "content",
			type: DataType.Text
		},
		{
			name: "public_notes",
			type: DataType.Text
		},
		{
			name: "public_notes_signature",
			type: DataType.Text
		},
		{
			name: "broader_signature",
			type: DataType.Text
		}
	],
	get_credentials: [],
	get_credentials_shared_by_user: [{
		name: "user_id",
		type: DataType.Uuid
	}, {
		name: "issuer_auth_public_key",
		type: DataType.Text
	}],
	edit_public_notes_as_issuer: [{
		name: "public_notes_id",
		type: DataType.Text
	}, {
		name: "public_notes",
		type: DataType.Text
	}],
	remove_credential: [{
		name: "id",
		type: DataType.Uuid
	}],
	share_credential: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "original_credential_id",
			type: DataType.Uuid
		},
		{
			name: "public_notes",
			type: DataType.Text
		},
		{
			name: "public_notes_signature",
			type: DataType.Text
		},
		{
			name: "broader_signature",
			type: DataType.Text
		},
		{
			name: "content",
			type: DataType.Text
		},
		{
			name: "content_hash",
			type: DataType.Text
		},
		{
			name: "encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "issuer_auth_public_key",
			type: DataType.Text
		},
		{
			name: "grantee_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "locked_until",
			type: DataType.Int
		}
	],
	create_credential_copy: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "original_credential_id",
			type: DataType.Uuid
		},
		{
			name: "public_notes",
			type: DataType.Text
		},
		{
			name: "public_notes_signature",
			type: DataType.Text
		},
		{
			name: "broader_signature",
			type: DataType.Text
		},
		{
			name: "content",
			type: DataType.Text
		},
		{
			name: "encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "issuer_auth_public_key",
			type: DataType.Text
		}
	],
	share_credential_through_dag: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "user_id",
			type: DataType.Uuid
		},
		{
			name: "issuer_auth_public_key",
			type: DataType.Text
		},
		{
			name: "encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "content",
			type: DataType.Text
		},
		{
			name: "content_hash",
			type: DataType.Text
		},
		{
			name: "public_notes",
			type: DataType.Text
		},
		{
			name: "public_notes_signature",
			type: DataType.Text
		},
		{
			name: "broader_signature",
			type: DataType.Text
		},
		{
			name: "original_credential_id",
			type: DataType.Uuid
		},
		{
			name: "dag_owner_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "dag_grantee_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "dag_locked_until",
			type: DataType.Int
		},
		{
			name: "dag_signature",
			type: DataType.Text
		}
	],
	create_credentials_by_dwg: [
		{
			name: "issuer_auth_public_key",
			type: DataType.Text
		},
		{
			name: "original_encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "original_credential_id",
			type: DataType.Uuid
		},
		{
			name: "original_content",
			type: DataType.Text
		},
		{
			name: "original_public_notes",
			type: DataType.Text
		},
		{
			name: "original_public_notes_signature",
			type: DataType.Text
		},
		{
			name: "original_broader_signature",
			type: DataType.Text
		},
		{
			name: "copy_encryptor_public_key",
			type: DataType.Text
		},
		{
			name: "copy_credential_id",
			type: DataType.Uuid
		},
		{
			name: "copy_content",
			type: DataType.Text
		},
		{
			name: "copy_public_notes_signature",
			type: DataType.Text
		},
		{
			name: "copy_broader_signature",
			type: DataType.Text
		},
		{
			name: "content_hash",
			type: DataType.Text
		},
		{
			name: "dwg_owner",
			type: DataType.Text
		},
		{
			name: "dwg_grantee",
			type: DataType.Text
		},
		{
			name: "dwg_issuer_public_key",
			type: DataType.Text
		},
		{
			name: "dwg_id",
			type: DataType.Uuid
		},
		{
			name: "dwg_access_grant_timelock",
			type: DataType.Text
		},
		{
			name: "dwg_not_before",
			type: DataType.Text
		},
		{
			name: "dwg_not_after",
			type: DataType.Text
		},
		{
			name: "dwg_signature",
			type: DataType.Text
		}
	],
	get_credential_owned: [{
		name: "id",
		type: DataType.Uuid
	}],
	get_credential_shared: [{
		name: "id",
		type: DataType.Uuid
	}],
	get_sibling_credential_id: [{
		name: "content_hash",
		type: DataType.Text
	}],
	add_attribute: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "attribute_key",
			type: DataType.Text
		},
		{
			name: "value",
			type: DataType.Text
		}
	],
	get_attributes: [],
	edit_attribute: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "attribute_key",
			type: DataType.Text
		},
		{
			name: "value",
			type: DataType.Text
		}
	],
	remove_attribute: [{
		name: "id",
		type: DataType.Uuid
	}],
	share_attribute: [
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "original_attribute_id",
			type: DataType.Uuid
		},
		{
			name: "attribute_key",
			type: DataType.Text
		},
		{
			name: "value",
			type: DataType.Text
		}
	],
	dwg_message: [
		{
			name: "owner_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "grantee_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "issuer_public_key",
			type: DataType.Text
		},
		{
			name: "id",
			type: DataType.Uuid
		},
		{
			name: "access_grant_timelock",
			type: DataType.Text
		},
		{
			name: "not_usable_before",
			type: DataType.Text
		},
		{
			name: "not_usable_after",
			type: DataType.Text
		}
	],
	revoke_access_grant: [{
		name: "id",
		type: DataType.Uuid
	}],
	get_access_grants_owned: [],
	get_access_grants_granted: [
		{
			name: "user_id",
			type: DataType.Uuid
		},
		{
			name: "page",
			type: DataType.Int
		},
		{
			name: "size",
			type: DataType.Int
		}
	],
	get_access_grants_granted_count: [{
		name: "user_id",
		type: DataType.Uuid
	}],
	has_locked_access_grants: [{
		name: "id",
		type: DataType.Uuid
	}],
	dag_message: [
		{
			name: "dag_owner_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "dag_grantee_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "dag_data_id",
			type: DataType.Uuid
		},
		{
			name: "dag_locked_until",
			type: DataType.Int
		},
		{
			name: "dag_content_hash",
			type: DataType.Text
		}
	],
	create_ag_by_dag_for_copy: [
		{
			name: "dag_owner_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "dag_grantee_wallet_identifier",
			type: DataType.Text
		},
		{
			name: "dag_data_id",
			type: DataType.Uuid
		},
		{
			name: "dag_locked_until",
			type: DataType.Int
		},
		{
			name: "dag_content_hash",
			type: DataType.Text
		},
		{
			name: "dag_signature",
			type: DataType.Text
		}
	],
	get_access_grants_for_credential: [{
		name: "credential_id",
		type: DataType.Uuid
	}],
	has_profile: [{
		name: "address",
		type: DataType.Text
	}]
};

//#endregion
//#region ../@core/src/kwil-infra/create-kwil-client.ts
/**
* A client for interacting with kwil with type-safe abstractions for `call` and `execute`.
* Has utility methods for creating actions and setting a signer.
*/
var KwilActionClient = class {
	signer;
	client;
	constructor(client) {
		this.client = client;
	}
	#createActionInputs(actionName, params = {}) {
		if (!params || !Object.keys(params).length) return [];
		const args = actionSchema[actionName];
		return args.map(({ name }) => {
			const value = params[name];
			if (value === "" || value === 0) return value;
			return value ?? null;
		});
	}
	#actionTypes(actionName) {
		const args = actionSchema[actionName];
		return args.map((arg) => arg.type);
	}
	/**
	* Calls an action on the kwil nodes. This similar to `GET` like request.
	*/
	async call(params, signer = this.signer) {
		const action = {
			name: params.name,
			namespace: "main",
			inputs: this.#createActionInputs(params.name, params.inputs),
			types: this.#actionTypes(params.name)
		};
		const response = await this.client.call(action, signer);
		return response?.data?.result;
	}
	/**
	* Executes an action on the kwil nodes. This similar to `POST` like request.
	*/
	async execute(params, signer = this.signer, synchronous = true) {
		invariant(signer, "Signer is not set, you must set it before executing an action");
		const action = {
			name: params.name,
			namespace: "main",
			description: params.description,
			inputs: [this.#createActionInputs(params.name, params.inputs)],
			types: this.#actionTypes(params.name)
		};
		const response = await this.client.execute(action, signer, synchronous);
		return response.data?.tx_hash;
	}
	setSigner(signer) {
		this.signer = signer;
	}
};
const DEFAULT_TIMEOUT = 3e4;
const createKwilClient = (Cls) => async ({ nodeUrl: kwilProvider, chainId }) => {
	const _kwil = new Cls({
		kwilProvider,
		chainId: ""
	});
	chainId ||= (await _kwil.chainInfo({ disableWarning: true })).data?.chain_id;
	invariant(chainId, "Can't discover `chainId`. You must pass it explicitly.");
	return new KwilActionClient(new Cls({
		kwilProvider,
		chainId,
		timeout: DEFAULT_TIMEOUT
	}));
};
/**
* Create a kwil client for node.js environment
*/
const createNodeKwilClient = createKwilClient(NodeKwil);
/**
* Create a kwil client for browser environment
*/
const createWebKwilClient = createKwilClient(WebKwil);

//#endregion
//#region (ignored) ../../node_modules/.pnpm/tweetnacl@1.0.3/node_modules/tweetnacl
var require_tweetnacl = __commonJS({ "../../node_modules/.pnpm/tweetnacl@1.0.3/node_modules/tweetnacl"() {} });

//#endregion
//#region ../../node_modules/.pnpm/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({ "../../node_modules/.pnpm/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js"(exports, module) {
	(function(nacl$2) {
		"use strict";
		var gf = function(init) {
			var i, r = new Float64Array(16);
			if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
			return r;
		};
		var randombytes = function() {
			throw new Error("no PRNG");
		};
		var _0 = new Uint8Array(16);
		var _9 = new Uint8Array(32);
		_9[0] = 9;
		var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([
			30883,
			4953,
			19914,
			30187,
			55467,
			16705,
			2637,
			112,
			59544,
			30585,
			16505,
			36039,
			65139,
			11119,
			27886,
			20995
		]), D2 = gf([
			61785,
			9906,
			39828,
			60374,
			45398,
			33411,
			5274,
			224,
			53552,
			61171,
			33010,
			6542,
			64743,
			22239,
			55772,
			9222
		]), X = gf([
			54554,
			36645,
			11616,
			51542,
			42930,
			38181,
			51040,
			26924,
			56412,
			64982,
			57905,
			49316,
			21502,
			52590,
			14035,
			8553
		]), Y = gf([
			26200,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214
		]), I = gf([
			41136,
			18958,
			6951,
			50414,
			58488,
			44335,
			6150,
			12099,
			55207,
			15867,
			153,
			11085,
			57099,
			20417,
			9344,
			11139
		]);
		function ts64(x, i, h, l) {
			x[i] = h >> 24 & 255;
			x[i + 1] = h >> 16 & 255;
			x[i + 2] = h >> 8 & 255;
			x[i + 3] = h & 255;
			x[i + 4] = l >> 24 & 255;
			x[i + 5] = l >> 16 & 255;
			x[i + 6] = l >> 8 & 255;
			x[i + 7] = l & 255;
		}
		function vn(x, xi, y, yi, n) {
			var i, d = 0;
			for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
			return (1 & d - 1 >>> 8) - 1;
		}
		function crypto_verify_16(x, xi, y, yi) {
			return vn(x, xi, y, yi, 16);
		}
		function crypto_verify_32(x, xi, y, yi) {
			return vn(x, xi, y, yi, 32);
		}
		function core_salsa20(o, p, k, c) {
			var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
			var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
			for (var i = 0; i < 20; i += 2) {
				u = x0 + x12 | 0;
				x4 ^= u << 7 | u >>> 25;
				u = x4 + x0 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x4 | 0;
				x12 ^= u << 13 | u >>> 19;
				u = x12 + x8 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x1 | 0;
				x9 ^= u << 7 | u >>> 25;
				u = x9 + x5 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x9 | 0;
				x1 ^= u << 13 | u >>> 19;
				u = x1 + x13 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x6 | 0;
				x14 ^= u << 7 | u >>> 25;
				u = x14 + x10 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x14 | 0;
				x6 ^= u << 13 | u >>> 19;
				u = x6 + x2 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x11 | 0;
				x3 ^= u << 7 | u >>> 25;
				u = x3 + x15 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x3 | 0;
				x11 ^= u << 13 | u >>> 19;
				u = x11 + x7 | 0;
				x15 ^= u << 18 | u >>> 14;
				u = x0 + x3 | 0;
				x1 ^= u << 7 | u >>> 25;
				u = x1 + x0 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x1 | 0;
				x3 ^= u << 13 | u >>> 19;
				u = x3 + x2 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x4 | 0;
				x6 ^= u << 7 | u >>> 25;
				u = x6 + x5 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x6 | 0;
				x4 ^= u << 13 | u >>> 19;
				u = x4 + x7 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x9 | 0;
				x11 ^= u << 7 | u >>> 25;
				u = x11 + x10 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x11 | 0;
				x9 ^= u << 13 | u >>> 19;
				u = x9 + x8 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x14 | 0;
				x12 ^= u << 7 | u >>> 25;
				u = x12 + x15 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x12 | 0;
				x14 ^= u << 13 | u >>> 19;
				u = x14 + x13 | 0;
				x15 ^= u << 18 | u >>> 14;
			}
			x0 = x0 + j0 | 0;
			x1 = x1 + j1 | 0;
			x2 = x2 + j2 | 0;
			x3 = x3 + j3 | 0;
			x4 = x4 + j4 | 0;
			x5 = x5 + j5 | 0;
			x6 = x6 + j6 | 0;
			x7 = x7 + j7 | 0;
			x8 = x8 + j8 | 0;
			x9 = x9 + j9 | 0;
			x10 = x10 + j10 | 0;
			x11 = x11 + j11 | 0;
			x12 = x12 + j12 | 0;
			x13 = x13 + j13 | 0;
			x14 = x14 + j14 | 0;
			x15 = x15 + j15 | 0;
			o[0] = x0 >>> 0 & 255;
			o[1] = x0 >>> 8 & 255;
			o[2] = x0 >>> 16 & 255;
			o[3] = x0 >>> 24 & 255;
			o[4] = x1 >>> 0 & 255;
			o[5] = x1 >>> 8 & 255;
			o[6] = x1 >>> 16 & 255;
			o[7] = x1 >>> 24 & 255;
			o[8] = x2 >>> 0 & 255;
			o[9] = x2 >>> 8 & 255;
			o[10] = x2 >>> 16 & 255;
			o[11] = x2 >>> 24 & 255;
			o[12] = x3 >>> 0 & 255;
			o[13] = x3 >>> 8 & 255;
			o[14] = x3 >>> 16 & 255;
			o[15] = x3 >>> 24 & 255;
			o[16] = x4 >>> 0 & 255;
			o[17] = x4 >>> 8 & 255;
			o[18] = x4 >>> 16 & 255;
			o[19] = x4 >>> 24 & 255;
			o[20] = x5 >>> 0 & 255;
			o[21] = x5 >>> 8 & 255;
			o[22] = x5 >>> 16 & 255;
			o[23] = x5 >>> 24 & 255;
			o[24] = x6 >>> 0 & 255;
			o[25] = x6 >>> 8 & 255;
			o[26] = x6 >>> 16 & 255;
			o[27] = x6 >>> 24 & 255;
			o[28] = x7 >>> 0 & 255;
			o[29] = x7 >>> 8 & 255;
			o[30] = x7 >>> 16 & 255;
			o[31] = x7 >>> 24 & 255;
			o[32] = x8 >>> 0 & 255;
			o[33] = x8 >>> 8 & 255;
			o[34] = x8 >>> 16 & 255;
			o[35] = x8 >>> 24 & 255;
			o[36] = x9 >>> 0 & 255;
			o[37] = x9 >>> 8 & 255;
			o[38] = x9 >>> 16 & 255;
			o[39] = x9 >>> 24 & 255;
			o[40] = x10 >>> 0 & 255;
			o[41] = x10 >>> 8 & 255;
			o[42] = x10 >>> 16 & 255;
			o[43] = x10 >>> 24 & 255;
			o[44] = x11 >>> 0 & 255;
			o[45] = x11 >>> 8 & 255;
			o[46] = x11 >>> 16 & 255;
			o[47] = x11 >>> 24 & 255;
			o[48] = x12 >>> 0 & 255;
			o[49] = x12 >>> 8 & 255;
			o[50] = x12 >>> 16 & 255;
			o[51] = x12 >>> 24 & 255;
			o[52] = x13 >>> 0 & 255;
			o[53] = x13 >>> 8 & 255;
			o[54] = x13 >>> 16 & 255;
			o[55] = x13 >>> 24 & 255;
			o[56] = x14 >>> 0 & 255;
			o[57] = x14 >>> 8 & 255;
			o[58] = x14 >>> 16 & 255;
			o[59] = x14 >>> 24 & 255;
			o[60] = x15 >>> 0 & 255;
			o[61] = x15 >>> 8 & 255;
			o[62] = x15 >>> 16 & 255;
			o[63] = x15 >>> 24 & 255;
		}
		function core_hsalsa20(o, p, k, c) {
			var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
			var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
			for (var i = 0; i < 20; i += 2) {
				u = x0 + x12 | 0;
				x4 ^= u << 7 | u >>> 25;
				u = x4 + x0 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x4 | 0;
				x12 ^= u << 13 | u >>> 19;
				u = x12 + x8 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x1 | 0;
				x9 ^= u << 7 | u >>> 25;
				u = x9 + x5 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x9 | 0;
				x1 ^= u << 13 | u >>> 19;
				u = x1 + x13 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x6 | 0;
				x14 ^= u << 7 | u >>> 25;
				u = x14 + x10 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x14 | 0;
				x6 ^= u << 13 | u >>> 19;
				u = x6 + x2 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x11 | 0;
				x3 ^= u << 7 | u >>> 25;
				u = x3 + x15 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x3 | 0;
				x11 ^= u << 13 | u >>> 19;
				u = x11 + x7 | 0;
				x15 ^= u << 18 | u >>> 14;
				u = x0 + x3 | 0;
				x1 ^= u << 7 | u >>> 25;
				u = x1 + x0 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x1 | 0;
				x3 ^= u << 13 | u >>> 19;
				u = x3 + x2 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x4 | 0;
				x6 ^= u << 7 | u >>> 25;
				u = x6 + x5 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x6 | 0;
				x4 ^= u << 13 | u >>> 19;
				u = x4 + x7 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x9 | 0;
				x11 ^= u << 7 | u >>> 25;
				u = x11 + x10 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x11 | 0;
				x9 ^= u << 13 | u >>> 19;
				u = x9 + x8 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x14 | 0;
				x12 ^= u << 7 | u >>> 25;
				u = x12 + x15 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x12 | 0;
				x14 ^= u << 13 | u >>> 19;
				u = x14 + x13 | 0;
				x15 ^= u << 18 | u >>> 14;
			}
			o[0] = x0 >>> 0 & 255;
			o[1] = x0 >>> 8 & 255;
			o[2] = x0 >>> 16 & 255;
			o[3] = x0 >>> 24 & 255;
			o[4] = x5 >>> 0 & 255;
			o[5] = x5 >>> 8 & 255;
			o[6] = x5 >>> 16 & 255;
			o[7] = x5 >>> 24 & 255;
			o[8] = x10 >>> 0 & 255;
			o[9] = x10 >>> 8 & 255;
			o[10] = x10 >>> 16 & 255;
			o[11] = x10 >>> 24 & 255;
			o[12] = x15 >>> 0 & 255;
			o[13] = x15 >>> 8 & 255;
			o[14] = x15 >>> 16 & 255;
			o[15] = x15 >>> 24 & 255;
			o[16] = x6 >>> 0 & 255;
			o[17] = x6 >>> 8 & 255;
			o[18] = x6 >>> 16 & 255;
			o[19] = x6 >>> 24 & 255;
			o[20] = x7 >>> 0 & 255;
			o[21] = x7 >>> 8 & 255;
			o[22] = x7 >>> 16 & 255;
			o[23] = x7 >>> 24 & 255;
			o[24] = x8 >>> 0 & 255;
			o[25] = x8 >>> 8 & 255;
			o[26] = x8 >>> 16 & 255;
			o[27] = x8 >>> 24 & 255;
			o[28] = x9 >>> 0 & 255;
			o[29] = x9 >>> 8 & 255;
			o[30] = x9 >>> 16 & 255;
			o[31] = x9 >>> 24 & 255;
		}
		function crypto_core_salsa20(out, inp, k, c) {
			core_salsa20(out, inp, k, c);
		}
		function crypto_core_hsalsa20(out, inp, k, c) {
			core_hsalsa20(out, inp, k, c);
		}
		var sigma = new Uint8Array([
			101,
			120,
			112,
			97,
			110,
			100,
			32,
			51,
			50,
			45,
			98,
			121,
			116,
			101,
			32,
			107
		]);
		function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
			var z = new Uint8Array(16), x = new Uint8Array(64);
			var u, i;
			for (i = 0; i < 16; i++) z[i] = 0;
			for (i = 0; i < 8; i++) z[i] = n[i];
			while (b >= 64) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
				u = 1;
				for (i = 8; i < 16; i++) {
					u = u + (z[i] & 255) | 0;
					z[i] = u & 255;
					u >>>= 8;
				}
				b -= 64;
				cpos += 64;
				mpos += 64;
			}
			if (b > 0) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
			}
			return 0;
		}
		function crypto_stream_salsa20(c, cpos, b, n, k) {
			var z = new Uint8Array(16), x = new Uint8Array(64);
			var u, i;
			for (i = 0; i < 16; i++) z[i] = 0;
			for (i = 0; i < 8; i++) z[i] = n[i];
			while (b >= 64) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < 64; i++) c[cpos + i] = x[i];
				u = 1;
				for (i = 8; i < 16; i++) {
					u = u + (z[i] & 255) | 0;
					z[i] = u & 255;
					u >>>= 8;
				}
				b -= 64;
				cpos += 64;
			}
			if (b > 0) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < b; i++) c[cpos + i] = x[i];
			}
			return 0;
		}
		function crypto_stream(c, cpos, d, n, k) {
			var s = new Uint8Array(32);
			crypto_core_hsalsa20(s, n, k, sigma);
			var sn = new Uint8Array(8);
			for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
			return crypto_stream_salsa20(c, cpos, d, sn, s);
		}
		function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
			var s = new Uint8Array(32);
			crypto_core_hsalsa20(s, n, k, sigma);
			var sn = new Uint8Array(8);
			for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
			return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
		}
		var poly1305 = function(key) {
			this.buffer = new Uint8Array(16);
			this.r = new Uint16Array(10);
			this.h = new Uint16Array(10);
			this.pad = new Uint16Array(8);
			this.leftover = 0;
			this.fin = 0;
			var t0, t1, t2, t3, t4, t5, t6, t7;
			t0 = key[0] & 255 | (key[1] & 255) << 8;
			this.r[0] = t0 & 8191;
			t1 = key[2] & 255 | (key[3] & 255) << 8;
			this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
			t2 = key[4] & 255 | (key[5] & 255) << 8;
			this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
			t3 = key[6] & 255 | (key[7] & 255) << 8;
			this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
			t4 = key[8] & 255 | (key[9] & 255) << 8;
			this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
			this.r[5] = t4 >>> 1 & 8190;
			t5 = key[10] & 255 | (key[11] & 255) << 8;
			this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
			t6 = key[12] & 255 | (key[13] & 255) << 8;
			this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
			t7 = key[14] & 255 | (key[15] & 255) << 8;
			this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
			this.r[9] = t7 >>> 5 & 127;
			this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
			this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
			this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
			this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
			this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
			this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
			this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
			this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
		};
		poly1305.prototype.blocks = function(m, mpos, bytes) {
			var hibit = this.fin ? 0 : 2048;
			var t0, t1, t2, t3, t4, t5, t6, t7, c;
			var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
			var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
			var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
			while (bytes >= 16) {
				t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
				h0 += t0 & 8191;
				t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
				h1 += (t0 >>> 13 | t1 << 3) & 8191;
				t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
				h2 += (t1 >>> 10 | t2 << 6) & 8191;
				t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
				h3 += (t2 >>> 7 | t3 << 9) & 8191;
				t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
				h4 += (t3 >>> 4 | t4 << 12) & 8191;
				h5 += t4 >>> 1 & 8191;
				t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
				h6 += (t4 >>> 14 | t5 << 2) & 8191;
				t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
				h7 += (t5 >>> 11 | t6 << 5) & 8191;
				t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
				h8 += (t6 >>> 8 | t7 << 8) & 8191;
				h9 += t7 >>> 5 | hibit;
				c = 0;
				d0 = c;
				d0 += h0 * r0;
				d0 += h1 * (5 * r9);
				d0 += h2 * (5 * r8);
				d0 += h3 * (5 * r7);
				d0 += h4 * (5 * r6);
				c = d0 >>> 13;
				d0 &= 8191;
				d0 += h5 * (5 * r5);
				d0 += h6 * (5 * r4);
				d0 += h7 * (5 * r3);
				d0 += h8 * (5 * r2);
				d0 += h9 * (5 * r1);
				c += d0 >>> 13;
				d0 &= 8191;
				d1 = c;
				d1 += h0 * r1;
				d1 += h1 * r0;
				d1 += h2 * (5 * r9);
				d1 += h3 * (5 * r8);
				d1 += h4 * (5 * r7);
				c = d1 >>> 13;
				d1 &= 8191;
				d1 += h5 * (5 * r6);
				d1 += h6 * (5 * r5);
				d1 += h7 * (5 * r4);
				d1 += h8 * (5 * r3);
				d1 += h9 * (5 * r2);
				c += d1 >>> 13;
				d1 &= 8191;
				d2 = c;
				d2 += h0 * r2;
				d2 += h1 * r1;
				d2 += h2 * r0;
				d2 += h3 * (5 * r9);
				d2 += h4 * (5 * r8);
				c = d2 >>> 13;
				d2 &= 8191;
				d2 += h5 * (5 * r7);
				d2 += h6 * (5 * r6);
				d2 += h7 * (5 * r5);
				d2 += h8 * (5 * r4);
				d2 += h9 * (5 * r3);
				c += d2 >>> 13;
				d2 &= 8191;
				d3 = c;
				d3 += h0 * r3;
				d3 += h1 * r2;
				d3 += h2 * r1;
				d3 += h3 * r0;
				d3 += h4 * (5 * r9);
				c = d3 >>> 13;
				d3 &= 8191;
				d3 += h5 * (5 * r8);
				d3 += h6 * (5 * r7);
				d3 += h7 * (5 * r6);
				d3 += h8 * (5 * r5);
				d3 += h9 * (5 * r4);
				c += d3 >>> 13;
				d3 &= 8191;
				d4 = c;
				d4 += h0 * r4;
				d4 += h1 * r3;
				d4 += h2 * r2;
				d4 += h3 * r1;
				d4 += h4 * r0;
				c = d4 >>> 13;
				d4 &= 8191;
				d4 += h5 * (5 * r9);
				d4 += h6 * (5 * r8);
				d4 += h7 * (5 * r7);
				d4 += h8 * (5 * r6);
				d4 += h9 * (5 * r5);
				c += d4 >>> 13;
				d4 &= 8191;
				d5 = c;
				d5 += h0 * r5;
				d5 += h1 * r4;
				d5 += h2 * r3;
				d5 += h3 * r2;
				d5 += h4 * r1;
				c = d5 >>> 13;
				d5 &= 8191;
				d5 += h5 * r0;
				d5 += h6 * (5 * r9);
				d5 += h7 * (5 * r8);
				d5 += h8 * (5 * r7);
				d5 += h9 * (5 * r6);
				c += d5 >>> 13;
				d5 &= 8191;
				d6 = c;
				d6 += h0 * r6;
				d6 += h1 * r5;
				d6 += h2 * r4;
				d6 += h3 * r3;
				d6 += h4 * r2;
				c = d6 >>> 13;
				d6 &= 8191;
				d6 += h5 * r1;
				d6 += h6 * r0;
				d6 += h7 * (5 * r9);
				d6 += h8 * (5 * r8);
				d6 += h9 * (5 * r7);
				c += d6 >>> 13;
				d6 &= 8191;
				d7 = c;
				d7 += h0 * r7;
				d7 += h1 * r6;
				d7 += h2 * r5;
				d7 += h3 * r4;
				d7 += h4 * r3;
				c = d7 >>> 13;
				d7 &= 8191;
				d7 += h5 * r2;
				d7 += h6 * r1;
				d7 += h7 * r0;
				d7 += h8 * (5 * r9);
				d7 += h9 * (5 * r8);
				c += d7 >>> 13;
				d7 &= 8191;
				d8 = c;
				d8 += h0 * r8;
				d8 += h1 * r7;
				d8 += h2 * r6;
				d8 += h3 * r5;
				d8 += h4 * r4;
				c = d8 >>> 13;
				d8 &= 8191;
				d8 += h5 * r3;
				d8 += h6 * r2;
				d8 += h7 * r1;
				d8 += h8 * r0;
				d8 += h9 * (5 * r9);
				c += d8 >>> 13;
				d8 &= 8191;
				d9 = c;
				d9 += h0 * r9;
				d9 += h1 * r8;
				d9 += h2 * r7;
				d9 += h3 * r6;
				d9 += h4 * r5;
				c = d9 >>> 13;
				d9 &= 8191;
				d9 += h5 * r4;
				d9 += h6 * r3;
				d9 += h7 * r2;
				d9 += h8 * r1;
				d9 += h9 * r0;
				c += d9 >>> 13;
				d9 &= 8191;
				c = (c << 2) + c | 0;
				c = c + d0 | 0;
				d0 = c & 8191;
				c = c >>> 13;
				d1 += c;
				h0 = d0;
				h1 = d1;
				h2 = d2;
				h3 = d3;
				h4 = d4;
				h5 = d5;
				h6 = d6;
				h7 = d7;
				h8 = d8;
				h9 = d9;
				mpos += 16;
				bytes -= 16;
			}
			this.h[0] = h0;
			this.h[1] = h1;
			this.h[2] = h2;
			this.h[3] = h3;
			this.h[4] = h4;
			this.h[5] = h5;
			this.h[6] = h6;
			this.h[7] = h7;
			this.h[8] = h8;
			this.h[9] = h9;
		};
		poly1305.prototype.finish = function(mac, macpos) {
			var g = new Uint16Array(10);
			var c, mask, f, i;
			if (this.leftover) {
				i = this.leftover;
				this.buffer[i++] = 1;
				for (; i < 16; i++) this.buffer[i] = 0;
				this.fin = 1;
				this.blocks(this.buffer, 0, 16);
			}
			c = this.h[1] >>> 13;
			this.h[1] &= 8191;
			for (i = 2; i < 10; i++) {
				this.h[i] += c;
				c = this.h[i] >>> 13;
				this.h[i] &= 8191;
			}
			this.h[0] += c * 5;
			c = this.h[0] >>> 13;
			this.h[0] &= 8191;
			this.h[1] += c;
			c = this.h[1] >>> 13;
			this.h[1] &= 8191;
			this.h[2] += c;
			g[0] = this.h[0] + 5;
			c = g[0] >>> 13;
			g[0] &= 8191;
			for (i = 1; i < 10; i++) {
				g[i] = this.h[i] + c;
				c = g[i] >>> 13;
				g[i] &= 8191;
			}
			g[9] -= 8192;
			mask = (c ^ 1) - 1;
			for (i = 0; i < 10; i++) g[i] &= mask;
			mask = ~mask;
			for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
			this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
			this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
			this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
			this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
			this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
			this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
			this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
			this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
			f = this.h[0] + this.pad[0];
			this.h[0] = f & 65535;
			for (i = 1; i < 8; i++) {
				f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
				this.h[i] = f & 65535;
			}
			mac[macpos + 0] = this.h[0] >>> 0 & 255;
			mac[macpos + 1] = this.h[0] >>> 8 & 255;
			mac[macpos + 2] = this.h[1] >>> 0 & 255;
			mac[macpos + 3] = this.h[1] >>> 8 & 255;
			mac[macpos + 4] = this.h[2] >>> 0 & 255;
			mac[macpos + 5] = this.h[2] >>> 8 & 255;
			mac[macpos + 6] = this.h[3] >>> 0 & 255;
			mac[macpos + 7] = this.h[3] >>> 8 & 255;
			mac[macpos + 8] = this.h[4] >>> 0 & 255;
			mac[macpos + 9] = this.h[4] >>> 8 & 255;
			mac[macpos + 10] = this.h[5] >>> 0 & 255;
			mac[macpos + 11] = this.h[5] >>> 8 & 255;
			mac[macpos + 12] = this.h[6] >>> 0 & 255;
			mac[macpos + 13] = this.h[6] >>> 8 & 255;
			mac[macpos + 14] = this.h[7] >>> 0 & 255;
			mac[macpos + 15] = this.h[7] >>> 8 & 255;
		};
		poly1305.prototype.update = function(m, mpos, bytes) {
			var i, want;
			if (this.leftover) {
				want = 16 - this.leftover;
				if (want > bytes) want = bytes;
				for (i = 0; i < want; i++) this.buffer[this.leftover + i] = m[mpos + i];
				bytes -= want;
				mpos += want;
				this.leftover += want;
				if (this.leftover < 16) return;
				this.blocks(this.buffer, 0, 16);
				this.leftover = 0;
			}
			if (bytes >= 16) {
				want = bytes - bytes % 16;
				this.blocks(m, mpos, want);
				mpos += want;
				bytes -= want;
			}
			if (bytes) {
				for (i = 0; i < bytes; i++) this.buffer[this.leftover + i] = m[mpos + i];
				this.leftover += bytes;
			}
		};
		function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
			var s = new poly1305(k);
			s.update(m, mpos, n);
			s.finish(out, outpos);
			return 0;
		}
		function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
			var x = new Uint8Array(16);
			crypto_onetimeauth(x, 0, m, mpos, n, k);
			return crypto_verify_16(h, hpos, x, 0);
		}
		function crypto_secretbox(c, m, d, n, k) {
			var i;
			if (d < 32) return -1;
			crypto_stream_xor(c, 0, m, 0, d, n, k);
			crypto_onetimeauth(c, 16, c, 32, d - 32, c);
			for (i = 0; i < 16; i++) c[i] = 0;
			return 0;
		}
		function crypto_secretbox_open(m, c, d, n, k) {
			var i;
			var x = new Uint8Array(32);
			if (d < 32) return -1;
			crypto_stream(x, 0, 32, n, k);
			if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
			crypto_stream_xor(m, 0, c, 0, d, n, k);
			for (i = 0; i < 32; i++) m[i] = 0;
			return 0;
		}
		function set25519(r, a) {
			var i;
			for (i = 0; i < 16; i++) r[i] = a[i] | 0;
		}
		function car25519(o) {
			var i, v, c = 1;
			for (i = 0; i < 16; i++) {
				v = o[i] + c + 65535;
				c = Math.floor(v / 65536);
				o[i] = v - c * 65536;
			}
			o[0] += c - 1 + 37 * (c - 1);
		}
		function sel25519(p, q, b) {
			var t, c = ~(b - 1);
			for (var i = 0; i < 16; i++) {
				t = c & (p[i] ^ q[i]);
				p[i] ^= t;
				q[i] ^= t;
			}
		}
		function pack25519(o, n) {
			var i, j, b;
			var m = gf(), t = gf();
			for (i = 0; i < 16; i++) t[i] = n[i];
			car25519(t);
			car25519(t);
			car25519(t);
			for (j = 0; j < 2; j++) {
				m[0] = t[0] - 65517;
				for (i = 1; i < 15; i++) {
					m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
					m[i - 1] &= 65535;
				}
				m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
				b = m[15] >> 16 & 1;
				m[14] &= 65535;
				sel25519(t, m, 1 - b);
			}
			for (i = 0; i < 16; i++) {
				o[2 * i] = t[i] & 255;
				o[2 * i + 1] = t[i] >> 8;
			}
		}
		function neq25519(a, b) {
			var c = new Uint8Array(32), d = new Uint8Array(32);
			pack25519(c, a);
			pack25519(d, b);
			return crypto_verify_32(c, 0, d, 0);
		}
		function par25519(a) {
			var d = new Uint8Array(32);
			pack25519(d, a);
			return d[0] & 1;
		}
		function unpack25519(o, n) {
			var i;
			for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
			o[15] &= 32767;
		}
		function A(o, a, b) {
			for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
		}
		function Z(o, a, b) {
			for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
		}
		function M(o, a, b) {
			var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
			v = a[0];
			t0 += v * b0;
			t1 += v * b1;
			t2 += v * b2;
			t3 += v * b3;
			t4 += v * b4;
			t5 += v * b5;
			t6 += v * b6;
			t7 += v * b7;
			t8 += v * b8;
			t9 += v * b9;
			t10 += v * b10;
			t11 += v * b11;
			t12 += v * b12;
			t13 += v * b13;
			t14 += v * b14;
			t15 += v * b15;
			v = a[1];
			t1 += v * b0;
			t2 += v * b1;
			t3 += v * b2;
			t4 += v * b3;
			t5 += v * b4;
			t6 += v * b5;
			t7 += v * b6;
			t8 += v * b7;
			t9 += v * b8;
			t10 += v * b9;
			t11 += v * b10;
			t12 += v * b11;
			t13 += v * b12;
			t14 += v * b13;
			t15 += v * b14;
			t16 += v * b15;
			v = a[2];
			t2 += v * b0;
			t3 += v * b1;
			t4 += v * b2;
			t5 += v * b3;
			t6 += v * b4;
			t7 += v * b5;
			t8 += v * b6;
			t9 += v * b7;
			t10 += v * b8;
			t11 += v * b9;
			t12 += v * b10;
			t13 += v * b11;
			t14 += v * b12;
			t15 += v * b13;
			t16 += v * b14;
			t17 += v * b15;
			v = a[3];
			t3 += v * b0;
			t4 += v * b1;
			t5 += v * b2;
			t6 += v * b3;
			t7 += v * b4;
			t8 += v * b5;
			t9 += v * b6;
			t10 += v * b7;
			t11 += v * b8;
			t12 += v * b9;
			t13 += v * b10;
			t14 += v * b11;
			t15 += v * b12;
			t16 += v * b13;
			t17 += v * b14;
			t18 += v * b15;
			v = a[4];
			t4 += v * b0;
			t5 += v * b1;
			t6 += v * b2;
			t7 += v * b3;
			t8 += v * b4;
			t9 += v * b5;
			t10 += v * b6;
			t11 += v * b7;
			t12 += v * b8;
			t13 += v * b9;
			t14 += v * b10;
			t15 += v * b11;
			t16 += v * b12;
			t17 += v * b13;
			t18 += v * b14;
			t19 += v * b15;
			v = a[5];
			t5 += v * b0;
			t6 += v * b1;
			t7 += v * b2;
			t8 += v * b3;
			t9 += v * b4;
			t10 += v * b5;
			t11 += v * b6;
			t12 += v * b7;
			t13 += v * b8;
			t14 += v * b9;
			t15 += v * b10;
			t16 += v * b11;
			t17 += v * b12;
			t18 += v * b13;
			t19 += v * b14;
			t20 += v * b15;
			v = a[6];
			t6 += v * b0;
			t7 += v * b1;
			t8 += v * b2;
			t9 += v * b3;
			t10 += v * b4;
			t11 += v * b5;
			t12 += v * b6;
			t13 += v * b7;
			t14 += v * b8;
			t15 += v * b9;
			t16 += v * b10;
			t17 += v * b11;
			t18 += v * b12;
			t19 += v * b13;
			t20 += v * b14;
			t21 += v * b15;
			v = a[7];
			t7 += v * b0;
			t8 += v * b1;
			t9 += v * b2;
			t10 += v * b3;
			t11 += v * b4;
			t12 += v * b5;
			t13 += v * b6;
			t14 += v * b7;
			t15 += v * b8;
			t16 += v * b9;
			t17 += v * b10;
			t18 += v * b11;
			t19 += v * b12;
			t20 += v * b13;
			t21 += v * b14;
			t22 += v * b15;
			v = a[8];
			t8 += v * b0;
			t9 += v * b1;
			t10 += v * b2;
			t11 += v * b3;
			t12 += v * b4;
			t13 += v * b5;
			t14 += v * b6;
			t15 += v * b7;
			t16 += v * b8;
			t17 += v * b9;
			t18 += v * b10;
			t19 += v * b11;
			t20 += v * b12;
			t21 += v * b13;
			t22 += v * b14;
			t23 += v * b15;
			v = a[9];
			t9 += v * b0;
			t10 += v * b1;
			t11 += v * b2;
			t12 += v * b3;
			t13 += v * b4;
			t14 += v * b5;
			t15 += v * b6;
			t16 += v * b7;
			t17 += v * b8;
			t18 += v * b9;
			t19 += v * b10;
			t20 += v * b11;
			t21 += v * b12;
			t22 += v * b13;
			t23 += v * b14;
			t24 += v * b15;
			v = a[10];
			t10 += v * b0;
			t11 += v * b1;
			t12 += v * b2;
			t13 += v * b3;
			t14 += v * b4;
			t15 += v * b5;
			t16 += v * b6;
			t17 += v * b7;
			t18 += v * b8;
			t19 += v * b9;
			t20 += v * b10;
			t21 += v * b11;
			t22 += v * b12;
			t23 += v * b13;
			t24 += v * b14;
			t25 += v * b15;
			v = a[11];
			t11 += v * b0;
			t12 += v * b1;
			t13 += v * b2;
			t14 += v * b3;
			t15 += v * b4;
			t16 += v * b5;
			t17 += v * b6;
			t18 += v * b7;
			t19 += v * b8;
			t20 += v * b9;
			t21 += v * b10;
			t22 += v * b11;
			t23 += v * b12;
			t24 += v * b13;
			t25 += v * b14;
			t26 += v * b15;
			v = a[12];
			t12 += v * b0;
			t13 += v * b1;
			t14 += v * b2;
			t15 += v * b3;
			t16 += v * b4;
			t17 += v * b5;
			t18 += v * b6;
			t19 += v * b7;
			t20 += v * b8;
			t21 += v * b9;
			t22 += v * b10;
			t23 += v * b11;
			t24 += v * b12;
			t25 += v * b13;
			t26 += v * b14;
			t27 += v * b15;
			v = a[13];
			t13 += v * b0;
			t14 += v * b1;
			t15 += v * b2;
			t16 += v * b3;
			t17 += v * b4;
			t18 += v * b5;
			t19 += v * b6;
			t20 += v * b7;
			t21 += v * b8;
			t22 += v * b9;
			t23 += v * b10;
			t24 += v * b11;
			t25 += v * b12;
			t26 += v * b13;
			t27 += v * b14;
			t28 += v * b15;
			v = a[14];
			t14 += v * b0;
			t15 += v * b1;
			t16 += v * b2;
			t17 += v * b3;
			t18 += v * b4;
			t19 += v * b5;
			t20 += v * b6;
			t21 += v * b7;
			t22 += v * b8;
			t23 += v * b9;
			t24 += v * b10;
			t25 += v * b11;
			t26 += v * b12;
			t27 += v * b13;
			t28 += v * b14;
			t29 += v * b15;
			v = a[15];
			t15 += v * b0;
			t16 += v * b1;
			t17 += v * b2;
			t18 += v * b3;
			t19 += v * b4;
			t20 += v * b5;
			t21 += v * b6;
			t22 += v * b7;
			t23 += v * b8;
			t24 += v * b9;
			t25 += v * b10;
			t26 += v * b11;
			t27 += v * b12;
			t28 += v * b13;
			t29 += v * b14;
			t30 += v * b15;
			t0 += 38 * t16;
			t1 += 38 * t17;
			t2 += 38 * t18;
			t3 += 38 * t19;
			t4 += 38 * t20;
			t5 += 38 * t21;
			t6 += 38 * t22;
			t7 += 38 * t23;
			t8 += 38 * t24;
			t9 += 38 * t25;
			t10 += 38 * t26;
			t11 += 38 * t27;
			t12 += 38 * t28;
			t13 += 38 * t29;
			t14 += 38 * t30;
			c = 1;
			v = t0 + c + 65535;
			c = Math.floor(v / 65536);
			t0 = v - c * 65536;
			v = t1 + c + 65535;
			c = Math.floor(v / 65536);
			t1 = v - c * 65536;
			v = t2 + c + 65535;
			c = Math.floor(v / 65536);
			t2 = v - c * 65536;
			v = t3 + c + 65535;
			c = Math.floor(v / 65536);
			t3 = v - c * 65536;
			v = t4 + c + 65535;
			c = Math.floor(v / 65536);
			t4 = v - c * 65536;
			v = t5 + c + 65535;
			c = Math.floor(v / 65536);
			t5 = v - c * 65536;
			v = t6 + c + 65535;
			c = Math.floor(v / 65536);
			t6 = v - c * 65536;
			v = t7 + c + 65535;
			c = Math.floor(v / 65536);
			t7 = v - c * 65536;
			v = t8 + c + 65535;
			c = Math.floor(v / 65536);
			t8 = v - c * 65536;
			v = t9 + c + 65535;
			c = Math.floor(v / 65536);
			t9 = v - c * 65536;
			v = t10 + c + 65535;
			c = Math.floor(v / 65536);
			t10 = v - c * 65536;
			v = t11 + c + 65535;
			c = Math.floor(v / 65536);
			t11 = v - c * 65536;
			v = t12 + c + 65535;
			c = Math.floor(v / 65536);
			t12 = v - c * 65536;
			v = t13 + c + 65535;
			c = Math.floor(v / 65536);
			t13 = v - c * 65536;
			v = t14 + c + 65535;
			c = Math.floor(v / 65536);
			t14 = v - c * 65536;
			v = t15 + c + 65535;
			c = Math.floor(v / 65536);
			t15 = v - c * 65536;
			t0 += c - 1 + 37 * (c - 1);
			c = 1;
			v = t0 + c + 65535;
			c = Math.floor(v / 65536);
			t0 = v - c * 65536;
			v = t1 + c + 65535;
			c = Math.floor(v / 65536);
			t1 = v - c * 65536;
			v = t2 + c + 65535;
			c = Math.floor(v / 65536);
			t2 = v - c * 65536;
			v = t3 + c + 65535;
			c = Math.floor(v / 65536);
			t3 = v - c * 65536;
			v = t4 + c + 65535;
			c = Math.floor(v / 65536);
			t4 = v - c * 65536;
			v = t5 + c + 65535;
			c = Math.floor(v / 65536);
			t5 = v - c * 65536;
			v = t6 + c + 65535;
			c = Math.floor(v / 65536);
			t6 = v - c * 65536;
			v = t7 + c + 65535;
			c = Math.floor(v / 65536);
			t7 = v - c * 65536;
			v = t8 + c + 65535;
			c = Math.floor(v / 65536);
			t8 = v - c * 65536;
			v = t9 + c + 65535;
			c = Math.floor(v / 65536);
			t9 = v - c * 65536;
			v = t10 + c + 65535;
			c = Math.floor(v / 65536);
			t10 = v - c * 65536;
			v = t11 + c + 65535;
			c = Math.floor(v / 65536);
			t11 = v - c * 65536;
			v = t12 + c + 65535;
			c = Math.floor(v / 65536);
			t12 = v - c * 65536;
			v = t13 + c + 65535;
			c = Math.floor(v / 65536);
			t13 = v - c * 65536;
			v = t14 + c + 65535;
			c = Math.floor(v / 65536);
			t14 = v - c * 65536;
			v = t15 + c + 65535;
			c = Math.floor(v / 65536);
			t15 = v - c * 65536;
			t0 += c - 1 + 37 * (c - 1);
			o[0] = t0;
			o[1] = t1;
			o[2] = t2;
			o[3] = t3;
			o[4] = t4;
			o[5] = t5;
			o[6] = t6;
			o[7] = t7;
			o[8] = t8;
			o[9] = t9;
			o[10] = t10;
			o[11] = t11;
			o[12] = t12;
			o[13] = t13;
			o[14] = t14;
			o[15] = t15;
		}
		function S(o, a) {
			M(o, a, a);
		}
		function inv25519(o, i) {
			var c = gf();
			var a;
			for (a = 0; a < 16; a++) c[a] = i[a];
			for (a = 253; a >= 0; a--) {
				S(c, c);
				if (a !== 2 && a !== 4) M(c, c, i);
			}
			for (a = 0; a < 16; a++) o[a] = c[a];
		}
		function pow2523(o, i) {
			var c = gf();
			var a;
			for (a = 0; a < 16; a++) c[a] = i[a];
			for (a = 250; a >= 0; a--) {
				S(c, c);
				if (a !== 1) M(c, c, i);
			}
			for (a = 0; a < 16; a++) o[a] = c[a];
		}
		function crypto_scalarmult(q, n, p) {
			var z = new Uint8Array(32);
			var x = new Float64Array(80), r, i;
			var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
			for (i = 0; i < 31; i++) z[i] = n[i];
			z[31] = n[31] & 127 | 64;
			z[0] &= 248;
			unpack25519(x, p);
			for (i = 0; i < 16; i++) {
				b[i] = x[i];
				d[i] = a[i] = c[i] = 0;
			}
			a[0] = d[0] = 1;
			for (i = 254; i >= 0; --i) {
				r = z[i >>> 3] >>> (i & 7) & 1;
				sel25519(a, b, r);
				sel25519(c, d, r);
				A(e, a, c);
				Z(a, a, c);
				A(c, b, d);
				Z(b, b, d);
				S(d, e);
				S(f, a);
				M(a, c, a);
				M(c, b, e);
				A(e, a, c);
				Z(a, a, c);
				S(b, a);
				Z(c, d, f);
				M(a, c, _121665);
				A(a, a, d);
				M(c, c, a);
				M(a, d, f);
				M(d, b, x);
				S(b, e);
				sel25519(a, b, r);
				sel25519(c, d, r);
			}
			for (i = 0; i < 16; i++) {
				x[i + 16] = a[i];
				x[i + 32] = c[i];
				x[i + 48] = b[i];
				x[i + 64] = d[i];
			}
			var x32 = x.subarray(32);
			var x16 = x.subarray(16);
			inv25519(x32, x32);
			M(x16, x16, x32);
			pack25519(q, x16);
			return 0;
		}
		function crypto_scalarmult_base(q, n) {
			return crypto_scalarmult(q, n, _9);
		}
		function crypto_box_keypair(y, x) {
			randombytes(x, 32);
			return crypto_scalarmult_base(y, x);
		}
		function crypto_box_beforenm(k, y, x) {
			var s = new Uint8Array(32);
			crypto_scalarmult(s, x, y);
			return crypto_core_hsalsa20(k, _0, s, sigma);
		}
		var crypto_box_afternm = crypto_secretbox;
		var crypto_box_open_afternm = crypto_secretbox_open;
		function crypto_box(c, m, d, n, y, x) {
			var k = new Uint8Array(32);
			crypto_box_beforenm(k, y, x);
			return crypto_box_afternm(c, m, d, n, k);
		}
		function crypto_box_open(m, c, d, n, y, x) {
			var k = new Uint8Array(32);
			crypto_box_beforenm(k, y, x);
			return crypto_box_open_afternm(m, c, d, n, k);
		}
		var K$1 = [
			1116352408,
			3609767458,
			1899447441,
			602891725,
			3049323471,
			3964484399,
			3921009573,
			2173295548,
			961987163,
			4081628472,
			1508970993,
			3053834265,
			2453635748,
			2937671579,
			2870763221,
			3664609560,
			3624381080,
			2734883394,
			310598401,
			1164996542,
			607225278,
			1323610764,
			1426881987,
			3590304994,
			1925078388,
			4068182383,
			2162078206,
			991336113,
			2614888103,
			633803317,
			3248222580,
			3479774868,
			3835390401,
			2666613458,
			4022224774,
			944711139,
			264347078,
			2341262773,
			604807628,
			2007800933,
			770255983,
			1495990901,
			1249150122,
			1856431235,
			1555081692,
			3175218132,
			1996064986,
			2198950837,
			2554220882,
			3999719339,
			2821834349,
			766784016,
			2952996808,
			2566594879,
			3210313671,
			3203337956,
			3336571891,
			1034457026,
			3584528711,
			2466948901,
			113926993,
			3758326383,
			338241895,
			168717936,
			666307205,
			1188179964,
			773529912,
			1546045734,
			1294757372,
			1522805485,
			1396182291,
			2643833823,
			1695183700,
			2343527390,
			1986661051,
			1014477480,
			2177026350,
			1206759142,
			2456956037,
			344077627,
			2730485921,
			1290863460,
			2820302411,
			3158454273,
			3259730800,
			3505952657,
			3345764771,
			106217008,
			3516065817,
			3606008344,
			3600352804,
			1432725776,
			4094571909,
			1467031594,
			275423344,
			851169720,
			430227734,
			3100823752,
			506948616,
			1363258195,
			659060556,
			3750685593,
			883997877,
			3785050280,
			958139571,
			3318307427,
			1322822218,
			3812723403,
			1537002063,
			2003034995,
			1747873779,
			3602036899,
			1955562222,
			1575990012,
			2024104815,
			1125592928,
			2227730452,
			2716904306,
			2361852424,
			442776044,
			2428436474,
			593698344,
			2756734187,
			3733110249,
			3204031479,
			2999351573,
			3329325298,
			3815920427,
			3391569614,
			3928383900,
			3515267271,
			566280711,
			3940187606,
			3454069534,
			4118630271,
			4000239992,
			116418474,
			1914138554,
			174292421,
			2731055270,
			289380356,
			3203993006,
			460393269,
			320620315,
			685471733,
			587496836,
			852142971,
			1086792851,
			1017036298,
			365543100,
			1126000580,
			2618297676,
			1288033470,
			3409855158,
			1501505948,
			4234509866,
			1607167915,
			987167468,
			1816402316,
			1246189591
		];
		function crypto_hashblocks_hl(hh, hl, m, n) {
			var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
			var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
			var pos = 0;
			while (n >= 128) {
				for (i = 0; i < 16; i++) {
					j = 8 * i + pos;
					wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
					wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
				}
				for (i = 0; i < 80; i++) {
					bh0 = ah0;
					bh1 = ah1;
					bh2 = ah2;
					bh3 = ah3;
					bh4 = ah4;
					bh5 = ah5;
					bh6 = ah6;
					bh7 = ah7;
					bl0 = al0;
					bl1 = al1;
					bl2 = al2;
					bl3 = al3;
					bl4 = al4;
					bl5 = al5;
					bl6 = al6;
					bl7 = al7;
					h = ah7;
					l = al7;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = (ah4 >>> 14 | al4 << 18) ^ (ah4 >>> 18 | al4 << 14) ^ (al4 >>> 9 | ah4 << 23);
					l = (al4 >>> 14 | ah4 << 18) ^ (al4 >>> 18 | ah4 << 14) ^ (ah4 >>> 9 | al4 << 23);
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = ah4 & ah5 ^ ~ah4 & ah6;
					l = al4 & al5 ^ ~al4 & al6;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = K$1[i * 2];
					l = K$1[i * 2 + 1];
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = wh[i % 16];
					l = wl[i % 16];
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					th = c & 65535 | d << 16;
					tl = a & 65535 | b << 16;
					h = th;
					l = tl;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = (ah0 >>> 28 | al0 << 4) ^ (al0 >>> 2 | ah0 << 30) ^ (al0 >>> 7 | ah0 << 25);
					l = (al0 >>> 28 | ah0 << 4) ^ (ah0 >>> 2 | al0 << 30) ^ (ah0 >>> 7 | al0 << 25);
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
					l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					bh7 = c & 65535 | d << 16;
					bl7 = a & 65535 | b << 16;
					h = bh3;
					l = bl3;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = th;
					l = tl;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					bh3 = c & 65535 | d << 16;
					bl3 = a & 65535 | b << 16;
					ah1 = bh0;
					ah2 = bh1;
					ah3 = bh2;
					ah4 = bh3;
					ah5 = bh4;
					ah6 = bh5;
					ah7 = bh6;
					ah0 = bh7;
					al1 = bl0;
					al2 = bl1;
					al3 = bl2;
					al4 = bl3;
					al5 = bl4;
					al6 = bl5;
					al7 = bl6;
					al0 = bl7;
					if (i % 16 === 15) for (j = 0; j < 16; j++) {
						h = wh[j];
						l = wl[j];
						a = l & 65535;
						b = l >>> 16;
						c = h & 65535;
						d = h >>> 16;
						h = wh[(j + 9) % 16];
						l = wl[(j + 9) % 16];
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						th = wh[(j + 1) % 16];
						tl = wl[(j + 1) % 16];
						h = (th >>> 1 | tl << 31) ^ (th >>> 8 | tl << 24) ^ th >>> 7;
						l = (tl >>> 1 | th << 31) ^ (tl >>> 8 | th << 24) ^ (tl >>> 7 | th << 25);
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						th = wh[(j + 14) % 16];
						tl = wl[(j + 14) % 16];
						h = (th >>> 19 | tl << 13) ^ (tl >>> 29 | th << 3) ^ th >>> 6;
						l = (tl >>> 19 | th << 13) ^ (th >>> 29 | tl << 3) ^ (tl >>> 6 | th << 26);
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						b += a >>> 16;
						c += b >>> 16;
						d += c >>> 16;
						wh[j] = c & 65535 | d << 16;
						wl[j] = a & 65535 | b << 16;
					}
				}
				h = ah0;
				l = al0;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[0];
				l = hl[0];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[0] = ah0 = c & 65535 | d << 16;
				hl[0] = al0 = a & 65535 | b << 16;
				h = ah1;
				l = al1;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[1];
				l = hl[1];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[1] = ah1 = c & 65535 | d << 16;
				hl[1] = al1 = a & 65535 | b << 16;
				h = ah2;
				l = al2;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[2];
				l = hl[2];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[2] = ah2 = c & 65535 | d << 16;
				hl[2] = al2 = a & 65535 | b << 16;
				h = ah3;
				l = al3;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[3];
				l = hl[3];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[3] = ah3 = c & 65535 | d << 16;
				hl[3] = al3 = a & 65535 | b << 16;
				h = ah4;
				l = al4;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[4];
				l = hl[4];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[4] = ah4 = c & 65535 | d << 16;
				hl[4] = al4 = a & 65535 | b << 16;
				h = ah5;
				l = al5;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[5];
				l = hl[5];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[5] = ah5 = c & 65535 | d << 16;
				hl[5] = al5 = a & 65535 | b << 16;
				h = ah6;
				l = al6;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[6];
				l = hl[6];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[6] = ah6 = c & 65535 | d << 16;
				hl[6] = al6 = a & 65535 | b << 16;
				h = ah7;
				l = al7;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[7];
				l = hl[7];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[7] = ah7 = c & 65535 | d << 16;
				hl[7] = al7 = a & 65535 | b << 16;
				pos += 128;
				n -= 128;
			}
			return n;
		}
		function crypto_hash(out, m, n) {
			var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
			hh[0] = 1779033703;
			hh[1] = 3144134277;
			hh[2] = 1013904242;
			hh[3] = 2773480762;
			hh[4] = 1359893119;
			hh[5] = 2600822924;
			hh[6] = 528734635;
			hh[7] = 1541459225;
			hl[0] = 4089235720;
			hl[1] = 2227873595;
			hl[2] = 4271175723;
			hl[3] = 1595750129;
			hl[4] = 2917565137;
			hl[5] = 725511199;
			hl[6] = 4215389547;
			hl[7] = 327033209;
			crypto_hashblocks_hl(hh, hl, m, n);
			n %= 128;
			for (i = 0; i < n; i++) x[i] = m[b - n + i];
			x[n] = 128;
			n = 256 - 128 * (n < 112 ? 1 : 0);
			x[n - 9] = 0;
			ts64(x, n - 8, b / 536870912 | 0, b << 3);
			crypto_hashblocks_hl(hh, hl, x, n);
			for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
			return 0;
		}
		function add$1(p, q) {
			var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
			Z(a, p[1], p[0]);
			Z(t, q[1], q[0]);
			M(a, a, t);
			A(b, p[0], p[1]);
			A(t, q[0], q[1]);
			M(b, b, t);
			M(c, p[3], q[3]);
			M(c, c, D2);
			M(d, p[2], q[2]);
			A(d, d, d);
			Z(e, b, a);
			Z(f, d, c);
			A(g, d, c);
			A(h, b, a);
			M(p[0], e, f);
			M(p[1], h, g);
			M(p[2], g, f);
			M(p[3], e, h);
		}
		function cswap(p, q, b) {
			var i;
			for (i = 0; i < 4; i++) sel25519(p[i], q[i], b);
		}
		function pack(r, p) {
			var tx = gf(), ty = gf(), zi = gf();
			inv25519(zi, p[2]);
			M(tx, p[0], zi);
			M(ty, p[1], zi);
			pack25519(r, ty);
			r[31] ^= par25519(tx) << 7;
		}
		function scalarmult(p, q, s) {
			var b, i;
			set25519(p[0], gf0);
			set25519(p[1], gf1);
			set25519(p[2], gf1);
			set25519(p[3], gf0);
			for (i = 255; i >= 0; --i) {
				b = s[i / 8 | 0] >> (i & 7) & 1;
				cswap(p, q, b);
				add$1(q, p);
				add$1(p, p);
				cswap(p, q, b);
			}
		}
		function scalarbase(p, s) {
			var q = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			set25519(q[0], X);
			set25519(q[1], Y);
			set25519(q[2], gf1);
			M(q[3], X, Y);
			scalarmult(p, q, s);
		}
		function crypto_sign_keypair(pk, sk, seeded) {
			var d = new Uint8Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			var i;
			if (!seeded) randombytes(sk, 32);
			crypto_hash(d, sk, 32);
			d[0] &= 248;
			d[31] &= 127;
			d[31] |= 64;
			scalarbase(p, d);
			pack(pk, p);
			for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
			return 0;
		}
		var L = new Float64Array([
			237,
			211,
			245,
			92,
			26,
			99,
			18,
			88,
			214,
			156,
			247,
			162,
			222,
			249,
			222,
			20,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			16
		]);
		function modL(r, x) {
			var carry, i, j, k;
			for (i = 63; i >= 32; --i) {
				carry = 0;
				for (j = i - 32, k = i - 12; j < k; ++j) {
					x[j] += carry - 16 * x[i] * L[j - (i - 32)];
					carry = Math.floor((x[j] + 128) / 256);
					x[j] -= carry * 256;
				}
				x[j] += carry;
				x[i] = 0;
			}
			carry = 0;
			for (j = 0; j < 32; j++) {
				x[j] += carry - (x[31] >> 4) * L[j];
				carry = x[j] >> 8;
				x[j] &= 255;
			}
			for (j = 0; j < 32; j++) x[j] -= carry * L[j];
			for (i = 0; i < 32; i++) {
				x[i + 1] += x[i] >> 8;
				r[i] = x[i] & 255;
			}
		}
		function reduce(r) {
			var x = new Float64Array(64), i;
			for (i = 0; i < 64; i++) x[i] = r[i];
			for (i = 0; i < 64; i++) r[i] = 0;
			modL(r, x);
		}
		function crypto_sign(sm, m, n, sk) {
			var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
			var i, j, x = new Float64Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			crypto_hash(d, sk, 32);
			d[0] &= 248;
			d[31] &= 127;
			d[31] |= 64;
			var smlen = n + 64;
			for (i = 0; i < n; i++) sm[64 + i] = m[i];
			for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
			crypto_hash(r, sm.subarray(32), n + 32);
			reduce(r);
			scalarbase(p, r);
			pack(sm, p);
			for (i = 32; i < 64; i++) sm[i] = sk[i];
			crypto_hash(h, sm, n + 64);
			reduce(h);
			for (i = 0; i < 64; i++) x[i] = 0;
			for (i = 0; i < 32; i++) x[i] = r[i];
			for (i = 0; i < 32; i++) for (j = 0; j < 32; j++) x[i + j] += h[i] * d[j];
			modL(sm.subarray(32), x);
			return smlen;
		}
		function unpackneg(r, p) {
			var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
			set25519(r[2], gf1);
			unpack25519(r[1], p);
			S(num, r[1]);
			M(den, num, D);
			Z(num, num, r[2]);
			A(den, r[2], den);
			S(den2, den);
			S(den4, den2);
			M(den6, den4, den2);
			M(t, den6, num);
			M(t, t, den);
			pow2523(t, t);
			M(t, t, num);
			M(t, t, den);
			M(t, t, den);
			M(r[0], t, den);
			S(chk, r[0]);
			M(chk, chk, den);
			if (neq25519(chk, num)) M(r[0], r[0], I);
			S(chk, r[0]);
			M(chk, chk, den);
			if (neq25519(chk, num)) return -1;
			if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
			M(r[3], r[0], r[1]);
			return 0;
		}
		function crypto_sign_open(m, sm, n, pk) {
			var i;
			var t = new Uint8Array(32), h = new Uint8Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			], q = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			if (n < 64) return -1;
			if (unpackneg(q, pk)) return -1;
			for (i = 0; i < n; i++) m[i] = sm[i];
			for (i = 0; i < 32; i++) m[i + 32] = pk[i];
			crypto_hash(h, m, n);
			reduce(h);
			scalarmult(p, q, h);
			scalarbase(q, sm.subarray(32));
			add$1(p, q);
			pack(t, p);
			n -= 64;
			if (crypto_verify_32(sm, 0, t, 0)) {
				for (i = 0; i < n; i++) m[i] = 0;
				return -1;
			}
			for (i = 0; i < n; i++) m[i] = sm[i + 64];
			return n;
		}
		var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
		nacl$2.lowlevel = {
			crypto_core_hsalsa20,
			crypto_stream_xor,
			crypto_stream,
			crypto_stream_salsa20_xor,
			crypto_stream_salsa20,
			crypto_onetimeauth,
			crypto_onetimeauth_verify,
			crypto_verify_16,
			crypto_verify_32,
			crypto_secretbox,
			crypto_secretbox_open,
			crypto_scalarmult,
			crypto_scalarmult_base,
			crypto_box_beforenm,
			crypto_box_afternm,
			crypto_box,
			crypto_box_open,
			crypto_box_keypair,
			crypto_hash,
			crypto_sign,
			crypto_sign_keypair,
			crypto_sign_open,
			crypto_secretbox_KEYBYTES,
			crypto_secretbox_NONCEBYTES,
			crypto_secretbox_ZEROBYTES,
			crypto_secretbox_BOXZEROBYTES,
			crypto_scalarmult_BYTES,
			crypto_scalarmult_SCALARBYTES,
			crypto_box_PUBLICKEYBYTES,
			crypto_box_SECRETKEYBYTES,
			crypto_box_BEFORENMBYTES,
			crypto_box_NONCEBYTES,
			crypto_box_ZEROBYTES,
			crypto_box_BOXZEROBYTES,
			crypto_sign_BYTES,
			crypto_sign_PUBLICKEYBYTES,
			crypto_sign_SECRETKEYBYTES,
			crypto_sign_SEEDBYTES,
			crypto_hash_BYTES,
			gf,
			D,
			L,
			pack25519,
			unpack25519,
			M,
			A,
			S,
			Z,
			pow2523,
			add: add$1,
			set25519,
			modL,
			scalarmult,
			scalarbase
		};
		function checkLengths(k, n) {
			if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
			if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
		}
		function checkBoxLengths(pk, sk) {
			if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
			if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
		}
		function checkArrayTypes() {
			for (var i = 0; i < arguments.length; i++) if (!(arguments[i] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array");
		}
		function cleanup(arr) {
			for (var i = 0; i < arr.length; i++) arr[i] = 0;
		}
		nacl$2.randomBytes = function(n) {
			var b = new Uint8Array(n);
			randombytes(b, n);
			return b;
		};
		nacl$2.secretbox = function(msg, nonce, key) {
			checkArrayTypes(msg, nonce, key);
			checkLengths(key, nonce);
			var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
			var c = new Uint8Array(m.length);
			for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
			crypto_secretbox(c, m, m.length, nonce, key);
			return c.subarray(crypto_secretbox_BOXZEROBYTES);
		};
		nacl$2.secretbox.open = function(box, nonce, key) {
			checkArrayTypes(box, nonce, key);
			checkLengths(key, nonce);
			var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
			var m = new Uint8Array(c.length);
			for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
			if (c.length < 32) return null;
			if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
			return m.subarray(crypto_secretbox_ZEROBYTES);
		};
		nacl$2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
		nacl$2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
		nacl$2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
		nacl$2.scalarMult = function(n, p) {
			checkArrayTypes(n, p);
			if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
			if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
			var q = new Uint8Array(crypto_scalarmult_BYTES);
			crypto_scalarmult(q, n, p);
			return q;
		};
		nacl$2.scalarMult.base = function(n) {
			checkArrayTypes(n);
			if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
			var q = new Uint8Array(crypto_scalarmult_BYTES);
			crypto_scalarmult_base(q, n);
			return q;
		};
		nacl$2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
		nacl$2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
		nacl$2.box = function(msg, nonce, publicKey, secretKey) {
			var k = nacl$2.box.before(publicKey, secretKey);
			return nacl$2.secretbox(msg, nonce, k);
		};
		nacl$2.box.before = function(publicKey, secretKey) {
			checkArrayTypes(publicKey, secretKey);
			checkBoxLengths(publicKey, secretKey);
			var k = new Uint8Array(crypto_box_BEFORENMBYTES);
			crypto_box_beforenm(k, publicKey, secretKey);
			return k;
		};
		nacl$2.box.after = nacl$2.secretbox;
		nacl$2.box.open = function(msg, nonce, publicKey, secretKey) {
			var k = nacl$2.box.before(publicKey, secretKey);
			return nacl$2.secretbox.open(msg, nonce, k);
		};
		nacl$2.box.open.after = nacl$2.secretbox.open;
		nacl$2.box.keyPair = function() {
			var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
			crypto_box_keypair(pk, sk);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl$2.box.keyPair.fromSecretKey = function(secretKey) {
			checkArrayTypes(secretKey);
			if (secretKey.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
			var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
			crypto_scalarmult_base(pk, secretKey);
			return {
				publicKey: pk,
				secretKey: new Uint8Array(secretKey)
			};
		};
		nacl$2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
		nacl$2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
		nacl$2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
		nacl$2.box.nonceLength = crypto_box_NONCEBYTES;
		nacl$2.box.overheadLength = nacl$2.secretbox.overheadLength;
		nacl$2.sign = function(msg, secretKey) {
			checkArrayTypes(msg, secretKey);
			if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
			var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
			crypto_sign(signedMsg, msg, msg.length, secretKey);
			return signedMsg;
		};
		nacl$2.sign.open = function(signedMsg, publicKey) {
			checkArrayTypes(signedMsg, publicKey);
			if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
			var tmp = new Uint8Array(signedMsg.length);
			var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
			if (mlen < 0) return null;
			var m = new Uint8Array(mlen);
			for (var i = 0; i < m.length; i++) m[i] = tmp[i];
			return m;
		};
		nacl$2.sign.detached = function(msg, secretKey) {
			var signedMsg = nacl$2.sign(msg, secretKey);
			var sig = new Uint8Array(crypto_sign_BYTES);
			for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
			return sig;
		};
		nacl$2.sign.detached.verify = function(msg, sig, publicKey) {
			checkArrayTypes(msg, sig, publicKey);
			if (sig.length !== crypto_sign_BYTES) throw new Error("bad signature size");
			if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
			var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
			var m = new Uint8Array(crypto_sign_BYTES + msg.length);
			var i;
			for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
			for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
			return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
		};
		nacl$2.sign.keyPair = function() {
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
			crypto_sign_keypair(pk, sk);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl$2.sign.keyPair.fromSecretKey = function(secretKey) {
			checkArrayTypes(secretKey);
			if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
			return {
				publicKey: pk,
				secretKey: new Uint8Array(secretKey)
			};
		};
		nacl$2.sign.keyPair.fromSeed = function(seed) {
			checkArrayTypes(seed);
			if (seed.length !== crypto_sign_SEEDBYTES) throw new Error("bad seed size");
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
			for (var i = 0; i < 32; i++) sk[i] = seed[i];
			crypto_sign_keypair(pk, sk, true);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl$2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
		nacl$2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
		nacl$2.sign.seedLength = crypto_sign_SEEDBYTES;
		nacl$2.sign.signatureLength = crypto_sign_BYTES;
		nacl$2.hash = function(msg) {
			checkArrayTypes(msg);
			var h = new Uint8Array(crypto_hash_BYTES);
			crypto_hash(h, msg, msg.length);
			return h;
		};
		nacl$2.hash.hashLength = crypto_hash_BYTES;
		nacl$2.verify = function(x, y) {
			checkArrayTypes(x, y);
			if (x.length === 0 || y.length === 0) return false;
			if (x.length !== y.length) return false;
			return vn(x, 0, y, 0, x.length) === 0 ? true : false;
		};
		nacl$2.setPRNG = function(fn) {
			randombytes = fn;
		};
		(function() {
			var crypto$1 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
			if (crypto$1 && crypto$1.getRandomValues) {
				var QUOTA = 65536;
				nacl$2.setPRNG(function(x, n) {
					var i, v = new Uint8Array(n);
					for (i = 0; i < n; i += QUOTA) crypto$1.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
					for (i = 0; i < n; i++) x[i] = v[i];
					cleanup(v);
				});
			} else if (typeof __require !== "undefined") {
				crypto$1 = require_tweetnacl();
				if (crypto$1 && crypto$1.randomBytes) nacl$2.setPRNG(function(x, n) {
					var i, v = crypto$1.randomBytes(n);
					for (i = 0; i < n; i++) x[i] = v[i];
					cleanup(v);
				});
			}
		})();
	})(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
} });

//#endregion
//#region ../@core/src/kwil-nep413-signer/index.ts
function implicitAddressFromPublicKey(publicKey) {
	const key_without_prefix = publicKey.replace(/^ed25519:/, "");
	const implicitAddress = (0, import_hex.encode)(bs58Decode(key_without_prefix));
	return implicitAddress;
}

//#endregion
//#region ../@core/src/kwil-infra/create-near-wallet-kwil-signer.ts
const NEAR_WALLET_TYPES = [
	"browser",
	"injected",
	"instant-link",
	"hardware",
	"bridge"
];
function looksLikeNearWallet(signer) {
	return signer !== null && typeof signer === "object" && "id" in signer && "metadata" in signer && "type" in signer && typeof signer.type === "string" && NEAR_WALLET_TYPES.includes(signer.type);
}
var KwilNonce = class {
	bytes;
	constructor(length = 32) {
		this.bytes = crypto.getRandomValues(new Uint8Array(length));
	}
	get clampUTF8() {
		return this.bytes.map((byte) => byte & 127);
	}
};
async function createNearWalletKwilSigner(wallet, currentAddress, store, kwilClient, recipient = "idos.network") {
	if (!wallet.signMessage) throw new Error("Only wallets with signMessage are supported.");
	if (wallet.id === "my-near-wallet") {
		const { accountId, signature, publicKey: publicKey$1, error } = Object.fromEntries(new URLSearchParams(window.location.hash.slice(1)).entries());
		if (signature) {
			store.set("signer-address", accountId);
			store.set("signer-public-key", publicKey$1);
		}
		const signMessageOriginal = wallet.signMessage.bind(wallet);
		wallet.signMessage = async ({ message, recipient: recipient$1 }) => {
			if (error) return Promise.reject();
			const lastMessage = store.get("sign-last-message");
			if (signature && message === lastMessage) {
				const nonce$1 = Buffer.from(store.get("sign-last-nonce"));
				const callbackUrl$1 = store.get("sign-last-url");
				return Promise.resolve({
					accountId: currentAddress,
					publicKey: publicKey$1,
					signature,
					nonce: nonce$1,
					message,
					callbackUrl: callbackUrl$1
				});
			}
			const callbackUrl = window.location.href;
			const nonce = Buffer.from(new KwilNonce(32).clampUTF8);
			store.set("sign-last-message", message);
			store.set("sign-last-nonce", Array.from(nonce));
			store.set("sign-last-url", callbackUrl);
			signMessageOriginal({
				message,
				nonce,
				recipient: recipient$1,
				callbackUrl
			});
			return new Promise(() => ({}));
		};
	}
	const storedAddress = store.get("signer-address");
	let publicKey = store.get("signer-public-key");
	if (storedAddress !== currentAddress || !publicKey) {
		store.reset();
		await kwilClient.client.auth.logoutKGW();
		const message = "idOS authentication";
		const nonce = Buffer.from(new KwilNonce(32).bytes);
		({publicKey} = await wallet.signMessage({
			message,
			recipient,
			nonce
		}));
		store.set("signer-address", currentAddress);
		store.set("signer-public-key", publicKey);
	}
	const signer = async (message) => {
		if (typeof message !== "string") message = (0, import_utf8$1.decode)(message);
		if (!wallet.signMessage) throw new Error("Only wallets with signMessage are supported.");
		const nonceSuggestion = Buffer.from(new KwilNonce(32).bytes);
		const { nonce = nonceSuggestion, signature, callbackUrl } = await wallet.signMessage({
			message,
			recipient,
			nonce: nonceSuggestion
		});
		const nep413BorschSchema = { struct: {
			tag: "u32",
			message: "string",
			nonce: { array: {
				type: "u8",
				len: 32
			} },
			recipient: "string",
			callbackUrl: { option: "string" }
		} };
		const nep413BorshParams = {
			tag: 2147484061,
			message,
			nonce: Array.from(nonce),
			recipient,
			callbackUrl
		};
		const nep413BorshPayload = serialize(nep413BorschSchema, nep413BorshParams);
		return (0, import_bytes.concat)((0, import_binary.writeUint16BE)(nep413BorshPayload.length), nep413BorshPayload, (0, import_base64.decode)(signature));
	};
	return new KwilSigner(signer, implicitAddressFromPublicKey(publicKey), "nep413");
}

//#endregion
//#region ../@core/src/kwil-infra/create-kwil-signer.ts
var import_nacl_fast$1 = __toESM(require_nacl_fast(), 1);
async function createClientKwilSigner(store, kwilClient, wallet) {
	if ("connect" in wallet && "address" in wallet) {
		wallet = wallet;
		const currentAddress = await wallet.getAddress();
		const storedAddress = store.get("signer-address");
		if (storedAddress !== currentAddress) {
			await kwilClient.client.auth.logoutKGW();
			store.set("signer-address", currentAddress);
		}
		return [new KwilSigner(wallet, currentAddress), currentAddress];
	}
	if (looksLikeNearWallet(wallet)) {
		const accountId = (await wallet.getAccounts())[0].accountId;
		return [await createNearWalletKwilSigner(wallet, accountId, store, kwilClient), accountId];
	}
	return ((_) => {
		throw new Error("Invalid `signer` type");
	})(wallet);
}

//#endregion
//#region ../@core/src/store/index.ts
var Store = class {
	keyPrefix = "idOS-";
	storage;
	REMEMBER_DURATION_KEY = "storage-expiration";
	constructor(storage) {
		this.storage = storage;
		if (this.hasRememberDurationElapsed()) this.reset();
	}
	#setLocalStorage(key, value) {
		this.storage.setItem(`${this.keyPrefix}${key}`, value);
	}
	#getLocalStorage(key) {
		return this.storage.getItem(`${this.keyPrefix}${key}`);
	}
	#removeLocalStorage(key) {
		this.storage.removeItem(`${this.keyPrefix}${key}`);
	}
	pipeCodec({ encode: encode$3, decode: decode$3 }) {
		return {
			...this,
			get: (key) => {
				const result = this.get(key);
				if (result) return decode$3(result);
			},
			set: (key, value) => this.set.call(this, key, encode$3(value))
		};
	}
	get(key) {
		const value = this.#getLocalStorage(key);
		if (!value) return void 0;
		return JSON.parse(value);
	}
	setRememberDuration(days) {
		const daysNumber = !days || Number.isNaN(Number(days)) ? void 0 : Number.parseInt(days.toString());
		if (!daysNumber) {
			this.#removeLocalStorage(this.REMEMBER_DURATION_KEY);
			return;
		}
		const date = new Date();
		date.setTime(date.getTime() + daysNumber * 24 * 60 * 60 * 1e3);
		this.#setLocalStorage(this.REMEMBER_DURATION_KEY, JSON.stringify(date.toISOString()));
	}
	hasRememberDurationElapsed() {
		const value = this.#getLocalStorage(this.REMEMBER_DURATION_KEY);
		if (!value) return false;
		let str;
		try {
			str = JSON.parse(value);
		} catch (_) {
			this.#removeLocalStorage(this.REMEMBER_DURATION_KEY);
			return false;
		}
		const expires = Date.parse(str);
		if (Number.isNaN(expires)) {
			this.#removeLocalStorage(this.REMEMBER_DURATION_KEY);
			return false;
		}
		return expires < Date.now();
	}
	set(key, value) {
		if (!key || typeof key !== "string") throw new Error(`Bad key: ${key}`);
		if (!value) return;
		this.#setLocalStorage(key, JSON.stringify(value));
	}
	reset() {
		for (const key of Object.keys(this.storage)) if (key.startsWith(this.keyPrefix)) this.storage.removeItem(key);
	}
};

//#endregion
//#region ../@core/src/utils/index.ts
var import_nacl_fast = __toESM(require_nacl_fast(), 1);
async function buildInsertableIDOSCredential(userId, publicNotes, content, recipientEncryptionPublicKey, encryptorPublicKey) {
	invariant(recipientEncryptionPublicKey, "Missing `recipientEncryptionPublicKey`");
	invariant(encryptorPublicKey, "Missing `encryptorPublicKey`");
	const ephemeralAuthenticationKeyPair = import_nacl_fast.default.sign.keyPair();
	const publicNotesSignature = import_nacl_fast.default.sign.detached((0, import_utf8$1.encode)(publicNotes), ephemeralAuthenticationKeyPair.secretKey);
	return {
		user_id: userId,
		content,
		public_notes: publicNotes,
		public_notes_signature: (0, import_base64.encode)(publicNotesSignature),
		broader_signature: (0, import_base64.encode)(import_nacl_fast.default.sign.detached(Uint8Array.from([...publicNotesSignature, ...(0, import_base64.decode)(content)]), ephemeralAuthenticationKeyPair.secretKey)),
		issuer_auth_public_key: (0, import_hex.encode)(ephemeralAuthenticationKeyPair.publicKey, true),
		encryptor_public_key: encryptorPublicKey
	};
}

//#endregion
//#region src/enclave/iframe-enclave.ts
var IframeEnclave = class {
	options;
	container;
	iframe;
	hostUrl;
	constructor(options) {
		const { container,...other } = options;
		this.container = container;
		this.options = other;
		this.hostUrl = new URL(other.url ?? "https://enclave.idos.network");
		this.iframe = document.createElement("iframe");
		this.iframe.id = "idos-enclave-iframe";
	}
	async load() {
		await this.loadEnclave();
		await this.requestToEnclave("load");
		await this.requestToEnclave({ configure: this.options });
	}
	async reconfigure(options) {
		Object.assign(this.options, options);
		await this.requestToEnclave({ configure: this.options });
	}
	async ready(userId, expectedUserEncryptionPublicKey) {
		let { encryptionPublicKey: userEncryptionPublicKey } = await this.requestToEnclave({ storage: {
			userId,
			expectedUserEncryptionPublicKey
		} });
		while (!userEncryptionPublicKey) {
			this.showEnclave();
			try {
				userEncryptionPublicKey = await this.requestToEnclave({ keys: {} });
			} catch (e) {
				if (this.options.throwOnUserCancelUnlock) throw e;
			} finally {
				this.hideEnclave();
			}
		}
		return userEncryptionPublicKey;
	}
	async reset() {
		this.requestToEnclave({ reset: {} });
	}
	async confirm(message) {
		this.showEnclave();
		return this.requestToEnclave({ confirm: { message } }).then((response) => {
			this.hideEnclave();
			return response;
		});
	}
	async encrypt(message, receiverPublicKey) {
		return this.requestToEnclave({ encrypt: {
			message,
			receiverPublicKey
		} });
	}
	async decrypt(message, senderPublicKey) {
		return this.requestToEnclave({ decrypt: {
			fullMessage: message,
			senderPublicKey
		} });
	}
	filterCredentials(credentials, privateFieldFilters) {
		return this.requestToEnclave({ filterCredentials: {
			credentials,
			privateFieldFilters
		} });
	}
	async loadEnclave() {
		const container = document.querySelector(this.container) || throwNewError(Error, `Can't find container with selector ${this.container}`);
		const permissionsPolicies = ["publickey-credentials-get", "storage-access"];
		const liftedSandboxRestrictions = [
			"forms",
			"modals",
			"popups",
			"popups-to-escape-sandbox",
			"same-origin",
			"scripts"
		].map((toLift) => `allow-${toLift}`);
		const referrerPolicy = "origin";
		const styles = {
			"aspect-ratio": "4/1",
			"background-color": "transparent",
			border: "none",
			display: "block",
			width: "100%"
		};
		this.iframe.allow = permissionsPolicies.join("; ");
		this.iframe.referrerPolicy = referrerPolicy;
		this.iframe.sandbox.add(...liftedSandboxRestrictions);
		this.iframe.src = this.hostUrl.toString();
		for (const [k, v] of Object.entries(styles)) this.iframe.style.setProperty(k, v);
		let el;
		while (el = document.getElementById(this.iframe.id)) {
			console.log("reinstalling idOS iframe...");
			container.removeChild(el);
		}
		container.appendChild(this.iframe);
		return new Promise((resolve) => this.iframe.addEventListener("load", () => {
			resolve();
		}, { once: true }));
	}
	showEnclave() {
		this.iframe.parentElement.classList.add("visible");
	}
	hideEnclave() {
		this.iframe.parentElement.classList.remove("visible");
	}
	/* __PATCHED_FOR_NEW_ENCLAVE__ */
	async requestToEnclave(request) {
		let method, args;
		if (typeof request === "string") {
			method = request; args = [];
		} else {
			const key = Object.keys(request)[0];
			const value = request[key];
			switch (key) {
				case "configure": method = "reconfigure"; args = [value]; break;
				case "storage": method = "reconfigure"; args = [value]; break;
				case "keys": method = "ensureUserEncryptionProfile"; args = []; break;
				case "reset": method = "reset"; args = []; break;
				case "confirm": method = "confirm"; args = [value.message]; break;
				case "encrypt": method = "encrypt"; args = [value.message, value.receiverPublicKey]; break;
				case "decrypt": method = "decrypt"; args = [value.fullMessage, value.senderPublicKey]; break;
				case "filterCredentials": method = "filterCredentials"; args = [value.credentials, value.privateFieldFilters]; break;
				case "backupPasswordOrSecret": method = "backupUserEncryptionProfile"; args = []; break;
				default: method = key; args = [value]; break;
			}
		}
		return new Promise((resolve, reject) => {
			const { port1, port2 } = new MessageChannel();
			port1.onmessage = ({ data }) => {
				port1.close();
				data.error ? reject(data.error) : resolve(data.result);
			};
			this.iframe.contentWindow.postMessage({ method, data: args }, this.hostUrl.origin, [port2]);
		});
	}
	async backupPasswordOrSecret() {
		const abortController = new AbortController();
		this.showEnclave();
		window.addEventListener("message", async (event) => {
			if (event.data.type !== "idOS:store" || event.origin !== this.hostUrl.origin) return;
			let status = "";
			try {
				status = "success";
				this.hideEnclave();
			} catch (_) {
				status = "failure";
				this.hideEnclave();
			}
			event.ports[0].postMessage({ result: {
				type: "idOS:store",
				status
			} });
			event.ports[0].close();
			abortController.abort();
		}, { signal: abortController.signal });
		try {
			await this.requestToEnclave({ backupPasswordOrSecret: {} });
		} catch (error) {
			console.error(error);
		} finally {
			this.hideEnclave();
		}
	}
	async discoverUserEncryptionPublicKey(userId) {
		if (this.options.mode !== "new") throw new Error("You can only call `discoverUserEncryptionPublicKey` when mode is `new`.");
		const userEncryptionPublicKey = await this.ready(userId);
		return {
			userId,
			userEncryptionPublicKey: (0, import_base64.encode)(userEncryptionPublicKey)
		};
	}
};
function throwNewError(ErrorClass, ...args) {
	throw new ErrorClass(...args);
}

//#endregion
//#region src/index.ts
var idOSClientConfiguration = class {
	state;
	chainId;
	nodeUrl;
	enclaveOptions;
	constructor(params) {
		this.state = "configuration";
		this.chainId = params.chainId;
		this.nodeUrl = params.nodeUrl;
		this.enclaveOptions = params.enclaveOptions;
	}
	async createClient() {
		return idOSClientIdle.fromConfig(this);
	}
};
var idOSClientIdle = class idOSClientIdle {
	state;
	store;
	kwilClient;
	enclaveProvider;
	constructor(store, kwilClient, enclaveProvider) {
		this.state = "idle";
		this.store = store;
		this.kwilClient = kwilClient;
		this.enclaveProvider = enclaveProvider;
	}
	static async fromConfig(params) {
		const store = new Store(window.localStorage);
		const kwilClient = await createWebKwilClient({
			nodeUrl: params.nodeUrl,
			chainId: params.chainId
		});
		const enclaveProvider = new IframeEnclave({ ...params.enclaveOptions });
		await enclaveProvider.load();
		return new idOSClientIdle(store, kwilClient, enclaveProvider);
	}
	async addressHasProfile(address) {
		return hasProfile(this.kwilClient, address);
	}
	async withUserSigner(signer) {
		const [kwilSigner, walletIdentifier] = await createClientKwilSigner(this.store, this.kwilClient, signer);
		this.kwilClient.setSigner(kwilSigner);
		return new idOSClientWithUserSigner(this, signer, kwilSigner, walletIdentifier);
	}
	async logOut() {
		return this;
	}
};
var idOSClientWithUserSigner = class {
	state;
	store;
	kwilClient;
	enclaveProvider;
	signer;
	kwilSigner;
	walletIdentifier;
	constructor(idOSClientIdle$1, signer, kwilSigner, walletIdentifier) {
		this.state = "with-user-signer";
		this.store = idOSClientIdle$1.store;
		this.kwilClient = idOSClientIdle$1.kwilClient;
		this.enclaveProvider = idOSClientIdle$1.enclaveProvider;
		this.signer = signer;
		this.kwilSigner = kwilSigner;
		this.walletIdentifier = walletIdentifier;
	}
	async logOut() {
		this.kwilClient.setSigner(void 0);
		return new idOSClientIdle(this.store, this.kwilClient, this.enclaveProvider);
	}
	async hasProfile() {
		return hasProfile(this.kwilClient, this.walletIdentifier);
	}
	async getUserEncryptionPublicKey(userId) {
		await this.enclaveProvider.reconfigure({ mode: "new" });
		const { userEncryptionPublicKey } = await this.enclaveProvider.discoverUserEncryptionPublicKey(userId);
		return userEncryptionPublicKey;
	}
	async logIn() {
		if (!await this.hasProfile()) throw new Error("User does not have a profile");
		await this.enclaveProvider.reconfigure({ mode: "existing" });
		const kwilUser = await getUserProfile(this.kwilClient);
		return new idOSClientLoggedIn(this, kwilUser);
	}
};
var idOSClientLoggedIn = class {
	state;
	store;
	kwilClient;
	enclaveProvider;
	signer;
	kwilSigner;
	walletIdentifier;
	user;
	constructor(idOSClientWithUserSigner$1, user) {
		this.state = "logged-in";
		this.store = idOSClientWithUserSigner$1.store;
		this.kwilClient = idOSClientWithUserSigner$1.kwilClient;
		this.enclaveProvider = idOSClientWithUserSigner$1.enclaveProvider;
		this.signer = idOSClientWithUserSigner$1.signer;
		this.kwilSigner = idOSClientWithUserSigner$1.kwilSigner;
		this.walletIdentifier = idOSClientWithUserSigner$1.walletIdentifier;
		this.user = user;
	}
	async logOut() {
		this.kwilClient.setSigner(void 0);
		return new idOSClientIdle(this.store, this.kwilClient, this.enclaveProvider);
	}
	async requestDWGMessage(params) {
		return requestDWGMessage(this.kwilClient, params);
	}
	async removeCredential(id) {
		return await removeCredential(this.kwilClient, id);
	}
	async getCredentialById(id) {
		return getCredentialById(this.kwilClient, id);
	}
	async shareCredential(credential) {
		return shareCredential(this.kwilClient, credential);
	}
	async getAllCredentials() {
		return getAllCredentials(this.kwilClient);
	}
	async getAccessGrantsOwned() {
		return getAccessGrantsOwned(this.kwilClient);
	}
	async getCredentialOwned(id) {
		return getCredentialOwned(this.kwilClient, id);
	}
	async getAttributes() {
		return getAttributes(this.kwilClient);
	}
	async createAttribute(attribute) {
		return createAttribute(this.kwilClient, attribute);
	}
	async getCredentialContentSha256Hash(id) {
		const credential = await getCredentialById(this.kwilClient, id);
		invariant(credential, `"idOSCredential" with id ${id} not found`);
		await this.enclaveProvider.ready(this.user.id, this.user.recipient_encryption_public_key);
		const plaintext = await this.enclaveProvider.decrypt((0, import_base64.decode)(credential.content), (0, import_base64.decode)(credential.encryptor_public_key));
		return hexEncodeSha256Hash(plaintext);
	}
	async createCredentialCopy(id, consumerRecipientEncryptionPublicKey, consumerAddress, lockedUntil) {
		const originalCredential = await getCredentialById(this.kwilClient, id);
		invariant(originalCredential, `"idOSCredential" with id ${id} not found`);
		await this.enclaveProvider.ready(this.user.id, this.user.recipient_encryption_public_key);
		const decryptedContent = await this.enclaveProvider.decrypt((0, import_base64.decode)(originalCredential.content), (0, import_base64.decode)(originalCredential.encryptor_public_key));
		const { content, encryptorPublicKey } = await this.enclaveProvider.encrypt(decryptedContent, (0, import_base64.decode)(consumerRecipientEncryptionPublicKey));
		const insertableCredential = {
			...await buildInsertableIDOSCredential(originalCredential.user_id, "", (0, import_base64.encode)(content), consumerRecipientEncryptionPublicKey, (0, import_base64.encode)(encryptorPublicKey)),
			grantee_wallet_identifier: consumerAddress,
			locked_until: lockedUntil
		};
		const copyId = crypto.randomUUID();
		await createCredentialCopy(this.kwilClient, {
			original_credential_id: originalCredential.id,
			...originalCredential,
			...insertableCredential,
			id: copyId
		});
		return { id: copyId };
	}
	async requestDAGMessage(params) {
		return requestDAGMessage(this.kwilClient, params);
	}
	async getGrants(params) {
		return {
			grants: await getGrants(this.kwilClient, params),
			totalCount: await this.getGrantsCount()
		};
	}
	async addWallets(params) {
		return addWallets(this.kwilClient, params);
	}
	async getGrantsCount() {
		return getGrantsCount(this.kwilClient);
	}
	async getSharedCredential(id) {
		return getSharedCredential(this.kwilClient, id);
	}
	async revokeAccessGrant(grantId) {
		return revokeAccessGrant(this.kwilClient, grantId);
	}
	async addWallet(params) {
		return addWallet(this.kwilClient, params);
	}
	async getWallets() {
		return getWallets(this.kwilClient);
	}
	async removeWallet(id) {
		return removeWallet(this.kwilClient, id);
	}
	async removeWallets(ids) {
		return removeWallets(this.kwilClient, ids);
	}
	async filterCredentials(requirements) {
		const matchCriteria = (content, criteria) => every(Object.entries(criteria), ([path, targetSet]) => targetSet.includes(get(content, path)));
		const credentials = await this.getAllCredentials();
		const originalCredentials = credentials.filter((cred) => !cred.original_id && !!cred.public_notes);
		invariant(originalCredentials.length, "No original credentials found");
		let result = originalCredentials.filter((cred) => {
			return requirements.acceptedIssuers?.some((issuer) => issuer.authPublicKey === cred.issuer_auth_public_key);
		});
		const publicNotesFieldFilters = requirements.publicNotesFieldFilters;
		if (publicNotesFieldFilters) result = result.filter((credential) => {
			let publicNotes;
			try {
				publicNotes = JSON.parse(credential.public_notes);
			} catch (_) {
				throw new Error(`Credential ${credential.id} has non-JSON public notes".replace("{}`);
			}
			return matchCriteria(publicNotes, publicNotesFieldFilters.pick) && negate(() => matchCriteria(publicNotes, publicNotesFieldFilters.omit));
		});
		const privateFieldFilters = requirements.privateFieldFilters;
		if (privateFieldFilters) result = await this.enclaveProvider.filterCredentials(result, privateFieldFilters);
		return result;
	}
	async requestAccessGrant(credentialId, { consumerEncryptionPublicKey, consumerAuthPublicKey }) {
		const credential = await getCredentialById(this.kwilClient, credentialId);
		const contentHash = await this.getCredentialContentSha256Hash(credentialId);
		invariant(credential, `"idOSCredential" with id ${credentialId} not found`);
		const plaintextContent = (0, import_utf8$1.decode)(await this.enclaveProvider.decrypt((0, import_base64.decode)(credential.content), (0, import_base64.decode)(credential.encryptor_public_key)));
		await this.enclaveProvider.ready(this.user.id, this.user.recipient_encryption_public_key);
		const { content, encryptorPublicKey } = await this.enclaveProvider.encrypt((0, import_utf8$1.encode)(plaintextContent), (0, import_base64.decode)(consumerEncryptionPublicKey));
		const insertableCredential = {
			...credential,
			...await buildInsertableIDOSCredential(credential.user_id, "", (0, import_base64.encode)(content), consumerAuthPublicKey, (0, import_base64.encode)(encryptorPublicKey)),
			original_credential_id: credential.id,
			id: crypto.randomUUID(),
			grantee_wallet_identifier: consumerAuthPublicKey,
			locked_until: 0,
			content_hash: contentHash
		};
		await this.shareCredential(insertableCredential);
		return insertableCredential;
	}
};
function createIDOSClient(params) {
	return new idOSClientConfiguration({
		nodeUrl: params.nodeUrl,
		enclaveOptions: params.enclaveOptions
	});
}

//#endregion
export { createIDOSClient, idOSClientConfiguration, idOSClientIdle, idOSClientLoggedIn, idOSClientWithUserSigner };
//# sourceMappingURL=index.js.map