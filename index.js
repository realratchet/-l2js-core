/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../src/asset-loader.ts":
/*!******************************!*\
  !*** ../src/asset-loader.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AssetLoader": () => (/* binding */ AssetLoader),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "../node_modules/path-browserify/index.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _supported_extensions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./supported-extensions */ "../src/supported-extensions.js");
/* harmony import */ var _supported_extensions__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_supported_extensions__WEBPACK_IMPORTED_MODULE_2__);



class AssetLoader {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "packages", new Map());
  }
  init(assetList, {
    UPackage,
    UNativePackage
  }) {
    this.packages.set("native", new Map([["U", this.createNativePackage(UNativePackage)]]));
    for (let [path, downloadPath] of Object.entries(assetList)) {
      const [pkgName, pkgExt] = pathToPkgName(path);
      if (!this.packages.has(pkgName)) this.packages.set(pkgName, new Map());
      const packages = this.packages.get(pkgName);
      if (packages.has(pkgExt)) throw new Error(`Package already registered: ${pkgName}`);
      packages.set(pkgExt, this.createPackage(UPackage, downloadPath));
    }
    return this;
  }
  getPackage(pkgName, impType) {
    const pkg = getPackage(this.packages, pkgName, impType);
    if (pkg === null) throw new Error(`Package '${pkgName}[${impType}]' not found!`);
    return pkg;
  }
  hasPackage(pkgName, impType) {
    return getPackage(this.packages, pkgName, impType) !== null;
  }
  async load(pkg) {
    const pkgsToLoad = [pkg];
    while (pkgsToLoad.length > 0) {
      const pkg = pkgsToLoad.shift();
      if (pkg.isDecoded()) continue;
      await pkg.decode();
      for (const entry of pkg.imports.filter(imp => imp.className !== "Package")) {
        let entrypackage = pkg.getImportEntry(entry.idPackage);
        while (entrypackage.idPackage !== 0) entrypackage = pkg.getImportEntry(entrypackage.idPackage);
        const packageName = entrypackage.objectName;
        const className = entry.className;
        if (!this.hasPackage(packageName, className)) throw new Error(`Package '${packageName}' for type '${className}' does not exist.`);
        const dependency = this.getPackage(packageName, className);
        if (!dependency) debugger;
        if (pkgsToLoad.includes(dependency)) continue;
        pkgsToLoad.push(dependency);
      }
    }
    return pkg;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AssetLoader);

const impProperties = ["ObjectProperty", "StructProperty", "ByteProperty", "BoolProperty", "NameProperty", "FloatProperty", "ArrayProperty", "IntProperty", "ClassProperty", "StrProperty"];
const packageTypes = new Set(_supported_extensions__WEBPACK_IMPORTED_MODULE_2__.SUPPORTED_EXTENSIONS.slice().concat(["NATIVE"]));
const extToTypes = new Map([...packageTypes].map(v => {
  return [v, new Set()];
}));
const impToTypes = new Map();
function addImpExtension(ext, ...classList) {
  for (const cls of classList) {
    const impName = cls;
    extToTypes.get(ext).add(impName);
    if (!impToTypes.has(impName)) impToTypes.set(impName, new Set());
    impToTypes.get(impName).add(ext);
  }
}
addImpExtension("UNR", "Level");
addImpExtension("UTX", "Texture", "TexOscillator", "Shader", "ColorModifier", "FinalBlend", "TexEnvMap", "Combiner", "TexCoordSource", "TexPanner");
addImpExtension("UAX", "Sound");
addImpExtension("USX", "StaticMesh");
addImpExtension("UKX", "Animation", "SkeletalMesh", "VertMesh");
addImpExtension("USK", "Effect");
addImpExtension("U", "Script", "State", "Class", "Struct", "Function", "Enum", ...impProperties, "Texture");
function pathToPkgName(path) {
  const ext = path__WEBPACK_IMPORTED_MODULE_1__.extname(path);
  const extUpper = ext.slice(1).toUpperCase();
  if (!packageTypes.has(extUpper)) throw new Error(`Unsupported package type '${ext}' for package '${path__WEBPACK_IMPORTED_MODULE_1__.basename(path)}'`);
  return [path__WEBPACK_IMPORTED_MODULE_1__.basename(path, ext), extUpper];
}
function getPackage(allPackages, pkgName, impType) {
  const packages = allPackages.get(pkgName.toLowerCase());
  const validExts = impToTypes.get(impType);
  let pkg = null;
  for (const ext of validExts) {
    if (!packages.has(ext)) continue;
    pkg = packages.get(ext);
    break;
  }
  return pkg;
}

/***/ }),

/***/ "../src/buffer-value.ts":
/*!******************************!*\
  !*** ../src/buffer-value.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BufferValue": () => (/* binding */ BufferValue),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");

const expIsPrintable = /^[^\x00-\x1F\x80-\x9F]$/i;
const int32 = {
  bytes: 4,
  signed: true,
  name: "int32",
  dtype: Int32Array
};
const float = {
  bytes: 4,
  signed: true,
  name: "float",
  dtype: Float32Array
};
const compat32 = {
  bytes: 4,
  signed: true,
  name: "compat32"
};
const uint32 = {
  bytes: 4,
  signed: false,
  name: "uint32",
  dtype: Uint32Array
};
const int64 = {
  bytes: 8,
  signed: true,
  name: "int64",
  dtype: BigInt64Array
};
const uint64 = {
  bytes: 8,
  signed: false,
  name: "uint64",
  dtype: BigUint64Array
};
const int8 = {
  bytes: 1,
  signed: true,
  name: "int8",
  dtype: Int8Array
};
const uint8 = {
  bytes: 1,
  signed: false,
  name: "uint8",
  dtype: Uint8Array
};
const int16 = {
  bytes: 2,
  signed: true,
  name: "int16",
  dtype: Int16Array
};
const uint16 = {
  bytes: 2,
  signed: false,
  name: "uint16",
  dtype: Uint16Array
};
const guid = {
  bytes: 4 * 4,
  signed: true,
  name: "guid"
};
const char = {
  bytes: NaN,
  signed: true,
  name: "char"
};
const utf16 = {
  bytes: NaN,
  signed: true,
  name: "utf16"
};
const decoderUTF16 = new TextDecoder("utf-16");
class BufferValue {
  static allocBytes(bytes) {
    return new BufferValue(Object.freeze({
      bytes: bytes,
      signed: true,
      name: "buffer"
    }));
  }
  constructor(type) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "bytes", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "type", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "endianess", "little");
    this.type = Object.assign({}, type);
    this.bytes = new DataView(new ArrayBuffer(isFinite(this.type.bytes) ? this.type.bytes : 0));
  }
  slice(start, end) {
    const child = new BufferValue(this.type);
    child.bytes = new DataView(this.bytes.buffer, start, end - start);
    return child;
  }
  readValue(buffer, offset) {
    if (buffer.byteLength <= offset + this.type.bytes) throw new Error("Out of bounds");
    let byteOffset = 0;
    if (this.type.name === "char") {
      const length = new BufferValue(uint8);
      length.readValue(buffer, offset);
      byteOffset = length.value > 0 ? length.type.bytes + 1 : 1;
      offset = offset + byteOffset - 1;
      this.type.bytes = length.value - 1;
    } else if (this.type.name === "compat32") {
      const byte = new BufferValue(uint8);
      let startOffset = offset;
      byte.readValue(buffer, offset);
      offset += byte.bytes.byteLength;
      let b = byte.bytes.getUint8(0);
      const sign = b & 0x80; // sign bit
      let shift = 6;
      let r = b & 0x3f;
      if (b & 0x40)
        // has 2nd byte
        {
          do {
            byte.readValue(buffer, offset);
            b = byte.bytes.getUint8(0);
            offset += byte.bytes.byteLength;
            r |= (b & 0x7F) << shift;
            shift += 7;
          } while (b & 0x80); // has more bytes
        }

      r = sign ? -r : r;
      this.bytes.setInt32(0, r, this.endianess === "little");
      return offset - startOffset;
    } else if (this.type.name === "utf16") {
      const length = new BufferValue(uint32);
      length.readValue(buffer, offset);
      byteOffset = length.type.bytes + 1;
      offset = offset + byteOffset - 1;
      this.type.bytes = length.value;
      this.type.bytes = this.type.bytes;
      byteOffset = byteOffset - 1;
    }
    this.bytes = new DataView(buffer.slice(offset, offset + this.type.bytes));
    return this.bytes.byteLength + byteOffset;
  }
  get string() {
    if (this.type.name === "utf16") {
      return decoderUTF16.decode(this.bytes.buffer /*.slice(3)*/);
    }

    let string = "";
    for (let i = 0, bc = this.bytes.byteLength; i < bc; i++) {
      const charCode = this.bytes.getUint8(this.bytes.byteOffset + i);
      const char = String.fromCharCode(charCode);
      string += char.match(expIsPrintable) ? char : ".";
    }
    return string;
  }
  set value(bytes) {
    if (typeof bytes === "number") {
      let funName = null;
      switch (this.type.name) {
        case "int64":
          funName = "setBigInt64";
          break;
        case "uint64":
          funName = "setBigUint64";
          break;
        case "int32":
          funName = "setInt32";
          break;
        case "float":
          funName = "setFloat32";
          break;
        case "uint32":
          funName = "setUint32";
          break;
        case "int16":
          funName = "setInt16";
          break;
        case "uint16":
          funName = "setUint16";
          break;
        case "int8":
          funName = "setInt8";
          break;
        case "uint8":
          funName = "setUint8";
          break;
        default:
          throw new Error(`Unknown type: ${this.type.name}`);
      }
      this.bytes[funName](this.bytes.byteOffset + 0, bytes, this.endianess === "little");
    } else throw new Error("Invalid action.");
  }
  get value() {
    const buffer = this.bytes;
    let funName = null;
    switch (this.type.name) {
      case "int64":
        funName = "getBigInt64";
        break;
      case "uint64":
        funName = "getBigUint64";
        break;
      case "compat32":
      case "int32":
        funName = "getInt32";
        break;
      case "float":
        funName = "getFloat32";
        break;
      case "uint32":
        funName = "getUint32";
        break;
      case "int8":
        funName = "getInt8";
        break;
      case "uint8":
        funName = "getUint8";
        break;
      case "int16":
        funName = "getInt16";
        break;
      case "uint16":
        funName = "getUint16";
        break;
      case "guid":
      case "char":
      case "utf16":
      case "buffer":
        break;
      default:
        throw new Error(`Unknown type: ${this.type.name}`);
    }
    if (funName) return buffer[funName](buffer.byteOffset, this.endianess === "little");else if (this.type.name === "guid") return this.bytes;else if (this.type.name === "char" || this.type.name === "utf16") return this.string;
    return this.bytes;
  }
  get hex() {
    if (this.type.name === "buffer" || this.type.name === "char") {
      if (this.bytes.byteLength === 1) return `0x${this.bytes.getUint8(this.bytes.byteOffset + 0)}`;
      let string = "0x";
      for (let i = 0; i < this.bytes.byteLength; i += 2) {
        const bits = this.bytes.getUint16(this.bytes.byteOffset + i, this.endianess === "little");
        const bitB = (bits >> 8 & 0xFF).toString(16).toUpperCase();
        const bitA = (bits & 0x00FF).toString(16).toUpperCase();
        string += (bitA.length === 1 ? `0${bitA}` : bitA) + (bitB.length === 1 ? `0${bitB}` : bitB);
      }
      return string;
    }
    const bits = this.toString(16).toUpperCase();
    const head = new Array(bits.length - this.type.bytes).fill("0").join("");
    return `0x${head}${bits}`;
  }
  toString(...args) {
    return this.value.toString(...args);
  }
}
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "uint64", uint64);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "int64", int64);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "compat32", compat32);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "uint32", uint32);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "int32", int32);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "int8", int8);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "uint8", uint8);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "int16", int16);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "uint16", uint16);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "guid", guid);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "char", char);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "utf16", utf16);
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(BufferValue, "float", float);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BufferValue);


/***/ }),

/***/ "../src/decryption/decoders.ts":
/*!*************************************!*\
  !*** ../src/decryption/decoders.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decryptModulo": () => (/* reexport safe */ _decrypt_modulo__WEBPACK_IMPORTED_MODULE_1__.decryptModulo),
/* harmony export */   "rsa": () => (/* binding */ DecodersRSA)
/* harmony export */ });
/* harmony import */ var _decrypt_rsa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./decrypt-rsa */ "../src/decryption/decrypt-rsa.ts");
/* harmony import */ var _decrypt_modulo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./decrypt-modulo */ "../src/decryption/decrypt-modulo.ts");

const encDec = ["75b4d6de5c016544068a1acf125869f43d2e09fc55b8b1e289556daf9b8757635593446288b3653da1ce91c87bb1a5c18f16323495c55d7d72c0890a83f69bfd1fd9434eb1c02f3e4679edfa43309319070129c267c85604d87bb65bae205de3707af1d2108881abb567c3b3d069ae67c3a4c6a3aa93d26413d4c66094ae2039", 0x1d];
const DecodersRSA = Object.freeze({
  decryptEncdec: _decrypt_rsa__WEBPACK_IMPORTED_MODULE_0__.decryptRSA.bind(undefined, ...encDec)
});



/***/ }),

/***/ "../src/decryption/decrypt-modulo.ts":
/*!*******************************************!*\
  !*** ../src/decryption/decrypt-modulo.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decryptModulo": () => (/* binding */ decryptModulo),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function decryptModulo(array, cryptKey) {
  for (let i = 0, len = array.length; i < len; i++) array[i] ^= cryptKey;
  return array.buffer;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (decryptModulo);


/***/ }),

/***/ "../src/decryption/decrypt-rsa.ts":
/*!****************************************!*\
  !*** ../src/decryption/decrypt-rsa.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decryptRSA": () => (/* binding */ decryptRSA),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pako */ "../node_modules/pako/dist/pako.esm.mjs");


const BLOCK_SIZE = 128;
class RSADecoder {
  constructor(gmp, modulus, exponent, buffer) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "gmp", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "buffer", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "encodedBuffer", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "startPosition", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "position", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "readOffset", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "size", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "rop", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "mod", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "base", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exp", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "archiveSize", 0);
    this.gmp = gmp;
    this.encodedBuffer = buffer;
    const rop = gmp.binding.mpq_t();
    gmp.binding.mpq_init(rop);
    const mod = gmp.binding.mpz_t();
    const ptrStrModulus = gmp.binding.malloc_cstr(modulus);
    gmp.binding.mpz_init_set_str(mod, ptrStrModulus, 16);
    gmp.binding.free(ptrStrModulus);
    const base = gmp.binding.mpz_t();
    this.rop = rop;
    this.exp = exponent;
    this.mod = mod;
    this.base = base;
    this.ensureFilled();
    this.archiveSize = new DataView(this.buffer.buffer, this.startPosition).getUint32(0, true);
    this.position = this.position + 4;
  }
  cleanup() {
    this.gmp.binding.free(this.rop);
    this.gmp.binding.free(this.mod);
    this.gmp.binding.free(this.base);
  }
  *read() {
    while (this.ensureFilled()) {
      const val = new Uint8Array(this.size - this.position);
      for (let i = this.position, j = 0; i < this.size; i++, j++) {
        val[j] = this.buffer[this.startPosition + this.position++] & 0xFF;
      }
      yield val;
    }
  }
  ensureFilled() {
    if (this.position !== this.size) return true;
    const {
      gmp,
      rop,
      base,
      mod,
      exp
    } = this;
    if (this.readOffset + BLOCK_SIZE >= this.encodedBuffer.length) return false; // padding

    const buffer = this.encodedBuffer.slice(this.readOffset, this.readOffset + BLOCK_SIZE);
    const uint8arr = new Uint8Array(buffer);
    const byteString = [...uint8arr].map(x => ("0" + x.toString(16)).slice(-2)).join("");
    const gmpStrBase = gmp.binding.malloc_cstr(byteString);
    gmp.binding.mpz_init_set_str(base, gmpStrBase, 16);
    gmp.binding.mpz_powm_ui(rop, base, exp, mod);
    gmp.binding.free(gmpStrBase);
    const ropString = (new Array(byteString.length).fill("0").join("") + gmp.binding.mpz_to_string(rop, 16)).slice(-byteString.length);
    this.buffer = new Uint8Array(ropString.match(/.{2}/g).map(x => parseInt(x, 16)));
    this.size = this.buffer[3] & 0xff;
    console.assert(this.size >= 0 && this.size <= BLOCK_SIZE - 4, "Invalid block size.");
    this.startPosition = BLOCK_SIZE - this.size - (BLOCK_SIZE - 4 - this.size) % 4;
    this.position = 0;
    this.readOffset = this.readOffset + this.startPosition + this.size;
    return true;
  }
  decode() {
    const inflator = new pako__WEBPACK_IMPORTED_MODULE_1__.Inflate({
      raw: false
    });
    for (let byte of this.read()) inflator.push(byte);
    const result = inflator.result;
    console.assert(result.byteLength === this.archiveSize, "Archive is damaged.");
    return result.buffer;
  }
}
function decryptRSA(modulus, exponent, gmp, buffer) {
  const rsa = new RSADecoder(gmp, modulus, exponent, buffer);
  const decoded = rsa.decode();
  rsa.cleanup();
  return decoded;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (decryptRSA);


/***/ }),

/***/ "../src/supported-extensions.js":
/*!**************************************!*\
  !*** ../src/supported-extensions.js ***!
  \**************************************/
/***/ ((module) => {

/**
 * @type {SupportedExtensions_T[]}
 */
const SUPPORTED_EXTENSIONS = ["UNR", "UTX", "USX", "UAX", "U", "UKX", "USK", "U"];
module.exports = {
  SUPPORTED_EXTENSIONS
}; // this is used in some webpack configurations, so just save it plain javascript

/***/ }),

/***/ "../src/unreal/un-array.ts":
/*!*********************************!*\
  !*** ../src/unreal/un-array.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FArray": () => (/* binding */ FArray),
/* harmony export */   "FIndexArray": () => (/* binding */ FIndexArray),
/* harmony export */   "FNameArray": () => (/* binding */ FNameArray),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _un_export__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-export */ "../src/unreal/un-export.ts");
/* harmony import */ var _un_number__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./un-number */ "../src/unreal/un-number.ts");




class FArray extends Array {
  getElemCount() {
    return this.length;
  }
  getElem(idx) {
    return this[idx];
  }
  constructor(constr) {
    super();
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "Constructor", void 0);
    this.Constructor = constr;
  }
  map(fnMap) {
    return [...this].map(fnMap);
  }
  load(pkg, tag) {
    const hasTag = tag !== null && tag !== undefined;
    const beginIndex = hasTag ? pkg.tell() : null;
    const count = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32)).value;
    const headerOffset = hasTag ? pkg.tell() - beginIndex : null;
    const dataSize = hasTag ? tag.dataSize - headerOffset : null;
    this.length = count;
    if (count === 0) return this;
    const elementSize = hasTag ? dataSize / this.length : null;
    for (let i = 0, len = this.length; i < len; i++) {
      const exp = hasTag ? function () {
        const exp = new _un_export__WEBPACK_IMPORTED_MODULE_2__["default"]();
        exp.size = elementSize;
        exp.objectName = `${tag.name}[${i + 1}/${count}]`;
        exp.offset = pkg.tell();
        return exp;
      }() : null;
      this[i] = new this.Constructor(elementSize).load(pkg, exp);
    }
    if (hasTag) console.assert(pkg.tell() - beginIndex - tag.dataSize === 0);
    return this;
  }
  clone(other) {
    if (!other) return this;
    this.Constructor = other.Constructor;
    for (const v of other) this.push(v);
    return this;
  }
}
class FIndexArray extends FArray {
  constructor() {
    super(_un_number__WEBPACK_IMPORTED_MODULE_3__["default"].forType(_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32));
  }
}
class FNameArray extends Array {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "indexArray", new FIndexArray());
  }
  load(pkg, tag) {
    this.indexArray.load(pkg, tag);
    let i = 0;
    for (const index of this.indexArray) this[i++] = pkg.nameTable[index.value].name;
    return this;
  }
  loadSelf() {
    return this;
  }
  clone(other) {
    if (!other) return this;
    this.indexArray = other.indexArray;
    for (const v of other) this.push(v);
    return this;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FArray);


/***/ }),

/***/ "../src/unreal/un-class.ts":
/*!*********************************!*\
  !*** ../src/unreal/un-class.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EClassFlags_T": () => (/* binding */ EClassFlags_T),
/* harmony export */   "UClass": () => (/* binding */ UClass),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _un_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./un-state */ "../src/unreal/un-state.ts");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _utils_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/flags */ "../src/utils/flags.ts");
/* harmony import */ var _un_array__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./un-array */ "../src/unreal/un-array.ts");
/* harmony import */ var _un_object__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./un-object */ "../src/unreal/un-object.ts");
/* harmony import */ var _un_object_flags__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./un-object-flags */ "../src/unreal/un-object-flags.ts");
/* harmony import */ var _un_property_un_properties__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./un-property/un-properties */ "../src/unreal/un-property/un-properties.ts");
/* harmony import */ var _un_enum__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./un-enum */ "../src/unreal/un-enum.ts");









class FDependencies {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "classId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "scriptTextCRC", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "depth", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "class", void 0);
  }
  load(pkg) {
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].compat32);
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].uint32);
    const int32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].int32);
    this.classId = pkg.read(compat32).value;
    this.depth = pkg.read(uint32).value;
    this.scriptTextCRC = pkg.read(int32).value;
    return this;
  }
}
class UClass extends _un_state__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "flags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "classFlags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "classGuid", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "dependencies", new _un_array__WEBPACK_IMPORTED_MODULE_4__.FArray(FDependencies));
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "pkgImportIds", new _un_array__WEBPACK_IMPORTED_MODULE_4__.FIndexArray());
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "pkgImportIds2", new _un_array__WEBPACK_IMPORTED_MODULE_4__.FIndexArray());
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "pkgImports", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "pkgImports2", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "classWithinId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "classConfigName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "baseStruct", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "second", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isClass", true);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "defaultsLoading", new Array());
  }
  static getConstructorName() {
    return "Class";
  }
  loadDefaults() {
    const dependencyTree = this.collectDependencies();
    for (const base of dependencyTree.reverse()) {
      while (base.defaultsLoading.length > 0) {
        const fn = base.defaultsLoading.shift();
        fn();
      }
    }
    return this;
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    this.readHead = pkg.tell();
    const verArchive = pkg.header.getArchiveFileVersion();
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].uint32);
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].compat32);
    if (verArchive <= 61) {
      debugger;
    }
    this.flags = pkg.read(uint32).value;
    this.classFlags = (0,_utils_flags__WEBPACK_IMPORTED_MODULE_3__.flagBitsToDict)(this.flags, EClassFlags_T);
    this.classGuid = pkg.read(_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].allocBytes(16)).value;
    this.dependencies.load(pkg);
    this.pkgImportIds.load(pkg);
    if (verArchive >= 0x3e) {
      this.classWithinId = pkg.read(compat32).value;
      const nameId = pkg.read(compat32).value;
      this.classConfigName = pkg.nameTable[nameId].name;
    }
    if (verArchive >= 0x63) this.pkgImportIds2.load(pkg);
    this.readHead = pkg.tell();
    this.readNamedProps(pkg);
  }
  buildClass(pkg) {
    var _class;
    if (this.kls) return this.kls;
    this.loadSelf().loadDefaults();
    const dependencyTree = this.collectDependencies();
    if (!this.isReady) debugger;
    const clsNamedProperties = {};
    const clsEnumProperties = {};
    const inheretenceChain = new Array();
    let lastNative = null;
    for (const base of dependencyTree.reverse()) {
      inheretenceChain.push(base.loadDefaults().friendlyName);
      if (!base.exp || base.exp.anyFlags(_un_object_flags__WEBPACK_IMPORTED_MODULE_6__["default"].Native)) lastNative = base;
      if (base.constructor !== UClass) debugger;
      const {
        childPropFields,
        defaultProperties
      } = base;
      for (const field of childPropFields.values()) {
        if (!(field instanceof _un_property_un_properties__WEBPACK_IMPORTED_MODULE_7__.UProperty)) continue;
        const propertyName = field.propertyName;

        // if (field.propertyName.includes("Clamp"))
        //     debugger;

        // if (field.propertyName === "Style" && (this as any)[propertyName] === 8)
        //     debugger;

        if (field instanceof UArrayProperty) {
          if (field.arrayDimensions !== 1) debugger;
          if (defaultProperties.has(propertyName)) debugger;
          clsNamedProperties[propertyName] = field.dtype.clone(this[propertyName]);
          continue;
        }
        if (field instanceof UByteProperty && field.value) {
          if (!(field.value instanceof _un_enum__WEBPACK_IMPORTED_MODULE_8__["default"])) debugger;
          if (field.arrayDimensions !== 1) debugger;
          clsEnumProperties[propertyName] = {
            defaultValue: this[propertyName],
            names: field.value.names
          };
          continue;
        }
        clsNamedProperties[propertyName] = field.arrayDimensions > 1 ? propertyName in this ? this[propertyName] : new Array(field.arrayDimensions) : this[propertyName];
      }
      for (const propertyName of Object.keys(defaultProperties)) clsNamedProperties[propertyName] = this[propertyName];
    }
    const friendlyName = this.friendlyName;
    const hostClass = this;
    const Constructor = lastNative ? pkg.getConstructor(lastNative.friendlyName) : _un_object__WEBPACK_IMPORTED_MODULE_5__["default"];
    const cls = {
      [this.friendlyName]: (_class = class extends Constructor {
        static getConstructorName() {
          return friendlyName;
        }
        constructor() {
          super();
          (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "newProps", {});
          if (friendlyName === "Actor") debugger;
          const oldProps = this.getPropertyMap();
          const newProps = this.newProps;
          const missingProps = [];
          for (const [name, value] of Object.entries(clsNamedProperties)) {
            const varname = name in oldProps ? oldProps[name] : name;
            if (!(name in oldProps)) {
              newProps[varname] = varname;
              missingProps.push(varname);
            }
            if (value !== undefined || !(varname in this)) this[varname] = value;
          }
          for (const [name, {
            defaultValue,
            names
          }] of Object.entries(clsEnumProperties)) {
            const varname = name in oldProps ? oldProps[name] : name;
            if (!(name in oldProps)) {
              newProps[varname] = varname;
              missingProps.push(varname);
            }
            const oldValue = varname in this && this[varname] !== undefined ? this[varname] : defaultValue;
            const value = new _un_object__WEBPACK_IMPORTED_MODULE_5__.EnumeratedValue(oldValue, names);
            if (varname in this) delete this[varname];
            this[varname] = value;

            // Object.defineProperty(this, varname, {
            //     value,
            //     writable: false
            // });
          }

          // debugger;

          if (missingProps.length > 0) console.warn(`Native type '${Constructor.name}' is missing property '${missingProps.join(", ")}'`);
        }
        doLoad(pkg, exp) {
          // if (this.objectName.includes("StaticMeshActor140") || this.objectName.includes("StaticMeshActor141"))
          //     debugger;

          super.doLoad(pkg, exp);

          // if (this.objectName.includes("StaticMeshActor140") || this.objectName.includes("StaticMeshActor141"))
          //     debugger;
        }

        getPropertyMap() {
          return {
            ...super.getPropertyMap(),
            ...this.newProps
          };
        }
        toString() {
          return `[D]${friendlyName}=(name=${this.objectName})`;
        }
      }, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "isDynamicClass", true), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "friendlyName", friendlyName), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "hostClass", hostClass), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "nativeClass", lastNative), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "inheretenceChain", Object.freeze(inheretenceChain)), _class)
    }[this.friendlyName];
    this.kls = cls;
    return this.kls;
  }
}
var EClassFlags_T;
(function (EClassFlags_T) {
  EClassFlags_T[EClassFlags_T["CLASS_Abstract"] = 1] = "CLASS_Abstract";
  EClassFlags_T[EClassFlags_T["CLASS_Compiled"] = 2] = "CLASS_Compiled";
  EClassFlags_T[EClassFlags_T["CLASS_Config"] = 4] = "CLASS_Config";
  EClassFlags_T[EClassFlags_T["CLASS_Transient"] = 8] = "CLASS_Transient";
  EClassFlags_T[EClassFlags_T["CLASS_Parsed"] = 16] = "CLASS_Parsed";
  EClassFlags_T[EClassFlags_T["CLASS_Localized"] = 32] = "CLASS_Localized";
  EClassFlags_T[EClassFlags_T["CLASS_SafeReplace"] = 64] = "CLASS_SafeReplace";
  EClassFlags_T[EClassFlags_T["CLASS_RuntimeStatic"] = 128] = "CLASS_RuntimeStatic";
  EClassFlags_T[EClassFlags_T["CLASS_NoExport"] = 256] = "CLASS_NoExport";
  EClassFlags_T[EClassFlags_T["CLASS_NoUserCreate"] = 512] = "CLASS_NoUserCreate";
  EClassFlags_T[EClassFlags_T["CLASS_PerObjectConfig"] = 1024] = "CLASS_PerObjectConfig";
  EClassFlags_T[EClassFlags_T["CLASS_NativeReplication"] = 2048] = "CLASS_NativeReplication";
  EClassFlags_T[EClassFlags_T["CLASS_Inherit"] = 1260] = "CLASS_Inherit";
  EClassFlags_T[EClassFlags_T["CLASS_RecompilerClear"] = 3565] = "CLASS_RecompilerClear";
})(EClassFlags_T || (EClassFlags_T = {}));
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UClass);


/***/ }),

/***/ "../src/unreal/un-const.ts":
/*!*********************************!*\
  !*** ../src/unreal/un-const.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UConst": () => (/* binding */ UConst),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _un_field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./un-field */ "../src/unreal/un-field.ts");
/* harmony import */ var _un_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-string */ "../src/unreal/un-string.ts");



class UConst extends _un_field__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "value", void 0);
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    this.value = new _un_string__WEBPACK_IMPORTED_MODULE_2__["default"]().load(pkg).value;
    this.readHead = pkg.tell();
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UConst);


/***/ }),

/***/ "../src/unreal/un-encoded-file.ts":
/*!****************************************!*\
  !*** ../src/unreal/un-encoded-file.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UEncodedFile": () => (/* binding */ UEncodedFile),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _decryption_decoders__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../decryption/decoders */ "../src/decryption/decoders.ts");
/* harmony import */ var gmp_wasm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gmp-wasm */ "../node_modules/gmp-wasm/dist/index.esm.js");




let gmp = null;
;
class UEncodedFile {
  constructor(path) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "path", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isReadable", false);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "handle", null);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "promiseDecoding", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "buffer", null);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "offset", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "contentOffset", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "version", void 0);
    this.path = path;
  }
  asReadable() {
    // if (this.isReadable)
    //     throw new Error("Already readable!");

    const readable = new class Readable {}();
    Object.setPrototypeOf(readable, this);
    Object.assign(readable, this, {
      isReadable: true,
      handle: this
    });
    return readable;
  }
  ensureReadable() {
    if (!this.isReadable) throw new Error("Stream is not readable!");
  }
  seek(offset, origin = "current") {
    this.ensureReadable();
    switch (origin) {
      case "current":
        this.offset = this.offset + offset;
        break;
      case "set":
        this.offset = offset + this.contentOffset;
        break;
      default:
        throw new Error(`Seek type not supported: ${origin}`);
    }
  }
  readPrimitive(byteOffset, byteLength) {
    return new DataView(this.buffer, byteOffset + this.contentOffset, byteLength);
  }
  read(target) {
    this.ensureReadable();
    if (typeof target === "number") {
      const _target = _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].allocBytes(target);
      this.offset += _target.readValue(this.buffer, this.offset);
      return _target;
    } else if (target instanceof _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.offset += target.readValue(this.buffer, this.offset);
      return target;
    } else {
      throw new Error("Invalid argument");
    }
  }

  // public read(target: BufferValue<T> | number) {
  //     this.ensureReadable();

  //     if (typeof (target) === "number") {
  //         const _target = BufferValue.allocBytes(target);

  //         this.offset += _target.readValue(this.buffer, this.offset);

  //         return _target;
  //     } else {
  //         this.offset += target.readValue(this.buffer, this.offset);

  //         return target;
  //     }
  // }

  tell() {
    return this.offset - this.contentOffset;
  }
  dump(lineCount = 1, restore = true, printHeaders = true) {
    this.ensureReadable();
    let oldHeader = this.offset;
    let constructedString = "";
    let divisor = 0XF,
      lineCountHex = 1;
    do {
      if (lineCount / divisor < 1) break;
      divisor = divisor * 0X10 + 0XF; // shift divisor
      lineCountHex++;
    } while (true);
    const offsetHeader = printHeaders ? new Array(5 + lineCountHex).fill("-").join("") : null;
    if (printHeaders) {
      console.log(`${offsetHeader}--------------------------------------------------------`);
      console.log(`${offsetHeader}------------------- Dumping lines ----------------------`);
      console.log(`${offsetHeader}--------------------------------------------------------`);
    }
    for (let i = 0; i < lineCount; i++) {
      const bytes = Math.min(this.buffer.byteLength - this.offset, 8);
      const groups = new Array(bytes).fill('.').map(() => this.read(2));
      const string1 = groups.map(g => g.hex.slice(2)).join(" ");
      const string2 = groups.map(g => g.string).join("");
      constructedString += string2;
      constructedString = constructedString.slice(-100);
      if (lineCount <= 256) {
        if (true) {
          const extraArgs = [];
          let finalString = string1;
          const bits = i.toString(16).toUpperCase();
          const head = new Array(lineCountHex - bits.length).fill("0").join("");
          console.log([`(0x${head}${bits})`, finalString, string2].join(" "), ...extraArgs);
        } else {}
      }
    }
    if (printHeaders) console.log(`${offsetHeader}--------------------------------------------------------`);
    if (restore) this.offset = oldHeader;
  }
  async decode() {
    if (this.buffer) return this;
    if (!this.promiseDecoding) await this._doDecode();else await this.promiseDecoding;
    return this;
  }
  _doDecode() {
    this.ensureReadable();
    if (this.promiseDecoding) return this.promiseDecoding;
    console.log("Started loading package:", this.path);
    return this.handle.promiseDecoding = this.promiseDecoding = new Promise(async resolve => {
      this.buffer = await this.readArrayBuffer();
      const signature = this.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32));
      const HEADER_SIZE = 28;
      const HEADER_VER_OFFSET = 22;
      if (signature.value === 0x0069004C) {
        this.seek(HEADER_VER_OFFSET, "set");
        const version = new TextDecoder("utf-16").decode(this.read(_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].allocBytes(6)).value);
        this.seek(HEADER_SIZE, "set");
        let tStart;
        this.version = version;
        if (version.startsWith("1")) {
          const cryptKey = 0xC1 ^ this.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint8)).value;
          this.contentOffset = HEADER_SIZE;
          this.seek(0, "set");
          tStart = performance.now();
          this.buffer = _decryption_decoders__WEBPACK_IMPORTED_MODULE_2__.decryptModulo(new Uint8Array(this.buffer, HEADER_SIZE), cryptKey);
          this.read(signature);
        } else if (version.startsWith("4")) {
          if (gmp === null) {
            gmp = await gmp_wasm__WEBPACK_IMPORTED_MODULE_3__.init();
          }
          this.buffer = _decryption_decoders__WEBPACK_IMPORTED_MODULE_2__.rsa.decryptEncdec(gmp, new Uint8Array(this.buffer, HEADER_SIZE));
          this.contentOffset = 0;
          this.seek(0, "set");
        } else {
          throw new Error(`Unsupported file version: ${version}`);
        }
        console.log(`'${this.path}' loaded in ${performance.now() - tStart} ms`);
      }
      resolve(signature);
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UEncodedFile);


/***/ }),

/***/ "../src/unreal/un-enum.ts":
/*!********************************!*\
  !*** ../src/unreal/un-enum.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UEnum": () => (/* binding */ UEnum),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _un_field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./un-field */ "../src/unreal/un-field.ts");
/* harmony import */ var _un_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-array */ "../src/unreal/un-array.ts");



class UEnum extends _un_field__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "names", new _un_array__WEBPACK_IMPORTED_MODULE_2__.FNameArray());
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    this.names.load(pkg);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UEnum);


/***/ }),

/***/ "../src/unreal/un-export.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-export.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UExport": () => (/* binding */ UExport),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _utils_flags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/flags */ "../src/utils/flags.ts");
/* harmony import */ var _un_object_flags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-object-flags */ "../src/unreal/un-object-flags.ts");



class UExport {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "index", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idClass", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idSuper", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idPackage", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idObjectName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "objectName", "None");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "_flags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "objectFlags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "size", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "offset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "object", null);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isFake", false);
  }
  allFlags(flags) {
    return _utils_flags__WEBPACK_IMPORTED_MODULE_1__.allFlags(this.flags, flags);
  }
  anyFlags(flags) {
    return _utils_flags__WEBPACK_IMPORTED_MODULE_1__.anyFlags(this.flags, flags);
  }
  get flags() {
    return this._flags;
  }
  set flags(flags) {
    this._flags = flags;
    this.objectFlags = Object.freeze(_utils_flags__WEBPACK_IMPORTED_MODULE_1__.flagBitsToDict(flags, _un_object_flags__WEBPACK_IMPORTED_MODULE_2__["default"]));
  }
  toString() {
    return `${this.isFake ? '!' : ''}Export(id=${this.index + 1}, name=${this.objectName}, flags=[${Object.entries(this.objectFlags).filter(([, v]) => v).map(([k]) => k).join(",")}])`;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UExport);


/***/ }),

/***/ "../src/unreal/un-field.ts":
/*!*********************************!*\
  !*** ../src/unreal/un-field.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UField": () => (/* binding */ UField),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _un_object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-object */ "../src/unreal/un-object.ts");



class UField extends _un_object__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "superFieldId", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nextFieldId", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "superField", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nextField", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isField", true);
  }
  static getConstructorName() {
    return "Field";
  }
  doLoad(pkg, exp) {
    if (this.constructor.name !== "UClass") super.doLoad(pkg, exp);
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
    this.superFieldId = pkg.read(compat32).value;
    this.nextFieldId = pkg.read(compat32).value;
    this.loadSuperfields();
  }
  collectDependencies() {
    const dependencyTree = [];
    let base = this;
    do {
      dependencyTree.push(base);
      base = base.superField;
    } while (base);
    return dependencyTree;
  }
  loadSuperfields() {
    let lastBase = this.loadSelf();
    do {
      var _lastBase;
      if (this.superFieldId !== 0) this.superField = this.pkg.fetchObject(this.superFieldId);
      if (this.nextFieldId !== 0) this.nextField = this.pkg.fetchObject(this.nextFieldId);
      lastBase = (_lastBase = lastBase) === null || _lastBase === void 0 ? void 0 : _lastBase.loadSelf().superField;
    } while (lastBase);
    return this;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UField);


/***/ }),

/***/ "../src/unreal/un-function.ts":
/*!************************************!*\
  !*** ../src/unreal/un-function.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UFunction": () => (/* binding */ UFunction),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _un_struct__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-struct */ "../src/unreal/un-struct.ts");



class UFunction extends _un_struct__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "paramSize", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nativeFuncIndex", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "numParams", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "operatorPrecendence", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "returnValueOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "funcFlags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "replicationOffset", void 0);
  }
  static getConstructorName() {
    return "Function";
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    this.readHead = pkg.tell();
    const verArchive = pkg.header.getArchiveFileVersion();
    const uint8 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint8);
    const uint16 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint16);
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32);
    if (verArchive <= 0x40) this.paramSize = pkg.read(uint16).value;
    this.nativeFuncIndex = pkg.read(uint16).value;
    if (verArchive <= 0x40) this.numParams = pkg.read(uint8).value;
    this.operatorPrecendence = pkg.read(uint8).value;
    if (verArchive <= 0x40) this.returnValueOffset = pkg.read(uint16).value;
    this.funcFlags = pkg.read(uint32).value;
    if (this.allFlags(this.funcFlags, FunctionFlags_T.Net)) this.replicationOffset = pkg.read(uint16).value;
    this.readHead = pkg.tell();

    // debugger;
  }

  allFlags(value, flags) {
    return (value & flags) === flags;
  }
  anyFlags(value, flags) {
    return (value & flags) !== 0;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UFunction);

var FunctionFlags_T;
(function (FunctionFlags_T) {
  FunctionFlags_T[FunctionFlags_T["Final"] = 1] = "Final";
  FunctionFlags_T[FunctionFlags_T["Defined"] = 2] = "Defined";
  FunctionFlags_T[FunctionFlags_T["Iterator"] = 4] = "Iterator";
  FunctionFlags_T[FunctionFlags_T["Latent"] = 8] = "Latent";
  FunctionFlags_T[FunctionFlags_T["PreOperator"] = 16] = "PreOperator";
  FunctionFlags_T[FunctionFlags_T["Singular"] = 32] = "Singular";
  FunctionFlags_T[FunctionFlags_T["Net"] = 64] = "Net";
  FunctionFlags_T[FunctionFlags_T["NetReliable"] = 128] = "NetReliable";
  FunctionFlags_T[FunctionFlags_T["Simulated"] = 256] = "Simulated";
  FunctionFlags_T[FunctionFlags_T["Exec"] = 512] = "Exec";
  FunctionFlags_T[FunctionFlags_T["Native"] = 1024] = "Native";
  FunctionFlags_T[FunctionFlags_T["Event"] = 2048] = "Event";
  FunctionFlags_T[FunctionFlags_T["Operator"] = 4096] = "Operator";
  FunctionFlags_T[FunctionFlags_T["Static"] = 8192] = "Static";
  FunctionFlags_T[FunctionFlags_T["NoExport"] = 16384] = "NoExport";
  FunctionFlags_T[FunctionFlags_T["Const"] = 32768] = "Const";
  FunctionFlags_T[FunctionFlags_T["Invariant"] = 65536] = "Invariant";
})(FunctionFlags_T || (FunctionFlags_T = {}));
;

/***/ }),

/***/ "../src/unreal/un-generation.ts":
/*!**************************************!*\
  !*** ../src/unreal/un-generation.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UGeneration": () => (/* binding */ UGeneration),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");

class UGeneration {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exportCount", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nameCount", void 0);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UGeneration);


/***/ }),

/***/ "../src/unreal/un-header.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-header.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UHeader": () => (/* binding */ UHeader),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");


class UHeader {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "version", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "packageFlags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nameCount", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nameOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exportCount", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exportOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "importCount", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "importOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "heritageCount", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "heritageOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "generations", []);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "guid", new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].guid));
  }
  getArchiveFileVersion() {
    return this.version & 0xffff;
  }
  getLicenseeVersion() {
    return this.version >> 16;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UHeader);


/***/ }),

/***/ "../src/unreal/un-import.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-import.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UImport": () => (/* binding */ UImport),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");

class UImport {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "index", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idPackage", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idClassName", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "className", "None");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idObjectName", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "objectName", "None");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "idClassPackage", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "classPackage", "None");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isFake", false);
  }
  toString() {
    return `${this.isFake ? '!' : ''}Import(id=${-(this.index + 1)}, name=${this.objectName})`;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UImport);


/***/ }),

/***/ "../src/unreal/un-name.ts":
/*!********************************!*\
  !*** ../src/unreal/un-name.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UName": () => (/* binding */ UName),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");

class UName {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "name", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "flags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isFake", false);
  }
  toString() {
    return `${this.isFake ? '!' : ''}Name(name=${this.name}, flags=${this.flags})`;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UName);


/***/ }),

/***/ "../src/unreal/un-number.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-number.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FNumber": () => (/* binding */ FNumber),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");


class FNumber {
  constructor(dtype) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "type", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "value", void 0);
    this.type = dtype;
  }
  load(pkg) {
    this.value = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](this.type)).value;
    return this;
  }
  static forType(dtype) {
    class FNumberExt extends FNumber {
      constructor() {
        super(dtype);
      }
    }
    return FNumberExt;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FNumber);


/***/ }),

/***/ "../src/unreal/un-object-flags.ts":
/*!****************************************!*\
  !*** ../src/unreal/un-object-flags.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObjectFlags_T": () => (/* binding */ ObjectFlags_T),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ObjectFlags_T;
(function (ObjectFlags_T) {
  ObjectFlags_T[ObjectFlags_T["NoFlags"] = 0] = "NoFlags";
  ObjectFlags_T[ObjectFlags_T["Transactional"] = 1] = "Transactional";
  ObjectFlags_T[ObjectFlags_T["Unreachable"] = 2] = "Unreachable";
  ObjectFlags_T[ObjectFlags_T["Public"] = 4] = "Public";
  ObjectFlags_T[ObjectFlags_T["TagImp"] = 8] = "TagImp";
  ObjectFlags_T[ObjectFlags_T["TagExp"] = 16] = "TagExp";
  ObjectFlags_T[ObjectFlags_T["SourceModified"] = 32] = "SourceModified";
  ObjectFlags_T[ObjectFlags_T["TagGarbage"] = 64] = "TagGarbage";
  ObjectFlags_T[ObjectFlags_T["NeedLoad"] = 512] = "NeedLoad";
  ObjectFlags_T[ObjectFlags_T["HighlightedName"] = 1024] = "HighlightedName";
  ObjectFlags_T[ObjectFlags_T["EliminateObject"] = 1024] = "EliminateObject";
  ObjectFlags_T[ObjectFlags_T["InSingularFunc"] = 2048] = "InSingularFunc";
  ObjectFlags_T[ObjectFlags_T["RemappedName"] = 2048] = "RemappedName";
  ObjectFlags_T[ObjectFlags_T["Suppress"] = 4096] = "Suppress";
  ObjectFlags_T[ObjectFlags_T["StateChanged"] = 4096] = "StateChanged";
  ObjectFlags_T[ObjectFlags_T["InEndState"] = 8192] = "InEndState";
  ObjectFlags_T[ObjectFlags_T["Transient"] = 16384] = "Transient";
  ObjectFlags_T[ObjectFlags_T["Preloading"] = 32768] = "Preloading";
  ObjectFlags_T[ObjectFlags_T["LoadForClient"] = 65536] = "LoadForClient";
  ObjectFlags_T[ObjectFlags_T["LoadForServer"] = 131072] = "LoadForServer";
  ObjectFlags_T[ObjectFlags_T["LoadForEdit"] = 262144] = "LoadForEdit";
  ObjectFlags_T[ObjectFlags_T["Standalone"] = 524288] = "Standalone";
  ObjectFlags_T[ObjectFlags_T["NotForClient"] = 1048576] = "NotForClient";
  ObjectFlags_T[ObjectFlags_T["NotForServer"] = 2097152] = "NotForServer";
  ObjectFlags_T[ObjectFlags_T["NotForEdit"] = 4194304] = "NotForEdit";
  ObjectFlags_T[ObjectFlags_T["Destroyed"] = 8388608] = "Destroyed";
  ObjectFlags_T[ObjectFlags_T["NeedPostLoad"] = 16777216] = "NeedPostLoad";
  ObjectFlags_T[ObjectFlags_T["HasStack"] = 33554432] = "HasStack";
  ObjectFlags_T[ObjectFlags_T["Native"] = 67108864] = "Native";
  ObjectFlags_T[ObjectFlags_T["Marked"] = 134217728] = "Marked";
  ObjectFlags_T[ObjectFlags_T["ErrorShutdown"] = 268435456] = "ErrorShutdown";
  ObjectFlags_T[ObjectFlags_T["DebugPostLoad"] = 536870912] = "DebugPostLoad";
  ObjectFlags_T[ObjectFlags_T["DebugSerialize"] = 1073741824] = "DebugSerialize";
  ObjectFlags_T[ObjectFlags_T["DebugDestroy"] = 2147483648] = "DebugDestroy";
  ObjectFlags_T[ObjectFlags_T["ContextFlags"] = 7340032] = "ContextFlags";
  ObjectFlags_T[ObjectFlags_T["LoadContextFlags"] = 458752] = "LoadContextFlags";
  ObjectFlags_T[ObjectFlags_T["Load"] = 108986405] = "Load";
  ObjectFlags_T[ObjectFlags_T["Keep"] = 201326592] = "Keep";
  ObjectFlags_T[ObjectFlags_T["ScriptMask"] = 7356421] = "ScriptMask";
})(ObjectFlags_T || (ObjectFlags_T = {}));
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ObjectFlags_T);


/***/ }),

/***/ "../src/unreal/un-object.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-object.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EnumeratedValue": () => (/* binding */ EnumeratedValue),
/* harmony export */   "UObject": () => (/* binding */ UObject),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _un_export__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-export */ "../src/unreal/un-export.ts");
/* harmony import */ var _un_object_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./un-object-flags */ "../src/unreal/un-object-flags.ts");
/* harmony import */ var _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./un-property/un-property-tag */ "../src/unreal/un-property/un-property-tag.ts");





class UObject {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isObject", true);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "skipRemaining", false);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "objectName", "Exp_None");
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exportIndex", null);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exp", null);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "readHeadOffset", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "readHead", NaN);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "readStart", NaN);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "readTail", NaN);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isLoading", false);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isReady", false);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "pkg", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "propertyList", new Array());
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "propertyDict", new Map());
  }
  setReadPointers(exp) {
    this.readStart = this.readHead = exp.offset + this.readHeadOffset;
    this.readTail = this.readHead + exp.size;
  }
  get byteCount() {
    return this.readTail - this.readStart;
  }
  get bytesUnread() {
    return this.readTail - this.readHead;
  }
  get byteOffset() {
    return this.readHead - this.readStart;
  }
  static getConstructorName() {
    debugger;
    throw new Error("Must be implemented by inheriting class because JS does not support inheritence chain.");
  }
  static get inheritenceChain() {
    if (this === UObject) return ["Object"];
    let base = this;
    const dependencyChain = new Array();
    do {
      dependencyChain.push(base.getConstructorName());
      base = base.__proto__;
    } while (base !== UObject);
    dependencyChain.push("Object");
    return dependencyChain.reverse();
  }
  readNamedProps(pkg) {
    pkg.seek(this.readHead, "set");
    if (this.readHead < this.readTail) {
      do {
        const tag = _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__["default"].from(pkg, this.readHead);
        if (!tag.isValid()) break;
        this.loadProperty(pkg, tag);
        this.readHead = pkg.tell();
      } while (this.readHead < this.readTail);
    }
    this.readHead = pkg.tell();
  }
  getPropertyVarName(tag) {
    return tag.name;
  }
  isValidProperty(varName) {
    return true;
  }
  getPropertyMap() {
    return {};
  }
  setProperty(tag, value) {
    debugger;
    const varName = this.getPropertyVarName(tag);
    const {
      name: propName,
      arrayIndex
    } = tag;
    if (!varName) throw new Error(`Unrecognized property '${propName}' for '${this.constructor.name}' of type '${value === null ? "NULL" : typeof value === "object" ? value.constructor.name : typeof value}'`);
    if (!this.isValidProperty(varName)) throw new Error(`Cannot map property '${propName}' -> ${varName}`);
    if (tag.arrayIndex < 0 || tag.arrayIndex > 0 && tag.arrayIndex >= this.getPropCount(tag.name)) throw new Error(`Something went wrong, expected index '${tag.arrayIndex} (max: '${this.getPropCount(tag.name)}')'.`);
    if (this[varName] instanceof Array) {
      debugger;
      this[varName][arrayIndex] = value;
    } else if (this[varName] instanceof Set) {
      debugger;
      this[varName].add(value);
    } else if (this[varName] instanceof EnumeratedValue) {
      debugger;
      this[varName].value = value;
    } else this.propertyDict.set(varName, value);

    // console.log(`Setting '${this.constructor.name}' property: ${propName}[${arrayIndex}] -> ${typeof (value) === "object" && value !== null ? value.constructor.name : value}`);

    return true;
  }
  loadSelf() {
    if (!this.pkg || !this.pkg) return this;
    return this.load(this.pkg, this.exp);
  }
  readByteProperty(pkg, tag) {
    this.setProperty(tag, pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint8)).value);
  }
  readIntProperty(pkg, tag) {
    this.setProperty(tag, pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int32)).value);
  }
  readFloatProperty(pkg, tag) {
    this.setProperty(tag, pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].float)).value);
  }
  readBoolProperty(pkg, tag) {
    this.setProperty(tag, tag.boolValue);
  }
  readObjectProperty(pkg, tag) {
    this.setProperty(tag, pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32)).value);
  }
  readNameProperty(pkg, tag) {
    this.setProperty(tag, pkg.nameTable[pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32)).value].name);
  }
  readStrProperty(pkg, tag) {
    this.setProperty(tag, pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].char)).value);
  }
  readStringProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  } // Never used?
  readArrayProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  }
  readClassProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  } // Never used?
  readVectorProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  } // Never used?
  readRotatorProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  } // Never used?
  readMapProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  } // Never used?
  readFixedProperty(pkg, tag) {
    debugger;
    throw new Error("Not yet implemented");
  } // Never used?
  readStructProperty(pkg, tag) {
    const core = pkg.loader.getPackage("core", "Script");
    const native = pkg.loader.getPackage("native", "Script");
    const expStruct = core.fetchObjectByType("Struct", tag.structName);
    const StructConstructor = expStruct.buildClass(native);
    const struct = new StructConstructor();
    switch (tag.structName) {
      case "Color":
        debugger;
        break;
      case "Scale":
        debugger;
        break;
      case "Vector":
        return struct.loadNative(pkg);
      case "Rotator":
        debugger;
        break;
    }
    throw new Error("Not yet implemented");
  }
  loadNative(pkg) {
    debugger;
  }
  loadProperty(pkg, tag) {
    const offStart = pkg.tell();
    const offEnd = offStart + tag.dataSize;
    switch (tag.type) {
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_ByteProperty:
        this.readByteProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_IntProperty:
        this.readIntProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_BoolProperty:
        this.readBoolProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_FloatProperty:
        this.readFloatProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_ObjectProperty:
        this.readObjectProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_NameProperty:
        this.readNameProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_StrProperty:
        this.readStrProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_StringProperty:
        this.readStringProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_ArrayProperty:
        this.readArrayProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_ClassProperty:
        this.readClassProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_VectorProperty:
        this.readVectorProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_RotatorProperty:
        this.readRotatorProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_MapProperty:
        this.readMapProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_FixedArrayProperty:
        this.readFixedProperty(pkg, tag);
        break;
      case _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__.UNP_PropertyTypes.UNP_StructProperty:
        this.readStructProperty(pkg, tag);
        break;
      default:
        pkg.seek(tag.dataSize);
        console.warn(`Unknown data type '${tag.type}' for '${tag.name}' skipping ${tag.dataSize} bytes.`);
        break;
    }
    pkg.seek(offEnd, "set");
    if (pkg.tell() < offEnd) console.warn(`Unread '${tag.name}' ${offEnd - pkg.tell()} bytes (${((offEnd - pkg.tell()) / 1024).toFixed(2)} kB) for package '${pkg.path}'`);
  }
  setExport(pkg, exp) {
    this.objectName = `Exp_${exp.objectName}`;
    this.exportIndex = exp.index;
    this.exp = exp;
    this.pkg = pkg.asReadable();
  }
  preLoad(pkg, exp) {
    const flags = exp.flags;
    if (!this.exp) this.setExport(pkg, exp);
    pkg.seek(exp.offset, "set");
    if (flags & _un_object_flags__WEBPACK_IMPORTED_MODULE_3__["default"].HasStack && exp.size > 0) {
      const offset = pkg.tell();
      const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
      const int64 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int64);
      const int32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int32);
      const node = pkg.read(compat32).value;
      /*const stateNode =*/
      pkg.read(compat32).value;
      /*const probeMask =*/
      pkg.read(int64).value;
      /*const latentAction =*/
      pkg.read(int32).value;
      if (node !== 0) {
        /*const offset =*/pkg.read(compat32).value;
      }
      this.readHeadOffset = pkg.tell() - offset;
    }
    this.setReadPointers(exp);
  }
  load(pkg, info) {
    if (info instanceof _un_export__WEBPACK_IMPORTED_MODULE_2__["default"]) return this.loadWithExport(pkg, info);
    if (info instanceof _un_property_un_property_tag__WEBPACK_IMPORTED_MODULE_4__["default"]) return this.loadWithPropertyTag(pkg, info);
    throw new Error("Unsupported overload");
  }
  loadWithPropertyTag(pkg, tag) {
    const exp = new _un_export__WEBPACK_IMPORTED_MODULE_2__["default"]();
    exp.objectName = `${tag.name}[Struct]`;
    exp.offset = pkg.tell();
    exp.size = tag.dataSize;
    exp.isFake = true;
    return this.loadWithExport(pkg, exp);
  }
  loadWithExport(pkg, exp) {
    if (this.isLoading || this.isReady) return this;
    this.isLoading = true;

    // if (exp.objectName === "DefaultTexture")
    //     debugger;

    this.preLoad(pkg, exp);
    if (!isFinite(this.readHead)) debugger;
    if (!isFinite(this.readTail)) debugger;
    if (this.readTail - this.readHead > 0) {
      this.doLoad(pkg, exp);
      this.postLoad(pkg, exp);
    }
    this.isLoading = false;
    this.isReady = true;
    return this;
  }

  // public load(pkg: UPackage, exp?: UExport): this {
  //     if (this.isLoading || this.isReady)
  //         return this;

  //     this.isLoading = true;

  //     // if (exp.objectName === "DefaultTexture")
  //     //     debugger;

  //     this.preLoad(pkg, exp);

  //     if (!isFinite(this.readHead))
  //         debugger;

  //     if (!isFinite(this.readTail))
  //         debugger;

  //     if ((this.readTail - this.readHead) > 0) {
  //         this.doLoad(pkg, exp);
  //         this.postLoad(pkg, exp);
  //     }

  //     this.isLoading = false;
  //     this.isReady = true;

  //     return this;
  // }

  doLoad(pkg, exp) {
    this.readNamedProps(pkg);
  }
  postLoad(pkg, exp) {
    this.readHead = pkg.tell();
    if (this.skipRemaining) this.readHead = this.readTail;
    if (this.bytesUnread > 0 && this.bytesUnread !== this.readHeadOffset && this.careUnread) {
      const constructorName = this.constructor.isDynamicClass ? `${this.constructor.friendlyName}[Dynamic]` : this.constructor.name;
      console.warn(`Unread '${this.objectName}' (${constructorName}) ${this.bytesUnread} bytes (${(this.bytesUnread / 1024).toFixed(2)} kB) in package '${pkg.path}'`);
    }
    if (UObject.CLEANUP_NAMESPACE) {
      Object.values(this.getPropertyMap()).forEach(propName => {
        if (this[propName] === undefined) delete this[propName];
      });
    }
  }
}
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(UObject, "CLEANUP_NAMESPACE", true);
class EnumeratedValue {
  constructor(value, enumerations) {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "value", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "enumerations", void 0);
    this.value = value;
    this.enumerations = Object.freeze(enumerations);
    Object.seal(this);
  }
  valueOf() {
    return this.value;
  }
  toString() {
    return isFinite(this.value) && this.value < this.enumerations.length ? this.enumerations[this.value] : `<invalid '${this.value}'>`;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UObject);


/***/ }),

/***/ "../src/unreal/un-package.ts":
/*!***********************************!*\
  !*** ../src/unreal/un-package.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UNativePackage": () => (/* binding */ UNativePackage),
/* harmony export */   "UPackage": () => (/* binding */ UPackage),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _un_class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./un-class */ "../src/unreal/un-class.ts");
/* harmony import */ var _un_encoded_file__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./un-encoded-file */ "../src/unreal/un-encoded-file.ts");
/* harmony import */ var _un_enum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./un-enum */ "../src/unreal/un-enum.ts");
/* harmony import */ var _un_export__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./un-export */ "../src/unreal/un-export.ts");
/* harmony import */ var _un_function__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./un-function */ "../src/unreal/un-function.ts");
/* harmony import */ var _un_generation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./un-generation */ "../src/unreal/un-generation.ts");
/* harmony import */ var _un_header__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./un-header */ "../src/unreal/un-header.ts");
/* harmony import */ var _un_import__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./un-import */ "../src/unreal/un-import.ts");
/* harmony import */ var _un_name__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./un-name */ "../src/unreal/un-name.ts");
/* harmony import */ var _un_object__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./un-object */ "../src/unreal/un-object.ts");
/* harmony import */ var _un_object_flags__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./un-object-flags */ "../src/unreal/un-object-flags.ts");
/* harmony import */ var _un_struct__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./un-struct */ "../src/unreal/un-struct.ts");
/* harmony import */ var _un_const__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./un-const */ "../src/unreal/un-const.ts");
/* harmony import */ var _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./un-property/un-properties */ "../src/unreal/un-property/un-properties.ts");
















class UPackage extends _un_encoded_file__WEBPACK_IMPORTED_MODULE_3__["default"] {
  isDecoded() {
    return !!this.buffer;
  }
  constructor(loader, path) {
    super(path);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "loader", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exports", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "imports", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nameTable", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "header", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "exportGroups", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "importGroups", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "nameHash", new Map());
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isCore", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isEngine", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isNative", false);
    this.loader = loader;
    this.isCore = path.toLocaleLowerCase().endsWith("core.u");
    this.isEngine = path.toLocaleLowerCase().endsWith("engine.u");
  }
  async decode() {
    if (this.buffer) return this;
    if (this.promiseDecoding) {
      await this.promiseDecoding;
      return this;
    }
    const readable = this.asReadable();
    const signature = await readable._doDecode();
    if (signature.value !== 0x9E2A83C1) throw new Error(`Invalid signature: '0x${signature.toString(16).toUpperCase()}' expected '0x9E2A83C1'`);
    const header = new _un_header__WEBPACK_IMPORTED_MODULE_8__["default"]();
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32);
    const int32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32);
    header.version = readable.read(uint32).value;
    header.packageFlags = readable.read(int32).value;
    header.nameCount = readable.read(int32).value;
    header.nameOffset = readable.read(int32).value;
    header.exportCount = readable.read(int32).value;
    header.exportOffset = readable.read(int32).value;
    header.importCount = readable.read(int32).value;
    header.importOffset = readable.read(int32).value;
    const dbgNameCount = header.nameCount;
    const dbgNameOffset = header.nameOffset.toString(16).toUpperCase();
    const dbgExportCount = header.exportCount;
    const dbgExportOffset = header.exportOffset.toString(16).toUpperCase();
    const dbgImportCount = header.importCount;
    const dbgImportOffset = header.importOffset.toString(16).toUpperCase();
    console.log(`'${readable.path}' => Names:${dbgNameOffset}[${dbgNameCount}] Exports:${dbgExportOffset}[${dbgExportCount}] Imports:${dbgImportOffset}[${dbgImportCount}]`);
    if (readable.path === "assets/maps/20_21.unr") {
      console.assert(header.getArchiveFileVersion() === 123);
      console.assert(header.packageFlags === 0x1);
      console.assert(header.nameCount === 12165);
      console.assert(header.nameOffset === 0x40);
      console.assert(header.exportCount === 11379);
      console.assert(header.exportOffset === 0xFB1BF5);
      console.assert(header.importCount === 490);
      console.assert(header.importOffset === 0xFB0712);
    }
    if (header.getArchiveFileVersion() < 68) {
      header.heritageCount = readable.read(uint32).value;
      header.heritageOffset = readable.read(uint32).value;
    } else {
      readable.read(header.guid);
      const generationCount = readable.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int32)).value;
      if (readable.path === "assets/maps/20_21.unr") {
        console.assert(generationCount === 1);
      }
      for (let i = 0, gc = generationCount; i < gc; i++) {
        const gen = new _un_generation__WEBPACK_IMPORTED_MODULE_7__["default"]();
        gen.exportCount = readable.read(uint32).value;
        gen.nameCount = readable.read(uint32).value;
        header.generations.push(gen);
      }
    }
    const [nameTable, nameHash] = readable.loadNames(header);
    const exports = readable.loadExports(header, nameTable);
    const imports = readable.loadImports(header, nameTable);
    readable.exports = exports;
    readable.imports = imports;
    readable.nameTable = nameTable;
    readable.nameHash = nameHash;
    readable.header = header;
    if (this.isCore) {
      const nativeIndex = -(imports.length + 1);
      for (const imp of imports) {
        if (imp.className === "Package") continue;
        if (imp.classPackage !== "Core") continue;
        imp.classPackage = "Native";
        imp.idPackage = nativeIndex;
        {
          const className = imp.objectName;
          registerNameTable(nameTable, nameHash, className);
          {
            const exp = new _un_export__WEBPACK_IMPORTED_MODULE_5__["default"]();
            exp.index = exports.length;
            exp.idClass = -(imp.index + 1);
            exp.idSuper = 0;
            exp.idPackage = nativeIndex;
            exp.idObjectName = nameHash.get(className);
            exp.objectName = className;
            exp.flags = _un_object_flags__WEBPACK_IMPORTED_MODULE_12__["default"].Native;
            exp.size = 0;
            exp.offset = 0;
            exports.push(exp);
          }
        }
      }
      addPackageDependendency(nameTable, nameHash, imports, "Native");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "State");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "DelegateProperty");
    } else if (this.isEngine) {
      addPackageDependendency(nameTable, nameHash, imports, "Native");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Font");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Sound");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Primitive");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "ConvexVolume");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Model");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Mesh");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "StaticMesh");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "MeshInstance");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "LodMeshInstance");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "SkeletalMeshInstance");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "MeshAnimation");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "StaticMeshInstance");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Viewport");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Player");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "TerrainSector");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "TerrainPrimitive");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "LevelBase");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Level");
      addClassDependency(nameTable, nameHash, imports, exports, "Native", "Client");
    }
    readable.importGroups = readable.imports.reduce((accum, imp, index) => {
      const impType = imp.className;
      const list = accum[impType] = accum[impType] || [];
      list.push({
        import: imp,
        index: -index - 1
      });
      return accum;
    }, {});
    readable.exportGroups = readable.exports.reduce((accum, exp, index) => {
      const expType = readable.getPackageName(exp.idClass) || "Class";
      const list = accum[expType] = accum[expType] || [];
      list.push({
        index,
        export: exp
      });
      return accum;
    }, {});
    Object.assign(this, readable, {
      isReadable: false
    });
    return this;
  }
  loadNames(header) {
    this.seek(header.nameOffset, "set");
    const nameTable = [];
    const nameHash = new Map();
    const char = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].char);
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32);
    for (let i = 0, nc = header.nameCount; i < nc; i++) {
      const uname = new _un_name__WEBPACK_IMPORTED_MODULE_10__["default"]();
      uname.name = this.read(char).string;
      uname.flags = this.read(uint32).value;
      nameTable.push(uname);
      nameHash.set(uname.name, i);
    }
    return [nameTable, nameHash];
  }
  loadExports(header, nameTable) {
    this.seek(header.exportOffset, "set");
    const exports = [];
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32);
    for (let i = 0, ec = header.exportCount; i < ec; i++) {
      const uexport = new _un_export__WEBPACK_IMPORTED_MODULE_5__["default"]();
      uexport.idClass = this.read(compat32).value;
      uexport.idSuper = this.read(compat32).value;
      uexport.idPackage = this.read(uint32).value;
      uexport.idObjectName = this.read(compat32).value;
      uexport.index = i;
      uexport.objectName = nameTable[uexport.idObjectName].name;
      uexport.flags = this.read(uint32).value;
      uexport.size = this.read(compat32).value;
      if (uexport.size > 0) uexport.offset = this.read(compat32).value;
      exports.push(uexport);
    }
    return exports;
  }
  loadImports(header, nameTable) {
    this.seek(header.importOffset, "set");
    const imports = [];
    const index = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
    const int32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int32);
    for (let i = 0, ic = header.importCount; i < ic; i++) {
      const uimport = new _un_import__WEBPACK_IMPORTED_MODULE_9__["default"]();
      uimport.index = i;
      this.read(index);
      uimport.idClassPackage = index.value;
      uimport.classPackage = nameTable[uimport.idClassPackage].name;
      this.read(index);
      uimport.idClassName = index.value;
      uimport.className = nameTable[uimport.idClassName].name;
      uimport.idPackage = this.read(int32).value;
      this.read(index);
      uimport.idObjectName = index.value;
      uimport.objectName = nameTable[uimport.idObjectName].name;
      imports.push(uimport);
    }
    return imports;
  }
  getPackageName(index) {
    return index < 0 ? this.imports[-index - 1].objectName : index > 0 ? this.exports[index].objectName : null;
  }
  toString() {
    return `Package=(${this.path}, imports=${this.imports.length}, exports=${this.exports.length})`;
  }
  getImportEntry(objref) {
    if (objref === 0) return null;else if (objref > 0) throw Error("Expected an import table entry");
    const index = -objref - 1;
    if (index >= this.imports.length) throw Error("Import table entry out of bounds!");
    return this.imports[index];
  }
  loadExportObject(index) {
    const entry = this.exports[index];
    const objname = entry.objectName;
    if (entry.idClass !== 0) {
      const objclass = this.fetchObject(entry.idClass);
      if (!objclass) {
        debugger;
        throw Error("Could not find the object class for " + objname);
      }
      const object = entry.object = this.newObject(objclass);
      object.setExport(this, entry);
    } else {
      let objbase = entry.idSuper === 0 ? null : this.fetchObject(entry.idSuper);
      let pkg = this;
      if (!objbase && objname !== "Object") {
        debugger;
        pkg = this.loader.getPackage("Core", "Script");
        if (!pkg.isDecoded()) throw new Error(`Package must be decoded: 'Core'`);
        objbase = pkg.fetchObjectByType("Class", "Object");
      }
      if (!this.exports[index].object) {
        const obj = new _un_class__WEBPACK_IMPORTED_MODULE_2__["default"]();
        this.exports[index].object = obj;
        if (entry.size === 0) {
          if (entry.flags !== _un_object_flags__WEBPACK_IMPORTED_MODULE_12__["default"].Native) throw new Error("0xdeadbeef");
          obj.friendlyName = objname;
        }
        obj.setExport(pkg, entry);
      }
    }
  }
  fetchObject(objref) {
    if (objref > 0) {
      // Export table object
      const index = objref - 1;
      if (index > this.exports.length) throw new Error("Invalid object reference");
      const entry = this.exports[index];
      if (!entry.object) this.loadExportObject(index);
      return entry.object;
    } else if (objref < 0) {
      // Import table object

      const entry = this.getImportEntry(objref);
      let entrypackage = this.getImportEntry(entry.idPackage);
      let groupName = "None";
      if (entrypackage.idPackage !== 0) groupName = entrypackage.objectName;
      while (entrypackage.idPackage !== 0) entrypackage = this.getImportEntry(entrypackage.idPackage);
      const packageName = entrypackage.objectName;
      const objectName = entry.objectName;
      const className = entry.className;
      const pkg = this.loader.getPackage(packageName, className);
      if (!pkg.isDecoded()) throw new Error(`Package must be decoded: '${packageName}'`);
      if (pkg.isNative && className === "State" && objectName === "State" && groupName === "None") {
        console.log(entry);
        debugger;
      }
      let obj = pkg.fetchObjectByType(className, objectName, groupName);
      if (obj === null) {
        console.log(pkg);
        debugger;
        throw new Error(`(${packageName}) [${className}, ${objectName}, ${groupName}] should not be null`);
      }
      if (!obj && packageName == "UnrealI") throw new Error("Not yet implemented");else if (!obj && packageName == "UnrealShare") throw new Error("Not yet implemented");
      return obj;
    }
    return null;
  }
  fetchObjectByType(className, objectName, groupName = "None") {
    const index = this.findObjectRef(className, objectName, groupName);
    return this.fetchObject(index);
  }
  findObjectRef(className, objectName, groupName = "None") {
    const isClass = className == "Class";
    for (const exp of this.exports) {
      if (exp.objectName !== objectName) continue;
      if (groupName !== "None") {
        if (exp.idPackage > 0) {
          const pkg = this.exports[exp.idPackage - 1];
          if (pkg && groupName !== pkg.objectName) {
            continue;
          }
        } else if (exp.idPackage < 0) {
          debugger;
        } else {
          debugger;
        }
      }
      if (isClass) {
        if (exp.idClass > 0) {
          const other = this.exports[exp.idClass + 1];
          if (other && className === other.objectName) return exp.index + 1;
          debugger;
        } else if (exp.idClass < 0) {
          const clsImport = this.imports[-exp.idClass - 1];
          if (clsImport && objectName === clsImport.objectName) {
            if (clsImport.classPackage === "Native") return -(clsImport.index + 1);
            return exp.index + 1;
          }
        } else if (exp.idClass === 0) return exp.index + 1;
      } else if (exp.idClass !== 0) {
        const obj = this.fetchObject(exp.idClass);
        if (obj) {
          const inheritenceChain = obj instanceof _un_class__WEBPACK_IMPORTED_MODULE_2__["default"] ? [obj.loadSelf().friendlyName] : obj.inheritenceChain;
          if (!inheritenceChain) debugger;
          if (inheritenceChain.includes(className)) return exp.index + 1;
        }
      }
    }
    return 0;
  }
  newObject(objclass) {
    if (objclass instanceof _un_class__WEBPACK_IMPORTED_MODULE_2__["default"]) {
      const Constructor = objclass.buildClass(this.loader.getPackage("native", "Script"));
      return new Constructor();
    }
    const obj = new objclass();
    return obj;
  }
}
class UNativePackage extends UPackage {
  constructor(loader) {
    super(loader, "__native__.u");
  }
  async decode() {
    if (this.buffer) return this;
    const tStart = performance.now();
    this.imports = [];
    this.exports = [];
    this.nameTable = [];
    this.nameHash = new Map();
    this.registerNativeClass("Object");
    this.registerNativeClass("Field", "Object");
    this.registerNativeClass("Struct", "Field");
    this.registerNativeClass("State", "Struct");
    this.registerNativeClass("Class", "State");
    this.registerNativeClass("Function", "Struct");
    this.registerNativeClass("Const", "Field");
    this.registerNativeClass("Enum", "Field");
    this.registerNativeClass("Property", "Field");
    // this.registerNativeClass("PointerProperty", "Property");
    this.registerNativeClass("DelegateProperty", "Property");
    this.registerNativeClass("ByteProperty", "Property");
    this.registerNativeClass("ObjectProperty", "Property");
    this.registerNativeClass("ClassProperty", "ObjectProperty");
    // this.registerNativeClass("FixedArrayProperty", "Property");
    this.registerNativeClass("ArrayProperty", "Property");
    // this.registerNativeClass("MapProperty", "Property");
    this.registerNativeClass("StructProperty", "Property");
    this.registerNativeClass("IntProperty", "Property");
    this.registerNativeClass("BoolProperty", "Property");
    this.registerNativeClass("FloatProperty", "Property");
    this.registerNativeClass("NameProperty", "Property");
    this.registerNativeClass("StrProperty", "Property");
    // this.registerNativeClass("StringProperty", "Property");

    this.registerNativeClass("Texture", "Object");
    this.registerNativeClass("Font", "Object");
    this.registerNativeClass("Sound", "Object");
    this.registerNativeClass("Primitive", "Object");
    this.registerNativeClass("Model", "Primitive");
    this.registerNativeClass("ConvexVolume", "Primitive");
    this.registerNativeClass("StaticMesh", "Primitive");
    this.registerNativeClass("Mesh", "Primitive");
    this.registerNativeClass("MeshInstance", "Primitive");
    this.registerNativeClass("LodMeshInstance", "MeshInstance");
    this.registerNativeClass("SkeletalMeshInstance", "LodMeshInstance");
    this.registerNativeClass("MeshAnimation", "Object");
    this.registerNativeClass("StaticMeshInstance", "Object");
    this.registerNativeClass("Player", "Object");
    this.registerNativeClass("Viewport", "Player");
    this.registerNativeClass("TerrainSector", "Object");
    this.registerNativeClass("TerrainPrimitive", "Primitive");
    this.registerNativeClass("LevelBase", "Object");
    this.registerNativeClass("Level", "LevelBase");
    this.registerNativeClass("Client", "Object");
    this.buffer = new ArrayBuffer(0);
    console.log(`'${this.path}' loaded in ${performance.now() - tStart} ms`);
    return this;
  }
  getStructConstructor(constructorName) {
    return _un_object__WEBPACK_IMPORTED_MODULE_11__["default"];
  }
  getConstructor(constructorName) {
    let Constructor;
    switch (constructorName) {
      case "Class":
        Constructor = _un_class__WEBPACK_IMPORTED_MODULE_2__["default"];
        break;
      case "Struct":
        Constructor = _un_struct__WEBPACK_IMPORTED_MODULE_13__["default"];
        break;
      case "Const":
        Constructor = _un_const__WEBPACK_IMPORTED_MODULE_14__["default"];
        break;
      case "Enum":
        Constructor = _un_enum__WEBPACK_IMPORTED_MODULE_4__["default"];
        break;
      case "Function":
        Constructor = _un_function__WEBPACK_IMPORTED_MODULE_6__["default"];
        break;
      case "FloatProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UFloatProperty;
        break;
      case "ByteProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UByteProperty;
        break;
      case "StrProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UStrProperty;
        break;
      case "IntProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UIntProperty;
        break;
      case "BoolProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UBoolProperty;
        break;
      case "NameProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UNameProperty;
        break;
      case "ClassProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UClassProperty;
        break;
      case "ArrayProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UArrayProperty;
        break;
      case "StructProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UStructProperty;
        break;
      case "ObjectProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UObjectProperty;
        break;
      case "DelegateProperty":
        Constructor = _un_property_un_properties__WEBPACK_IMPORTED_MODULE_15__.UDelegateProperty;
        break;
      default:
        debugger;
        throw new Error(`Not implemented native class: ${constructorName}`);
    }
    return Constructor;
  }
  registerNativeClass(className, baseClass = "None") {
    if (!this.nameHash.has(className)) {
      const name = new _un_name__WEBPACK_IMPORTED_MODULE_10__["default"]();
      name.name = className;
      name.flags = 0;
      this.nameTable.push(name);
      this.nameHash.set(className, this.nameTable.length - 1);
    }
    const exp = new _un_export__WEBPACK_IMPORTED_MODULE_5__["default"]();
    exp.index = this.exports.length;
    exp.idClass = 0;
    exp.idSuper = baseClass === "None" ? 0 : this.findObjectRef("Class", baseClass);
    exp.idPackage = 0;
    exp.idObjectName = this.nameHash.get(className);
    exp.objectName = className;
    exp.flags = _un_object_flags__WEBPACK_IMPORTED_MODULE_12__["default"].Native;
    exp.size = 0;
    exp.offset = 0;
    this.exports.push(exp);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UPackage);

function registerNameTable(nameTable, nameHash, value) {
  if (nameHash.has(value)) return nameHash.get(value);
  const name = new _un_name__WEBPACK_IMPORTED_MODULE_10__["default"]();
  name.name = value;
  name.flags = 0;
  name.isFake = true;
  nameTable.push(name);
  nameHash.set(value, nameTable.length - 1);
  return name;
}
function addPackageDependendency(nameTable, nameHash, imports, classPackage) {
  registerNameTable(nameTable, nameHash, "Native");
  const imp = new _un_import__WEBPACK_IMPORTED_MODULE_9__["default"]();
  const className = "Package";
  const idClassName = nameHash.get("Package");
  const idClassPackage = nameHash.get(classPackage);
  imp.className = className;
  imp.classPackage = classPackage;
  imp.idClassName = idClassName;
  imp.idClassPackage = idClassPackage;
  imp.idObjectName = idClassPackage;
  imp.idPackage = 0;
  imp.index = imports.length;
  imp.objectName = classPackage;
  imp.isFake = true;
  imports.push(imp);
}
function addClassDependency(nameTable, nameHash, imports, exports, classPackage, objectName) {
  registerNameTable(nameTable, nameHash, objectName);
  const imp = new _un_import__WEBPACK_IMPORTED_MODULE_9__["default"]();
  const exp = new _un_export__WEBPACK_IMPORTED_MODULE_5__["default"]();
  const idObjectName = nameHash.get(objectName);
  const nativePackage = imports.find(imp => imp.className === "Package" && imp.classPackage === classPackage);
  const nativeIndex = -(nativePackage.index + 1);
  imp.className = "Class";
  imp.classPackage = classPackage;
  imp.idClassName = nameHash.get("Class");
  imp.idClassPackage = nameHash.get(classPackage);
  imp.idObjectName = idObjectName;
  imp.idPackage = nativeIndex;
  imp.index = imports.length;
  imp.objectName = objectName;
  imp.isFake = true;
  exp.index = exports.length;
  exp.idClass = -(imp.index + 1);
  exp.idSuper = 0;
  exp.idPackage = nativeIndex;
  exp.idObjectName = idObjectName;
  exp.objectName = objectName;
  exp.flags = _un_object_flags__WEBPACK_IMPORTED_MODULE_12__["default"].Native;
  exp.size = 0;
  exp.offset = 0;
  exp.isFake = true;
  imports.push(imp);
  exports.push(exp);
  return {
    imp,
    exp
  };
}

/***/ }),

/***/ "../src/unreal/un-property/un-properties.ts":
/*!**************************************************!*\
  !*** ../src/unreal/un-property/un-properties.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UArrayProperty": () => (/* binding */ UArrayProperty),
/* harmony export */   "UBoolProperty": () => (/* binding */ UBoolProperty),
/* harmony export */   "UByteProperty": () => (/* binding */ UByteProperty),
/* harmony export */   "UClassProperty": () => (/* binding */ UClassProperty),
/* harmony export */   "UDelegateProperty": () => (/* binding */ UDelegateProperty),
/* harmony export */   "UFloatProperty": () => (/* binding */ UFloatProperty),
/* harmony export */   "UIntProperty": () => (/* binding */ UIntProperty),
/* harmony export */   "UNameProperty": () => (/* binding */ UNameProperty),
/* harmony export */   "UObjectProperty": () => (/* binding */ UObjectProperty),
/* harmony export */   "UProperty": () => (/* binding */ UProperty),
/* harmony export */   "UStrProperty": () => (/* binding */ UStrProperty),
/* harmony export */   "UStructProperty": () => (/* binding */ UStructProperty)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _utils_flags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/flags */ "../src/utils/flags.ts");
/* harmony import */ var _un_field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../un-field */ "../src/unreal/un-field.ts");




class UProperty extends _un_field__WEBPACK_IMPORTED_MODULE_3__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "arrayDimensions", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "flags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "replicationOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "categoryNameId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "categoryName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "propertyName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "propertyFlags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isNumericType", false);
  }
  preLoad(pkg, exp) {
    super.preLoad(pkg, exp);
    this.propertyName = exp.objectName;
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);

    // debugger;

    this.readHead = pkg.tell();
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32);
    const uint16 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint16);
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
    this.arrayDimensions = pkg.read(uint32).value;
    this.flags = pkg.read(uint32).value;
    this.propertyFlags = Object.freeze((0,_utils_flags__WEBPACK_IMPORTED_MODULE_2__.flagBitsToDict)(this.flags, PropertyFlags_T));
    this.categoryNameId = pkg.read(compat32).value;
    this.categoryName = pkg.nameTable[this.categoryNameId].name;
    if (this.flags & PropertyFlags_T.Net) this.replicationOffset = pkg.read(uint16).value;
    this.readHead = pkg.tell();
  }
  static readProperty(pkg) {
    return pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].float)).value;
  }
}
class UBaseExportProperty extends UProperty {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "valueId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "value", void 0);
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
    this.valueId = pkg.read(compat32).value;
    this.readHead = pkg.tell();
  }
}
class UObjectProperty extends UBaseExportProperty {}
class UClassProperty extends UObjectProperty {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "metaClassId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "metaClass", void 0);
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32);
    this.metaClassId = pkg.read(compat32).value;
    this.readHead = pkg.tell();
  }
}
class UStructProperty extends UBaseExportProperty {}
class UNumericProperty extends UProperty {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "constructor", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isNumericType", true);
  }
  createBuffer() {
    const constr = this.constructor;
    if (!("dtype" in constr)) throw new Error("Missing 'dtype' for numeric property type.");
    return new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](constr.dtype);
  }
}
class UFloatProperty extends UNumericProperty {}
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(UFloatProperty, "dtype", _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].float);
class UIntProperty extends UNumericProperty {}
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(UIntProperty, "dtype", _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int32);
class UStrProperty extends UNumericProperty {}
(0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(UStrProperty, "dtype", _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].char);
class UDelegateProperty extends UProperty {}
class UBoolProperty extends UProperty {}
class UNameProperty extends UProperty {}
class UByteProperty extends UBaseExportProperty {
  loadSelf() {
    super.loadSelf();
    if (this.valueId !== 0 && !this.value) this.value = this.pkg.fetchObject(this.valueId);
    return this;
  }
}
class UArrayProperty extends UBaseExportProperty {}
function readProperty(pkg, dtype) {
  return pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](dtype)).value;
}

var PropertyFlags_T;
(function (PropertyFlags_T) {
  PropertyFlags_T[PropertyFlags_T["Edit"] = 1] = "Edit";
  PropertyFlags_T[PropertyFlags_T["Const"] = 2] = "Const";
  PropertyFlags_T[PropertyFlags_T["Input"] = 4] = "Input";
  PropertyFlags_T[PropertyFlags_T["ExportObject"] = 8] = "ExportObject";
  PropertyFlags_T[PropertyFlags_T["OptionalParm"] = 16] = "OptionalParm";
  PropertyFlags_T[PropertyFlags_T["Net"] = 32] = "Net";
  PropertyFlags_T[PropertyFlags_T["ConstRef"] = 64] = "ConstRef";
  PropertyFlags_T[PropertyFlags_T["Parm"] = 128] = "Parm";
  PropertyFlags_T[PropertyFlags_T["OutParm"] = 256] = "OutParm";
  PropertyFlags_T[PropertyFlags_T["SkipParm"] = 512] = "SkipParm";
  PropertyFlags_T[PropertyFlags_T["ReturnParm"] = 1024] = "ReturnParm";
  PropertyFlags_T[PropertyFlags_T["CoerceParm"] = 2048] = "CoerceParm";
  PropertyFlags_T[PropertyFlags_T["Native"] = 4096] = "Native";
  PropertyFlags_T[PropertyFlags_T["Transient"] = 8192] = "Transient";
  PropertyFlags_T[PropertyFlags_T["Config"] = 16384] = "Config";
  PropertyFlags_T[PropertyFlags_T["Localized"] = 32768] = "Localized";
  PropertyFlags_T[PropertyFlags_T["Travel"] = 65536] = "Travel";
  PropertyFlags_T[PropertyFlags_T["EditConst"] = 131072] = "EditConst";
  PropertyFlags_T[PropertyFlags_T["GlobalConfig"] = 262144] = "GlobalConfig";
  PropertyFlags_T[PropertyFlags_T["OnDemand"] = 1048576] = "OnDemand";
  PropertyFlags_T[PropertyFlags_T["New"] = 2097152] = "New";
  PropertyFlags_T[PropertyFlags_T["NeedCtorLink"] = 4194304] = "NeedCtorLink";
})(PropertyFlags_T || (PropertyFlags_T = {}));
;

/***/ }),

/***/ "../src/unreal/un-property/un-property-tag.ts":
/*!****************************************************!*\
  !*** ../src/unreal/un-property/un-property-tag.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PropertyTag": () => (/* binding */ PropertyTag),
/* harmony export */   "UNP_PropertyMasks": () => (/* binding */ UNP_PropertyMasks),
/* harmony export */   "UNP_PropertyTypes": () => (/* binding */ UNP_PropertyTypes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../buffer-value */ "../src/buffer-value.ts");


class PropertyTag {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "name", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "type", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "structName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "arrayIndex", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "dataSize", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "boolValue", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "enumName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "index", void 0);
  }
  static from(pkg, offset) {
    return new PropertyTag().load(pkg, offset);
  }
  isValid() {
    return !this.name || this.name !== "None";
  }
  load(pkg, offset) {
    pkg.seek(offset, "set");
    const index = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32));
    this.index = index.value;
    const propName = index.value >= 0 && index.value < pkg.nameTable.length ? pkg.nameTable[index.value].name : "None";
    this.name = propName;
    if (propName === "None") return this;
    const info = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int8)).value;
    const isArray = (info & UNP_PropertyMasks.PROPERTY_ARRAY_MASK) !== 0;
    this.type = info & UNP_PropertyMasks.PROPERTY_TYPE_MASK;
    if (this.type === UNP_PropertyTypes.UNP_StructProperty) {
      pkg.read(index);
      this.structName = pkg.nameTable[index.value].name;
    }
    switch (info & UNP_PropertyMasks.PROPERTY_SIZE_MASK) {
      case 0x00:
        this.dataSize = 1;
        break;
      case 0x10:
        this.dataSize = 2;
        break;
      case 0x20:
        this.dataSize = 4;
        break;
      case 0x30:
        this.dataSize = 12;
        break;
      case 0x40:
        this.dataSize = 16;
        break;
      case 0x50:
        this.dataSize = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint8)).value;
        break;
      case 0x60:
        this.dataSize = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint16)).value;
        break;
      case 0x70:
        this.dataSize = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].uint32)).value;
        break;
    }
    this.arrayIndex = 0;
    if (isArray && this.type !== UNP_PropertyTypes.UNP_BoolProperty) {
      const b = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int8)).value;
      if (b < 0x80) {
        this.arrayIndex = b;
      } else {
        const b2 = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int8)).value;
        if (b & 0x40) {
          // really, (b & 0xC0) == 0xC0
          const b3 = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int8)).value;
          const b4 = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].int8)).value;
          this.arrayIndex = (b << 24 | b2 << 16 | b3 << 8 | b4) & 0x3FFFFF;
        } else this.arrayIndex = (b << 8 | b2) & 0x3FFF;
      }
    }
    this.boolValue = this.type === UNP_PropertyTypes.UNP_BoolProperty ? isArray : false;
    return this;
  }
}
var UNP_PropertyTypes;
(function (UNP_PropertyTypes) {
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_ByteProperty"] = 1] = "UNP_ByteProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_IntProperty"] = 2] = "UNP_IntProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_BoolProperty"] = 3] = "UNP_BoolProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_FloatProperty"] = 4] = "UNP_FloatProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_ObjectProperty"] = 5] = "UNP_ObjectProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_NameProperty"] = 6] = "UNP_NameProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_StringProperty"] = 7] = "UNP_StringProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_ClassProperty"] = 8] = "UNP_ClassProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_ArrayProperty"] = 9] = "UNP_ArrayProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_StructProperty"] = 10] = "UNP_StructProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_VectorProperty"] = 11] = "UNP_VectorProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_RotatorProperty"] = 12] = "UNP_RotatorProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_StrProperty"] = 13] = "UNP_StrProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_MapProperty"] = 14] = "UNP_MapProperty";
  UNP_PropertyTypes[UNP_PropertyTypes["UNP_FixedArrayProperty"] = 15] = "UNP_FixedArrayProperty";
})(UNP_PropertyTypes || (UNP_PropertyTypes = {}));
;
var UNP_PropertyMasks;
(function (UNP_PropertyMasks) {
  UNP_PropertyMasks[UNP_PropertyMasks["PROPERTY_TYPE_MASK"] = 15] = "PROPERTY_TYPE_MASK";
  UNP_PropertyMasks[UNP_PropertyMasks["PROPERTY_SIZE_MASK"] = 112] = "PROPERTY_SIZE_MASK";
  UNP_PropertyMasks[UNP_PropertyMasks["PROPERTY_ARRAY_MASK"] = 128] = "PROPERTY_ARRAY_MASK";
})(UNP_PropertyMasks || (UNP_PropertyMasks = {}));
;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PropertyTag);


/***/ }),

/***/ "../src/unreal/un-state.ts":
/*!*********************************!*\
  !*** ../src/unreal/un-state.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UState": () => (/* binding */ UState),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _un_struct__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./un-struct */ "../src/unreal/un-struct.ts");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");



class UState extends _un_struct__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "probeMask", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "ignoreMask", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "stateFlags", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "labelTableOffset", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "probes", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isState", true);
  }
  static getConstructorName() {
    return "State";
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    this.readHead = pkg.tell();
    const uint64 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].uint64);
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].uint32);
    const uint16 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].uint16);
    this.probeMask = pkg.read(uint64).value;
    this.ignoreMask = pkg.read(uint64).value;
    this.stateFlags = pkg.read(uint32).value;
    this.labelTableOffset = pkg.read(uint16).value;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UState);


/***/ }),

/***/ "../src/unreal/un-string.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-string.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FString": () => (/* binding */ FString),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");


class FString {
  constructor() {
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "value", void 0);
  }
  load(pkg) {
    const bufLen = pkg.read(new _buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].compat32)).value;
    const buf = pkg.read(_buffer_value__WEBPACK_IMPORTED_MODULE_1__["default"].allocBytes(bufLen)).value;
    this.value = new TextDecoder("ascii").decode(buf.buffer.slice(0, -1));
    return this;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FString);


/***/ }),

/***/ "../src/unreal/un-struct.ts":
/*!**********************************!*\
  !*** ../src/unreal/un-struct.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UStruct": () => (/* binding */ UStruct),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _un_field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./un-field */ "../src/unreal/un-field.ts");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _un_object_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./un-object-flags */ "../src/unreal/un-object-flags.ts");
/* harmony import */ var _un_object__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./un-object */ "../src/unreal/un-object.ts");
/* harmony import */ var _un_property_un_properties__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./un-property/un-properties */ "../src/unreal/un-property/un-properties.ts");






class UStruct extends _un_field__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(...args) {
    super(...args);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "textBufferId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "firstChildPropId", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "childPropFields", new Map());
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "friendlyName", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "line", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "textPos", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "unkObjectId", 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "unkObject", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "scriptSize", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "kls", void 0);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isStruct", true);
    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "defaultProperties", new Map());
  }
  static getConstructorName() {
    return "Struct";
  }
  readArray(pkg, tag) {
    let field = this;
    while (field) {
      if (!field.childPropFields.has(tag.name)) {
        field = field.superField;
        continue;
      }
      const property = field.childPropFields.get(tag.name);
      debugger;
      const constr = property.createObject();
      const value = constr(pkg, tag);
      this.setProperty(tag, value);
      return true;
    }
    throw new Error("Broken");
  }
  setProperty(tag, value) {
    let field = this;
    while (field) {
      if (!field.childPropFields.has(tag.name)) {
        field = field.superField;
        continue;
      }
      const property = field.childPropFields.get(tag.name);
      if (!(property instanceof _un_property_un_properties__WEBPACK_IMPORTED_MODULE_5__.UProperty)) continue;
      console.log(property);
      if (property.arrayDimensions > 1) {
        if (!this.defaultProperties.has(tag.name)) this.defaultProperties.set(tag.name, new Array(property.arrayDimensions));
        const arr = this.defaultProperties.get(tag.name);
        if (tag.arrayIndex in arr) debugger;
        arr[tag.arrayIndex] = value;
      } else {
        if (this.defaultProperties.has(tag.name)) debugger;
        this.defaultProperties.set(tag.name, value);
      }
      return true;
    }
    throw new Error("Broken");
  }
  doLoad(pkg, exp) {
    super.doLoad(pkg, exp);
    this.readHead = pkg.tell();
    const verArchive = pkg.header.getArchiveFileVersion();
    const compat32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].compat32);
    const uint32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].uint32);
    const int32 = new _buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"](_buffer_value__WEBPACK_IMPORTED_MODULE_2__["default"].int32);
    this.textBufferId = pkg.read(compat32).value;
    this.firstChildPropId = pkg.read(compat32).value;
    const nameId = pkg.read(compat32).value;
    this.friendlyName = pkg.nameTable[nameId].name;
    console.assert(typeof this.friendlyName === "string" && this.friendlyName !== "None", "Must have a friendly name");
    if (0x77 < verArchive) {
      this.unkObjectId = pkg.read(compat32).value;
    }
    this.line = pkg.read(int32).value;
    this.textPos = pkg.read(int32).value;
    this.scriptSize = pkg.read(uint32).value;
    this.readScript(pkg);
    this.readHead = pkg.tell();
    if (this.firstChildPropId !== 0) {
      let childPropId = this.firstChildPropId;
      while (Number.isFinite(childPropId) && childPropId !== 0) {
        const field = pkg.fetchObject(childPropId).loadSelf();
        this.childPropFields.set(field.propertyName, field);
        childPropId = field.nextFieldId;
      }
    }
  }
  readScript(pkg) {
    pkg.seek(this.scriptSize);
  }
  buildClass(pkg) {
    var _class;
    if (this.kls) return this.kls;
    this.loadSelf();
    const dependencyTree = this.collectDependencies();
    if (!this.isReady) debugger;
    const clsNamedProperties = {};
    const inheretenceChain = new Array();
    let lastNative = null;
    for (const base of dependencyTree.reverse()) {
      var _base$constructor;
      inheretenceChain.push(base.friendlyName);
      if (!base.exp || base.exp.anyFlags(_un_object_flags__WEBPACK_IMPORTED_MODULE_3__["default"].Native)) lastNative = base;
      if (base.constructor !== UStruct && ((_base$constructor = base.constructor) === null || _base$constructor === void 0 ? void 0 : _base$constructor.friendlyName) !== UStruct.getConstructorName()) debugger;
      const {
        childPropFields,
        defaultProperties
      } = base;
      for (const field of childPropFields.values()) {
        if (!(field instanceof _un_property_un_properties__WEBPACK_IMPORTED_MODULE_5__.UProperty)) continue;
        const propertyName = field.propertyName;

        // debugger;

        if (field instanceof _un_property_un_properties__WEBPACK_IMPORTED_MODULE_5__.UArrayProperty) {
          if (field.arrayDimensions !== 1) debugger;
          if (defaultProperties.has(propertyName)) debugger;
          clsNamedProperties[propertyName] = field.dtype.clone(this[propertyName]);
          continue;
        }
        if (this.propertyDict.has(propertyName)) clsNamedProperties[propertyName] = this.propertyDict.get(propertyName);else if (field.arrayDimensions > 1) {
          debugger;
          clsNamedProperties[propertyName] = new Array(field.arrayDimensions);
        } else if (field.isNumericType) {
          clsNamedProperties[propertyName] = field.createBuffer();
        } else {
          debugger;
        }
      }
      for (const propertyName of Object.keys(defaultProperties)) {
        debugger;
        clsNamedProperties[propertyName] = this[propertyName];
      }
    }
    const friendlyName = this.friendlyName;
    const hostClass = this;
    const Constructor = lastNative ? pkg.getConstructor(lastNative.friendlyName) : pkg.getStructConstructor(this.friendlyName);
    if (lastNative) debugger;
    if (friendlyName === "Vector") debugger;
    const cls = {
      [this.friendlyName]: (_class = class extends Constructor {
        constructor() {
          super();
          (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "newProps", {});
          const oldProps = this.getPropertyMap();
          const newProps = this.newProps;
          const missingProps = [];
          if (friendlyName === "Vector") debugger;
          for (const [name, value] of Object.entries(clsNamedProperties)) {
            const varname = name in oldProps ? oldProps[name] : name;
            if (!(name in oldProps)) {
              newProps[varname] = varname;
              missingProps.push(varname);
            }
            if (value !== undefined || !(varname in this)) this[varname] = value;
          }
          if (missingProps.length > 0 && lastNative) console.warn(`Native type '${friendlyName}' is missing property '${missingProps.join(", ")}'`);
        }
        getPropertyMap() {
          return {
            ...super.getPropertyMap(),
            ...this.newProps
          };
        }
        toString() {
          return Constructor === _un_object__WEBPACK_IMPORTED_MODULE_4__["default"] ? `[D|S]${friendlyName}` : Constructor.prototype.toString.call(this);
        }
      }, (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "isDynamicClass", true), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "friendlyName", friendlyName), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "hostClass", hostClass), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "nativeClass", lastNative), (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(_class, "inheretenceChain", Object.freeze(inheretenceChain)), _class)
    }[this.friendlyName];
    this.kls = cls;
    return this.kls;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UStruct);


/***/ }),

/***/ "../src/utils/flags.ts":
/*!*****************************!*\
  !*** ../src/utils/flags.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allFlags": () => (/* binding */ allFlags),
/* harmony export */   "anyFlags": () => (/* binding */ anyFlags),
/* harmony export */   "flagBitsToDict": () => (/* binding */ flagBitsToDict)
/* harmony export */ });
function allFlags(flags, matchFlags) {
  return (flags & matchFlags) === flags;
}
function anyFlags(flags, matchFlags) {
  return (flags & matchFlags) !== 0;
}
function flagBitsToDict(flags, enum_) {
  const flagNames = Object.keys(enum_).filter(x => !x.match(/\d+/));
  return flagNames.reduce((acc, name) => {
    if (anyFlags(flags, enum_[name])) acc[name] = true;
    return acc;
  }, {});
}


/***/ }),

/***/ "../node_modules/gmp-wasm/dist/index.esm.js":
/*!**************************************************!*\
  !*** ../node_modules/gmp-wasm/dist/index.esm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DivMode": () => (/* binding */ DivMode),
/* harmony export */   "FloatRoundingMode": () => (/* binding */ FloatRoundingMode),
/* harmony export */   "init": () => (/* binding */ init),
/* harmony export */   "mpfr_flags": () => (/* binding */ mpfr_flags),
/* harmony export */   "mpfr_free_cache_t": () => (/* binding */ mpfr_free_cache_t),
/* harmony export */   "mpfr_rnd_t": () => (/* binding */ mpfr_rnd_t),
/* harmony export */   "precisionToBits": () => (/* binding */ precisionToBits)
/* harmony export */ });
/*!
 * gmp-wasm v1.1.0 (https://www.npmjs.com/package/gmp-wasm)
 * (c) Dani Biro
 * @license LGPL-3.0
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function isUint32(num) {
    return Number.isSafeInteger(num) && num >= 0 && num < Math.pow(2, 32);
}
function assertUint32(num) {
    if (!isUint32(num)) {
        throw new Error('Invalid number specified: uint32_t is required');
    }
}
function isInt32(num) {
    return Number.isSafeInteger(num) && num >= -Math.pow(2, 31) && num < Math.pow(2, 31);
}
function assertInt32(num) {
    if (!isInt32(num)) {
        throw new Error('Invalid number specified: int32_t is required');
    }
}
function assertArray(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid parameter specified. Array is required!');
    }
}
function isValidRadix(radix) {
    return Number.isSafeInteger(radix) && radix >= 2 && radix <= 36;
}
function assertValidRadix(radix) {
    if (!isValidRadix(radix)) {
        throw new Error('radix must have a value between 2 and 36');
    }
}
const FLOAT_SPECIAL_VALUES = {
    '@NaN@': 'NaN',
    '@Inf@': 'Infinity',
    '-@Inf@': '-Infinity',
};
const FLOAT_SPECIAL_VALUE_KEYS = Object.keys(FLOAT_SPECIAL_VALUES);
const trimTrailingZeros = (num) => {
    let pos = num.length - 1;
    while (pos >= 0) {
        if (num[pos] === '.') {
            pos--;
            break;
        }
        else if (num[pos] === '0') {
            pos--;
        }
        else {
            break;
        }
    }
    if (pos !== num.length - 1) {
        return num.slice(0, pos + 1);
    }
    if (num.length === 0) {
        return '0';
    }
    return num;
};
const insertDecimalPoint = (mantissa, pointPos) => {
    const isNegative = mantissa.startsWith('-');
    const mantissaWithoutSign = isNegative ? mantissa.slice(1) : mantissa;
    const sign = isNegative ? '-' : '';
    let hasDecimalPoint = false;
    if (pointPos <= 0) {
        const zeros = '0'.repeat(-pointPos);
        mantissa = `${sign}0.${zeros}${mantissaWithoutSign}`;
        hasDecimalPoint = true;
    }
    else if (pointPos < mantissaWithoutSign.length) {
        mantissa = `${sign}${mantissaWithoutSign.slice(0, pointPos)}.${mantissaWithoutSign.slice(pointPos)}`;
        hasDecimalPoint = true;
    }
    else {
        const zeros = '0'.repeat(pointPos - mantissaWithoutSign.length);
        mantissa = `${mantissa}${zeros}`;
    }
    // trim trailing zeros after decimal point
    if (hasDecimalPoint) {
        mantissa = trimTrailingZeros(mantissa);
    }
    return mantissa;
};

// matches mpfr_rnd_t
/** Represents the different rounding modes. */
var FloatRoundingMode;
(function (FloatRoundingMode) {
    /** Round to nearest, with ties to even. MPFR_RNDN */
    FloatRoundingMode[FloatRoundingMode["ROUND_NEAREST"] = 0] = "ROUND_NEAREST";
    /** Round toward zero. MPFR_RNDZ */
    FloatRoundingMode[FloatRoundingMode["ROUND_TO_ZERO"] = 1] = "ROUND_TO_ZERO";
    /** Round toward +Infinity. MPFR_RNDU */
    FloatRoundingMode[FloatRoundingMode["ROUND_UP"] = 2] = "ROUND_UP";
    /** Round toward -Infinity. MPFR_RNDD */
    FloatRoundingMode[FloatRoundingMode["ROUND_DOWN"] = 3] = "ROUND_DOWN";
    /** Round away from zero. MPFR_RNDA */
    FloatRoundingMode[FloatRoundingMode["ROUND_FROM_ZERO"] = 4] = "ROUND_FROM_ZERO";
    // /** (Experimental) Faithful rounding. MPFR_RNDF */
    // ROUND_FAITHFUL = 5,
    // /** (Experimental) Round to nearest, with ties away from zero. MPFR_RNDNA */
    // ROUND_TO_NEAREST_AWAY_FROM_ZERO = -1,
})(FloatRoundingMode || (FloatRoundingMode = {}));
const INVALID_PARAMETER_ERROR$2 = 'Invalid parameter!';
function getFloatContext(gmp, ctx, ctxOptions) {
    var _a, _b, _c;
    const mpfr_t_arr = [];
    const isInteger = (val) => ctx.intContext.isInteger(val);
    const isRational = (val) => ctx.rationalContext.isRational(val);
    const isFloat = (val) => ctx.floatContext.isFloat(val);
    const globalRndMode = ((_a = ctxOptions.roundingMode) !== null && _a !== void 0 ? _a : FloatRoundingMode.ROUND_NEAREST);
    const globalPrecisionBits = (_b = ctxOptions.precisionBits) !== null && _b !== void 0 ? _b : 52;
    const globalRadix = (_c = ctxOptions.radix) !== null && _c !== void 0 ? _c : 10;
    assertUint32(globalPrecisionBits);
    assertValidRadix(globalRadix);
    const compare = (mpfr_t, val) => {
        if (typeof val === 'number') {
            assertInt32(val);
            return gmp.mpfr_cmp_si(mpfr_t, val);
        }
        if (typeof val === 'string') {
            const f = FloatFn(val, ctxOptions);
            return gmp.mpfr_cmp(mpfr_t, f.mpfr_t);
        }
        if (isInteger(val)) {
            return gmp.mpfr_cmp_z(mpfr_t, val.mpz_t);
        }
        if (isRational(val)) {
            return gmp.mpfr_cmp_q(mpfr_t, val.mpq_t);
        }
        if (isFloat(val)) {
            return gmp.mpfr_cmp(mpfr_t, val.mpfr_t);
        }
        throw new Error(INVALID_PARAMETER_ERROR$2);
    };
    const mergeFloatOptions = (options1, options2) => {
        var _a, _b, _c, _d, _e, _f;
        const precisionBits1 = (_a = options1 === null || options1 === void 0 ? void 0 : options1.precisionBits) !== null && _a !== void 0 ? _a : globalPrecisionBits;
        const precisionBits2 = (_b = options2 === null || options2 === void 0 ? void 0 : options2.precisionBits) !== null && _b !== void 0 ? _b : globalPrecisionBits;
        return {
            precisionBits: Math.max(precisionBits1, precisionBits2),
            roundingMode: (_d = (_c = options2 === null || options2 === void 0 ? void 0 : options2.roundingMode) !== null && _c !== void 0 ? _c : options1.roundingMode) !== null && _d !== void 0 ? _d : ctxOptions.roundingMode,
            radix: (_f = (_e = options2 === null || options2 === void 0 ? void 0 : options2.radix) !== null && _e !== void 0 ? _e : options1.radix) !== null && _f !== void 0 ? _f : ctxOptions.radix,
        };
    };
    const FloatPrototype = {
        mpfr_t: 0,
        precisionBits: -1,
        rndMode: -1,
        radix: -1,
        type: 'float',
        get options() {
            var _a, _b, _c;
            return {
                precisionBits: (_a = this.precisionBits) !== null && _a !== void 0 ? _a : globalPrecisionBits,
                roundingMode: (_b = this.rndMode) !== null && _b !== void 0 ? _b : globalRndMode,
                radix: (_c = this.radix) !== null && _c !== void 0 ? _c : globalRadix,
            };
        },
        get setOptions() {
            return {
                precisionBits: this.precisionBits,
                roundingMode: this.rndMode,
                radix: this.radix,
            };
        },
        /** Returns the sum of this number and the given one. */
        add(val) {
            if (typeof val === 'number') {
                const n = FloatFn(null, this.options);
                gmp.mpfr_add_d(n.mpfr_t, this.mpfr_t, val, this.rndMode);
                return n;
            }
            if (typeof val === 'string') {
                const n = FloatFn(val, this.options);
                gmp.mpfr_add(n.mpfr_t, this.mpfr_t, n.mpfr_t, this.rndMode);
                return n;
            }
            if (isFloat(val)) {
                const n = FloatFn(null, mergeFloatOptions(this.setOptions, val.setOptions));
                gmp.mpfr_add(n.mpfr_t, this.mpfr_t, val.mpfr_t, this.rndMode);
                return n;
            }
            if (isRational(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_add_q(n.mpfr_t, this.mpfr_t, val.mpq_t, this.rndMode);
                return n;
            }
            if (isInteger(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_add_z(n.mpfr_t, this.mpfr_t, val.mpz_t, this.rndMode);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$2);
        },
        /** Returns the difference of this number and the given one. */
        sub(val) {
            if (typeof val === 'number') {
                const n = FloatFn(null, this.options);
                gmp.mpfr_sub_d(n.mpfr_t, this.mpfr_t, val, this.rndMode);
                return n;
            }
            if (typeof val === 'string') {
                const n = FloatFn(val, this.options);
                gmp.mpfr_sub(n.mpfr_t, this.mpfr_t, n.mpfr_t, this.rndMode);
                return n;
            }
            if (isFloat(val)) {
                const n = FloatFn(null, mergeFloatOptions(this.setOptions, val.setOptions));
                gmp.mpfr_sub(n.mpfr_t, this.mpfr_t, val.mpfr_t, this.rndMode);
                return n;
            }
            if (isRational(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_sub_q(n.mpfr_t, this.mpfr_t, val.mpq_t, this.rndMode);
                return n;
            }
            if (isInteger(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_sub_z(n.mpfr_t, this.mpfr_t, val.mpz_t, this.rndMode);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$2);
        },
        /** Returns the product of this number and the given one. */
        mul(val) {
            if (typeof val === 'number') {
                const n = FloatFn(null, this.options);
                if (isInt32(val)) {
                    gmp.mpfr_mul_si(n.mpfr_t, this.mpfr_t, val, this.rndMode);
                }
                else {
                    gmp.mpfr_mul_d(n.mpfr_t, this.mpfr_t, val, this.rndMode);
                }
                return n;
            }
            if (typeof val === 'string') {
                const n = FloatFn(val, this.options);
                gmp.mpfr_mul(n.mpfr_t, this.mpfr_t, n.mpfr_t, this.rndMode);
                return n;
            }
            if (isFloat(val)) {
                const n = FloatFn(null, mergeFloatOptions(this.setOptions, val.setOptions));
                gmp.mpfr_mul(n.mpfr_t, this.mpfr_t, val.mpfr_t, this.rndMode);
                return n;
            }
            if (isRational(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_mul_q(n.mpfr_t, this.mpfr_t, val.mpq_t, this.rndMode);
                return n;
            }
            if (isInteger(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_mul_z(n.mpfr_t, this.mpfr_t, val.mpz_t, this.rndMode);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$2);
        },
        /** Returns the result of the division of this number by the given one. */
        div(val) {
            if (typeof val === 'number') {
                const n = FloatFn(null, this.options);
                gmp.mpfr_div_d(n.mpfr_t, this.mpfr_t, val, this.rndMode);
                return n;
            }
            if (typeof val === 'string') {
                const n = FloatFn(val, this.options);
                gmp.mpfr_div(n.mpfr_t, this.mpfr_t, n.mpfr_t, this.rndMode);
                return n;
            }
            if (isFloat(val)) {
                const n = FloatFn(null, mergeFloatOptions(this.setOptions, val.setOptions));
                gmp.mpfr_div(n.mpfr_t, this.mpfr_t, val.mpfr_t, this.rndMode);
                return n;
            }
            if (isRational(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_div_q(n.mpfr_t, this.mpfr_t, val.mpq_t, this.rndMode);
                return n;
            }
            if (isInteger(val)) {
                const n = FloatFn(null, this.options);
                gmp.mpfr_div_z(n.mpfr_t, this.mpfr_t, val.mpz_t, this.rndMode);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$2);
        },
        /** Returns the square root. */
        sqrt() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_sqrt(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the reciprocal square root. */
        invSqrt() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_rec_sqrt(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the cube root. */
        cbrt() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_cbrt(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the n-th root. */
        nthRoot(nth) {
            const n = FloatFn(null, this.options);
            assertUint32(nth);
            gmp.mpfr_rootn_ui(n.mpfr_t, this.mpfr_t, nth, this.rndMode);
            return n;
        },
        /** Returns the number with inverted sign. */
        neg() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_neg(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the absolute value. */
        abs() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_abs(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the factorial */
        factorial() {
            const n = FloatFn(null, this.options);
            if (gmp.mpfr_fits_uint_p(this.mpfr_t, this.rndMode) === 0) {
                throw new Error('Invalid value for factorial()');
            }
            const value = gmp.mpfr_get_ui(this.mpfr_t, this.rndMode);
            gmp.mpfr_fac_ui(n.mpfr_t, value, this.rndMode);
            return n;
        },
        /** Returns true if the number is an integer */
        isInteger() {
            return gmp.mpfr_integer_p(this.mpfr_t) !== 0;
        },
        /** Returns true if the number is zero */
        isZero() {
            return gmp.mpfr_zero_p(this.mpfr_t) !== 0;
        },
        /** Returns true if the number is a regular number (i.e., neither NaN, nor an infinity nor zero) */
        isRegular() {
            return gmp.mpfr_regular_p(this.mpfr_t) !== 0;
        },
        /** Return true if the number is an ordinary number (i.e., neither NaN nor an infinity) */
        isNumber() {
            return gmp.mpfr_number_p(this.mpfr_t) !== 0;
        },
        /** Returns true if the number is an infinity */
        isInfinite() {
            return gmp.mpfr_inf_p(this.mpfr_t) !== 0;
        },
        /** Returns true if the number is NaN */
        isNaN() {
            return gmp.mpfr_nan_p(this.mpfr_t) !== 0;
        },
        /** Returns true if the current number is equal to the provided number */
        isEqual(val) {
            return compare(this.mpfr_t, val) === 0;
        },
        /** Returns true if the current number is less than the provided number */
        lessThan(val) {
            return compare(this.mpfr_t, val) < 0;
        },
        /** Returns true if the current number is less than or equal to the provided number */
        lessOrEqual(val) {
            return compare(this.mpfr_t, val) <= 0;
        },
        /** Returns true if the current number is greater than the provided number */
        greaterThan(val) {
            return compare(this.mpfr_t, val) > 0;
        },
        /** Returns true if the current number is greater than or equal to the provided number */
        greaterOrEqual(val) {
            return compare(this.mpfr_t, val) >= 0;
        },
        /** Returns the natural logarithm */
        ln() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_log(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the base 2 logarithm */
        log2() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_log2(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the base 10 logarithm */
        log10() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_log10(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the exponential (e^x) */
        exp() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_exp(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns 2 to the power of current number (2^x) */
        exp2() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_exp2(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns 10 to the power of current number (10^x) */
        exp10() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_exp10(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns this number exponentiated to the given value. */
        pow(val) {
            const n = FloatFn(null, this.options);
            if (typeof val === 'number') {
                if (isInt32(val)) {
                    gmp.mpfr_pow_si(n.mpfr_t, this.mpfr_t, val, this.rndMode);
                }
                else {
                    gmp.mpfr_pow(n.mpfr_t, this.mpfr_t, FloatFn(val).mpfr_t, this.rndMode);
                }
            }
            else {
                gmp.mpfr_pow(n.mpfr_t, this.mpfr_t, val.mpfr_t, this.rndMode);
            }
            return n;
        },
        /** Returns the sine */
        sin() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_sin(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the cosine */
        cos() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_cos(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the tangent */
        tan() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_tan(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the secant */
        sec() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_sec(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the cosecant */
        csc() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_csc(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the cotangent */
        cot() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_cot(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the arc-cosine */
        acos() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_acos(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the arc-sine */
        asin() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_asin(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the arc-tangent */
        atan() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_atan(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the hyperbolic sine */
        sinh() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_sinh(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the hyperbolic cosine */
        cosh() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_cosh(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the hyperbolic tangent */
        tanh() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_tanh(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the hyperbolic secant */
        sech() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_sech(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the hyperbolic cosecant */
        csch() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_csch(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the hyperbolic cotangent */
        coth() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_coth(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the inverse hyperbolic cosine */
        acosh() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_acosh(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the inverse hyperbolic sine */
        asinh() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_asinh(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the inverse hyperbolic tangent */
        atanh() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_atanh(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate exponential integral */
        eint() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_eint(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the real part of the dilogarithm (the integral of -log(1-t)/t from 0 to op) */
        li2() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_li2(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the Gamma function. */
        gamma() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_gamma(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the logarithm of the absolute value of the Gamma function */
        lngamma() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_lngamma(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the Digamma (sometimes also called Psi) function */
        digamma() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_digamma(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the Beta function */
        beta(op2) {
            if (!isFloat(op2)) {
                throw new Error('Only floats parameters are supported!');
            }
            const n = FloatFn(null, this.options);
            gmp.mpfr_beta(n.mpfr_t, this.mpfr_t, op2.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the Riemann Zeta function */
        zeta() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_zeta(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the error function */
        erf() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_erf(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the complementary error function */
        erfc() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_erfc(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the first kind Bessel function of order 0 */
        j0() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_j0(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the first kind Bessel function of order 1 */
        j1() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_j1(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the first kind Bessel function of order n */
        jn(n) {
            assertInt32(n);
            const rop = FloatFn(null, this.options);
            gmp.mpfr_jn(rop.mpfr_t, n, this.mpfr_t, this.rndMode);
            return rop;
        },
        /** Calculate the value of the second kind Bessel function of order 0 */
        y0() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_y0(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the second kind Bessel function of order 1 */
        y1() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_y1(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the second kind Bessel function of order n */
        yn(n) {
            assertInt32(n);
            const rop = FloatFn(null, this.options);
            gmp.mpfr_yn(rop.mpfr_t, n, this.mpfr_t, this.rndMode);
            return rop;
        },
        /** Calculate the arithmetic-geometric mean */
        agm(op2) {
            if (!isFloat(op2)) {
                throw new Error('Only floats parameters are supported!');
            }
            const n = FloatFn(null, this.options);
            gmp.mpfr_agm(n.mpfr_t, this.mpfr_t, op2.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of the Airy function Ai on x */
        ai() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_ai(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Returns the sign of the current value (-1 or 0 or 1) */
        sign() {
            return gmp.mpfr_sgn(this.mpfr_t);
        },
        /** Converts current value into a JavaScript number */
        toNumber() {
            return gmp.mpfr_get_d(this.mpfr_t, this.rndMode);
        },
        /** Rounds to the next higher or equal representable integer */
        ceil() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_ceil(n.mpfr_t, this.mpfr_t);
            return n;
        },
        /** Rounds to the next lower or equal representable integer */
        floor() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_floor(n.mpfr_t, this.mpfr_t);
            return n;
        },
        /** Rounds to the nearest representable integer, rounding halfway cases away from zero */
        round() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_round(n.mpfr_t, this.mpfr_t);
            return n;
        },
        /** Rounds to the nearest representable integer, rounding halfway cases with the even-rounding rule */
        roundEven() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_roundeven(n.mpfr_t, this.mpfr_t);
            return n;
        },
        /** Rounds to the next representable integer toward zero */
        trunc() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_trunc(n.mpfr_t, this.mpfr_t);
            return n;
        },
        /** Round to precision */
        roundTo(prec) {
            assertUint32(prec);
            const n = FloatFn(this, this.options);
            gmp.mpfr_prec_round(this.mpfr_t, prec, this.rndMode);
            return n;
        },
        /** Returns the fractional part */
        frac() {
            const n = FloatFn(null, this.options);
            gmp.mpfr_frac(n.mpfr_t, this.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of x - ny, where n is the integer quotient of x divided by y; n is rounded toward zero */
        fmod(y) {
            if (!isFloat(y)) {
                throw new Error('Only floats parameters are supported!');
            }
            const n = FloatFn(null, this.options);
            gmp.mpfr_fmod(n.mpfr_t, this.mpfr_t, y.mpfr_t, this.rndMode);
            return n;
        },
        /** Calculate the value of x - ny, where n is the integer quotient of x divided by y; n is rounded to the nearest integer (ties rounded to even) */
        remainder(y) {
            if (!isFloat(y)) {
                throw new Error('Only floats parameters are supported!');
            }
            const n = FloatFn(null, this.options);
            gmp.mpfr_remainder(n.mpfr_t, this.mpfr_t, y.mpfr_t, this.rndMode);
            return n;
        },
        /** Return next value towards +∞ */
        nextAbove() {
            const n = FloatFn(this, this.options);
            gmp.mpfr_nextabove(n.mpfr_t);
            return n;
        },
        /** Return next value towards -∞ */
        nextBelow() {
            const n = FloatFn(this, this.options);
            gmp.mpfr_nextbelow(n.mpfr_t);
            return n;
        },
        /** Returns the exponent of x, assuming that x is a non-zero ordinary number and the significand is considered in [1/2, 1). */
        exponent() {
            return gmp.mpfr_get_exp(this.mpfr_t);
        },
        /** Converts the number to string */
        toString(radix) {
            radix = radix !== null && radix !== void 0 ? radix : this.options.radix;
            assertValidRadix(radix);
            const str = gmp.mpfr_to_string(this.mpfr_t, radix, this.rndMode);
            return str;
        },
        /** Formats the number using fixed-point notation */
        toFixed(digits = 0, radix) {
            assertUint32(digits);
            radix = radix !== null && radix !== void 0 ? radix : this.options.radix;
            assertValidRadix(radix);
            const str = this.toString(radix);
            if (Object.values(FLOAT_SPECIAL_VALUES).includes(str)) {
                return str;
            }
            if (digits === 0) {
                return ctx.intContext.Integer(this).toString(radix);
            }
            let multiplier = null;
            if (radix === 2) {
                multiplier = FloatFn(digits).exp2();
            }
            else if (radix === 10) {
                multiplier = FloatFn(digits).exp10();
            }
            else {
                multiplier = FloatFn(radix).pow(digits);
            }
            const multiplied = this.mul(multiplier);
            const int = ctx.intContext.Integer(multiplied);
            const isNegative = int.sign() === -1;
            let intStr = int.abs().toString(radix);
            if (intStr.length < digits + 1) {
                intStr = '0'.repeat(digits + 1 - intStr.length) + intStr;
            }
            return `${isNegative ? '-' : ''}${intStr.slice(0, -digits)}.${intStr.slice(-digits)}`;
        },
        /** Converts the number to an integer */
        toInteger() {
            return ctx.intContext.Integer(this);
        },
        /** Converts the number to a rational number */
        toRational() {
            return ctx.rationalContext.Rational(this);
        },
    };
    const setValue = (mpfr_t, rndMode, radix, val) => {
        if (typeof val === 'string') {
            const res = gmp.mpfr_set_string(mpfr_t, val, radix, rndMode);
            if (res !== 0) {
                throw new Error('Invalid number provided!');
            }
            return;
        }
        if (typeof val === 'number') {
            if (isInt32(val)) {
                gmp.mpfr_set_si(mpfr_t, val, rndMode);
                if (Object.is(val, -0)) {
                    gmp.mpfr_neg(mpfr_t, mpfr_t, rndMode);
                }
            }
            else {
                gmp.mpfr_set_d(mpfr_t, val, rndMode);
            }
            return;
        }
        if (isFloat(val)) {
            gmp.mpfr_set(mpfr_t, val.mpfr_t, rndMode);
            return;
        }
        if (isRational(val)) {
            gmp.mpfr_set_q(mpfr_t, val.mpq_t, rndMode);
            return;
        }
        if (isInteger(val)) {
            gmp.mpfr_set_z(mpfr_t, val.mpz_t, rndMode);
            return;
        }
        throw new Error(INVALID_PARAMETER_ERROR$2);
    };
    const FloatFn = (val, options) => {
        var _a, _b, _c;
        const rndMode = ((_a = options === null || options === void 0 ? void 0 : options.roundingMode) !== null && _a !== void 0 ? _a : globalRndMode);
        const precisionBits = (_b = options === null || options === void 0 ? void 0 : options.precisionBits) !== null && _b !== void 0 ? _b : globalPrecisionBits;
        const radix = (_c = options === null || options === void 0 ? void 0 : options.radix) !== null && _c !== void 0 ? _c : globalRadix;
        assertValidRadix(radix);
        const instance = Object.create(FloatPrototype);
        instance.rndMode = rndMode;
        instance.precisionBits = precisionBits;
        instance.radix = radix;
        instance.mpfr_t = gmp.mpfr_t();
        gmp.mpfr_init2(instance.mpfr_t, precisionBits);
        if (val !== undefined && val !== null) {
            setValue(instance.mpfr_t, rndMode, radix, val);
        }
        mpfr_t_arr.push(instance.mpfr_t);
        return instance;
    };
    return {
        Float: FloatFn,
        isFloat: (val) => FloatPrototype.isPrototypeOf(val),
        Pi: (options) => {
            var _a;
            const n = FloatFn(null, options);
            gmp.mpfr_const_pi(n.mpfr_t, ((_a = options === null || options === void 0 ? void 0 : options.roundingMode) !== null && _a !== void 0 ? _a : globalRndMode));
            return n;
        },
        EulerConstant: (options) => {
            var _a;
            const n = FloatFn(null, options);
            gmp.mpfr_const_euler(n.mpfr_t, ((_a = options === null || options === void 0 ? void 0 : options.roundingMode) !== null && _a !== void 0 ? _a : globalRndMode));
            return n;
        },
        EulerNumber: (options) => {
            return FloatFn(1, options).exp();
        },
        Log2: (options) => {
            var _a;
            const n = FloatFn(null, options);
            gmp.mpfr_const_log2(n.mpfr_t, ((_a = options === null || options === void 0 ? void 0 : options.roundingMode) !== null && _a !== void 0 ? _a : globalRndMode));
            return n;
        },
        Catalan: (options) => {
            var _a;
            const n = FloatFn(null, options);
            gmp.mpfr_const_catalan(n.mpfr_t, ((_a = options === null || options === void 0 ? void 0 : options.roundingMode) !== null && _a !== void 0 ? _a : globalRndMode));
            return n;
        },
        destroy: () => {
            for (let i = mpfr_t_arr.length - 1; i >= 0; i--) {
                gmp.mpfr_clear(mpfr_t_arr[i]);
                gmp.mpfr_t_free(mpfr_t_arr[i]);
            }
            mpfr_t_arr.length = 0;
        }
    };
}

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
    var b = new u16(31);
    for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
    }
    // numbers here are at max 18 bits
    var r = new u32(b[30]);
    for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
            r[j] = ((j - b[i]) << 5) | i;
        }
    }
    return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
    // reverse table algorithm from SO
    var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
    x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
    x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
    rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
    var s = cd.length;
    // index
    var i = 0;
    // u16 "map": index -> # of codes with bit length = index
    var l = new u16(mb);
    // length of cd must be 288 (total # of codes)
    for (; i < s; ++i) {
        if (cd[i])
            ++l[cd[i] - 1];
    }
    // u16 "map": index -> minimum code for bit length = index
    var le = new u16(mb);
    for (i = 0; i < mb; ++i) {
        le[i] = (le[i - 1] + l[i - 1]) << 1;
    }
    var co;
    if (r) {
        // u16 "map": index -> number of actual bits, symbol for code
        co = new u16(1 << mb);
        // bits to remove for reverser
        var rvb = 15 - mb;
        for (i = 0; i < s; ++i) {
            // ignore 0 lengths
            if (cd[i]) {
                // num encoding both symbol and bits read
                var sv = (i << 4) | cd[i];
                // free bits
                var r_1 = mb - cd[i];
                // start value
                var v = le[cd[i] - 1]++ << r_1;
                // m is end value
                for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
                    // every 16 bit value starting with the code yields the same result
                    co[rev[v] >>> rvb] = sv;
                }
            }
        }
    }
    else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
            if (cd[i]) {
                co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
            }
        }
    }
    return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
    flt[i] = 8;
for (var i = 144; i < 256; ++i)
    flt[i] = 9;
for (var i = 256; i < 280; ++i)
    flt[i] = 7;
for (var i = 280; i < 288; ++i)
    flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
    fdt[i] = 5;
// fixed length map
var flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
    var m = a[0];
    for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
            m = a[i];
    }
    return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
    var o = (p / 8) | 0;
    return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p + 7) / 8) | 0; };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
    if (s == null || s < 0)
        s = 0;
    if (e == null || e > v.length)
        e = v.length;
    // can't use .constructor in case user-supplied
    var n = new (v.BYTES_PER_ELEMENT == 2 ? u16 : v.BYTES_PER_ELEMENT == 4 ? u32 : u8)(e - s);
    n.set(v.subarray(s, e));
    return n;
};
// error codes
var ec = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data'
    // determined by unknown compression method
];
var err = function (ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
    if (!nt)
        throw e;
    return e;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
    // source length
    var sl = dat.length;
    if (!sl || (st && st.f && !st.l))
        return buf || new u8(0);
    // have to estimate size
    var noBuf = !buf || st;
    // no state
    var noSt = !st || st.i;
    if (!st)
        st = {};
    // Assumes roughly 33% compression ratio average
    if (!buf)
        buf = new u8(sl * 3);
    // ensure buffer can fit at least l elements
    var cbuf = function (l) {
        var bl = buf.length;
        // need to increase size to fit
        if (l > bl) {
            // Double or set to necessary, whichever is greater
            var nbuf = new u8(Math.max(bl * 2, l));
            nbuf.set(buf);
            buf = nbuf;
        }
    };
    //  last chunk         bitpos           bytes
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    // total bits
    var tbts = sl * 8;
    do {
        if (!lm) {
            // BFINAL - this is only 1 when last chunk is next
            final = bits(dat, pos, 1);
            // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
            var type = bits(dat, pos + 1, 3);
            pos += 3;
            if (!type) {
                // go to end of byte boundary
                var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
                if (t > sl) {
                    if (noSt)
                        err(0);
                    break;
                }
                // ensure size
                if (noBuf)
                    cbuf(bt + l);
                // Copy over uncompressed data
                buf.set(dat.subarray(s, t), bt);
                // Get new bitpos, update byte count
                st.b = bt += l, st.p = pos = t * 8, st.f = final;
                continue;
            }
            else if (type == 1)
                lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
            else if (type == 2) {
                //  literal                            lengths
                var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
                var tl = hLit + bits(dat, pos + 5, 31) + 1;
                pos += 14;
                // length+distance tree
                var ldt = new u8(tl);
                // code length tree
                var clt = new u8(19);
                for (var i = 0; i < hcLen; ++i) {
                    // use index map to get real code
                    clt[clim[i]] = bits(dat, pos + i * 3, 7);
                }
                pos += hcLen * 3;
                // code lengths bits
                var clb = max(clt), clbmsk = (1 << clb) - 1;
                // code lengths map
                var clm = hMap(clt, clb, 1);
                for (var i = 0; i < tl;) {
                    var r = clm[bits(dat, pos, clbmsk)];
                    // bits read
                    pos += r & 15;
                    // symbol
                    var s = r >>> 4;
                    // code length to copy
                    if (s < 16) {
                        ldt[i++] = s;
                    }
                    else {
                        //  copy   count
                        var c = 0, n = 0;
                        if (s == 16)
                            n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                        else if (s == 17)
                            n = 3 + bits(dat, pos, 7), pos += 3;
                        else if (s == 18)
                            n = 11 + bits(dat, pos, 127), pos += 7;
                        while (n--)
                            ldt[i++] = c;
                    }
                }
                //    length tree                 distance tree
                var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
                // max length bits
                lbt = max(lt);
                // max dist bits
                dbt = max(dt);
                lm = hMap(lt, lbt, 1);
                dm = hMap(dt, dbt, 1);
            }
            else
                err(1);
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
        }
        // Make sure the buffer can hold this + the largest possible addition
        // Maximum chunk size (practically, theoretically infinite) is 2^17;
        if (noBuf)
            cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (;; lpos = pos) {
            // bits read, code
            var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
            pos += c & 15;
            if (pos > tbts) {
                if (noSt)
                    err(0);
                break;
            }
            if (!c)
                err(2);
            if (sym < 256)
                buf[bt++] = sym;
            else if (sym == 256) {
                lpos = pos, lm = null;
                break;
            }
            else {
                var add = sym - 254;
                // no extra bits needed if less
                if (sym > 264) {
                    // index
                    var i = sym - 257, b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) + fl[i];
                    pos += b;
                }
                // dist
                var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
                if (!d)
                    err(3);
                pos += d & 15;
                var dt = fd[dsym];
                if (dsym > 3) {
                    var b = fdeb[dsym];
                    dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
                }
                if (pos > tbts) {
                    if (noSt)
                        err(0);
                    break;
                }
                if (noBuf)
                    cbuf(bt + 131072);
                var end = bt + add;
                for (; bt < end; bt += 4) {
                    buf[bt] = buf[bt - dt];
                    buf[bt + 1] = buf[bt + 1 - dt];
                    buf[bt + 2] = buf[bt + 2 - dt];
                    buf[bt + 3] = buf[bt + 3 - dt];
                }
                bt = end;
            }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
            final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt == buf.length ? buf : slc(buf, 0, bt);
};
// empty
var et = /*#__PURE__*/ new u8(0);
/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function inflateSync(data, out) {
    return inflt(data, out);
}
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
    td.decode(et, { stream: true });
    tds = 1;
}
catch (e) { }

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Lookup = new Uint8Array(256);
for (let i = 0; i < base64Chars.length; i++) {
    base64Lookup[base64Chars.charCodeAt(i)] = i;
}
function getDecodeBase64Length(data) {
    let bufferLength = Math.floor(data.length * 0.75);
    const len = data.length;
    if (data[len - 1] === '=') {
        bufferLength -= 1;
        if (data[len - 2] === '=') {
            bufferLength -= 1;
        }
    }
    return bufferLength;
}
function decodeBase64(data) {
    const bufferLength = getDecodeBase64Length(data);
    const len = data.length;
    const bytes = new Uint8Array(bufferLength);
    let p = 0;
    for (let i = 0; i < len; i += 4) {
        const encoded1 = base64Lookup[data.charCodeAt(i)];
        const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
        const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
        const encoded4 = base64Lookup[data.charCodeAt(i + 3)];
        bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
        p += 1;
        bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        p += 1;
        bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        p += 1;
    }
    return bytes;
}

const gmpWasmLength = 560789;
const gmpWasm = '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';

let instance = null;
let compiledModule = null;
const decompressAndCompile = () => __awaiter(void 0, void 0, void 0, function* () {
    if (compiledModule)
        return;
    // console.time('decompress');
    const decoded = decodeBase64(gmpWasm);
    const decompressed = new Uint8Array(gmpWasmLength);
    inflateSync(decoded, decompressed);
    // console.timeEnd('decompress');
    // console.time('compile');
    compiledModule = yield WebAssembly.compile(decompressed);
    // console.timeEnd('compile');
});
const getBinding = (reset = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (!reset && instance !== null) {
        return instance;
    }
    if (typeof WebAssembly === 'undefined') {
        throw new Error('WebAssembly is not supported in this environment!');
    }
    yield decompressAndCompile();
    const heap = { HEAP8: new Uint8Array(0) };
    const errorHandler = () => {
        throw new Error('Fatal error in gmp-wasm');
    };
    const wasmInstance = yield WebAssembly.instantiate(compiledModule, {
        env: {
            emscripten_notify_memory_growth: () => {
                heap.HEAP8 = new Uint8Array(wasmInstance.exports.memory.buffer);
            },
        },
        wasi_snapshot_preview1: {
            proc_exit: errorHandler,
            fd_write: errorHandler,
            fd_seek: errorHandler,
            fd_close: errorHandler,
        },
    });
    const exports = wasmInstance.exports;
    exports._initialize();
    heap.HEAP8 = new Uint8Array(wasmInstance.exports.memory.buffer);
    instance = Object.assign({ heap }, exports);
    return instance;
});

const decoder = new TextDecoder();
const encoder = new TextEncoder();
const PREALLOCATED_STR_SIZE = 2 * 1024;
function getGMPInterface() {
    return __awaiter(this, void 0, void 0, function* () {
        let gmp = yield getBinding();
        let strBuf = gmp.g_malloc(PREALLOCATED_STR_SIZE);
        let mpfr_exp_t_ptr = gmp.g_malloc(4);
        const getStringPointer = (input) => {
            const data = encoder.encode(input);
            let srcPtr = strBuf;
            if (data.length + 1 > PREALLOCATED_STR_SIZE) {
                srcPtr = gmp.g_malloc(data.length + 1);
            }
            gmp.heap.HEAP8.set(data, srcPtr);
            gmp.heap.HEAP8[srcPtr + data.length] = 0;
            return srcPtr;
        };
        return {
            reset: () => __awaiter(this, void 0, void 0, function* () {
                gmp = yield getBinding(true);
                strBuf = gmp.g_malloc(PREALLOCATED_STR_SIZE);
                mpfr_exp_t_ptr = gmp.g_malloc(4);
            }),
            malloc: (size) => gmp.g_malloc(size),
            malloc_cstr: (str) => {
                const buf = encoder.encode(str);
                const ptr = gmp.g_malloc(buf.length + 1);
                gmp.heap.HEAP8.set(buf, ptr);
                gmp.heap.HEAP8[ptr + buf.length] = 0;
                return ptr;
            },
            free: (ptr) => gmp.g_free(ptr),
            get mem() { return gmp.heap.HEAP8; },
            get memView() { return new DataView(gmp.heap.HEAP8.buffer, gmp.heap.HEAP8.byteOffset, gmp.heap.HEAP8.byteLength); },
            /**************** Random number routines.  ****************/
            /** Initialize state with a default algorithm. */
            gmp_randinit_default: (state) => { gmp.g_randinit_default(state); },
            /** Initialize state with a linear congruential algorithm X = (aX + c) mod 2^m2exp. */
            gmp_randinit_lc_2exp: (state, a, c, m2exp) => { gmp.g_randinit_lc_2exp(state, a, c, m2exp); },
            /** Initialize state for a linear congruential algorithm as per gmp_randinit_lc_2exp. */
            gmp_randinit_lc_2exp_size: (state, size) => { return gmp.g_randinit_lc_2exp_size(state, size); },
            /** Initialize state for a Mersenne Twister algorithm. */
            gmp_randinit_mt: (state) => { gmp.g_randinit_mt(state); },
            /** Initialize rop with a copy of the algorithm and state from op. */
            gmp_randinit_set: (rop, op) => { gmp.g_randinit_set(rop, op); },
            /** Set an initial seed value into state. */
            gmp_randseed: (state, seed) => { gmp.g_randseed(state, seed); },
            /** Set an initial seed value into state. */
            gmp_randseed_ui: (state, seed) => { gmp.g_randseed_ui(state, seed); },
            /** Free all memory occupied by state. */
            gmp_randclear: (state) => { gmp.g_randclear(state); },
            /** Generate a uniformly distributed random number of n bits, i.e. in the range 0 to 2^n - 1 inclusive. */
            gmp_urandomb_ui: (state, n) => { return gmp.g_urandomb_ui(state, n); },
            /** Generate a uniformly distributed random number in the range 0 to n - 1, inclusive. */
            gmp_urandomm_ui: (state, n) => { return gmp.g_urandomm_ui(state, n); },
            /**************** Formatted output routines.  ****************/
            /**************** Formatted input routines.  ****************/
            /**************** Integer (i.e. Z) routines.  ****************/
            /** Get GMP limb size */
            mp_bits_per_limb: () => gmp.z_limb_size(),
            /** Allocates memory for the mpfr_t C struct and returns pointer */
            mpz_t: () => gmp.z_t(),
            /** Deallocates memory of a mpfr_t C struct */
            mpz_t_free: (ptr) => { gmp.z_t_free(ptr); },
            /** Deallocates memory of a NULL-terminated list of mpfr_t variables */
            mpz_t_frees: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.z_t_free(ptrs[i]);
                }
            },
            /** Set rop to the absolute value of op. */
            mpz_abs: (rop, op) => { gmp.z_abs(rop, op); },
            /** Set rop to op1 + op2. */
            mpz_add: (rop, op1, op2) => { gmp.z_add(rop, op1, op2); },
            /** Set rop to op1 + op2. */
            mpz_add_ui: (rop, op1, op2) => { gmp.z_add_ui(rop, op1, op2); },
            /** Set rop to rop + op1 * op2. */
            mpz_addmul: (rop, op1, op2) => { gmp.z_addmul(rop, op1, op2); },
            /** Set rop to rop + op1 * op2. */
            mpz_addmul_ui: (rop, op1, op2) => { gmp.z_addmul_ui(rop, op1, op2); },
            /** Set rop to op1 bitwise-and op2. */
            mpz_and: (rop, op1, op2) => { gmp.z_and(rop, op1, op2); },
            /** Compute the binomial coefficient n over k and store the result in rop. */
            mpz_bin_ui: (rop, n, k) => { gmp.z_bin_ui(rop, n, k); },
            /** Compute the binomial coefficient n over k and store the result in rop. */
            mpz_bin_uiui: (rop, n, k) => { gmp.z_bin_uiui(rop, n, k); },
            /** Set the quotient q to ceiling(n / d). */
            mpz_cdiv_q: (q, n, d) => { gmp.z_cdiv_q(q, n, d); },
            /** Set the quotient q to ceiling(n / 2^b). */
            mpz_cdiv_q_2exp: (q, n, b) => { gmp.z_cdiv_q_2exp(q, n, b); },
            /** Set the quotient q to ceiling(n / d), and return the remainder r = | n - q * d |. */
            mpz_cdiv_q_ui: (q, n, d) => gmp.z_cdiv_q_ui(q, n, d),
            /** Set the quotient q to ceiling(n / d), and set the remainder r to n - q * d. */
            mpz_cdiv_qr: (q, r, n, d) => { gmp.z_cdiv_qr(q, r, n, d); },
            /** Set quotient q to ceiling(n / d), set the remainder r to n - q * d, and return | r |. */
            mpz_cdiv_qr_ui: (q, r, n, d) => gmp.z_cdiv_qr_ui(q, r, n, d),
            /** Set the remainder r to n - q * d where q = ceiling(n / d). */
            mpz_cdiv_r: (r, n, d) => { gmp.z_cdiv_r(r, n, d); },
            /** Set the remainder r to n - q * 2^b where q = ceiling(n / 2^b). */
            mpz_cdiv_r_2exp: (r, n, b) => { gmp.z_cdiv_r_2exp(r, n, b); },
            /** Set the remainder r to n - q * d where q = ceiling(n / d), and return | r |. */
            mpz_cdiv_r_ui: (r, n, d) => gmp.z_cdiv_r_ui(r, n, d),
            /** Return the remainder | r | where r = n - q * d, and where q = ceiling(n / d). */
            mpz_cdiv_ui: (n, d) => gmp.z_cdiv_ui(n, d),
            /** Free the space occupied by x. */
            mpz_clear: (x) => { gmp.z_clear(x); },
            /** Free the space occupied by a NULL-terminated list of mpz_t variables. */
            mpz_clears: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.z_clear(ptrs[i]);
                }
            },
            /** Clear bit bit_index in rop. */
            mpz_clrbit: (rop, bit_index) => { gmp.z_clrbit(rop, bit_index); },
            /** Compare op1 and op2. */
            mpz_cmp: (op1, op2) => gmp.z_cmp(op1, op2),
            /** Compare op1 and op2. */
            mpz_cmp_d: (op1, op2) => gmp.z_cmp_d(op1, op2),
            /** Compare op1 and op2. */
            mpz_cmp_si: (op1, op2) => gmp.z_cmp_si(op1, op2),
            /** Compare op1 and op2. */
            mpz_cmp_ui: (op1, op2) => gmp.z_cmp_ui(op1, op2),
            /** Compare the absolute values of op1 and op2. */
            mpz_cmpabs: (op1, op2) => gmp.z_cmpabs(op1, op2),
            /** Compare the absolute values of op1 and op2. */
            mpz_cmpabs_d: (op1, op2) => gmp.z_cmpabs_d(op1, op2),
            /** Compare the absolute values of op1 and op2. */
            mpz_cmpabs_ui: (op1, op2) => gmp.z_cmpabs_ui(op1, op2),
            /** Set rop to the one’s complement of op. */
            mpz_com: (rop, op) => { gmp.z_com(rop, op); },
            /** Complement bit bitIndex in rop. */
            mpz_combit: (rop, bitIndex) => { gmp.z_combit(rop, bitIndex); },
            /** Return non-zero if n is congruent to c modulo d. */
            mpz_congruent_p: (n, c, d) => gmp.z_congruent_p(n, c, d),
            /** Return non-zero if n is congruent to c modulo 2^b. */
            mpz_congruent_2exp_p: (n, c, b) => gmp.z_congruent_2exp_p(n, c, b),
            /** Return non-zero if n is congruent to c modulo d. */
            mpz_congruent_ui_p: (n, c, d) => gmp.z_congruent_ui_p(n, c, d),
            /** Set q to n / d when it is known in advance that d divides n. */
            mpz_divexact: (q, n, d) => { gmp.z_divexact(q, n, d); },
            /** Set q to n / d when it is known in advance that d divides n. */
            mpz_divexact_ui: (q, n, d) => { gmp.z_divexact_ui(q, n, d); },
            /** Return non-zero if n is exactly divisible by d. */
            mpz_divisible_p: (n, d) => gmp.z_divisible_p(n, d),
            /** Return non-zero if n is exactly divisible by d. */
            mpz_divisible_ui_p: (n, d) => gmp.z_divisible_ui_p(n, d),
            /** Return non-zero if n is exactly divisible by 2^b. */
            mpz_divisible_2exp_p: (n, b) => gmp.z_divisible_2exp_p(n, b),
            /** Determine whether op is even. */
            mpz_even_p: (op) => { gmp.z_even_p(op); },
            /** Fill rop with word data from op. */
            mpz_export: (rop, countp, order, size, endian, nails, op) => gmp.z_export(rop, countp, order, size, endian, nails, op),
            /** Set rop to the factorial n!. */
            mpz_fac_ui: (rop, n) => { gmp.z_fac_ui(rop, n); },
            /** Set rop to the double-factorial n!!. */
            mpz_2fac_ui: (rop, n) => { gmp.z_2fac_ui(rop, n); },
            /** Set rop to the m-multi-factorial n!^(m)n. */
            mpz_mfac_uiui: (rop, n, m) => { gmp.z_mfac_uiui(rop, n, m); },
            /** Set rop to the primorial of n, i.e. the product of all positive prime numbers ≤ n. */
            mpz_primorial_ui: (rop, n) => { gmp.z_primorial_ui(rop, n); },
            /** Set the quotient q to floor(n / d). */
            mpz_fdiv_q: (q, n, d) => { gmp.z_fdiv_q(q, n, d); },
            /** Set the quotient q to floor(n / 2^b). */
            mpz_fdiv_q_2exp: (q, n, b) => { gmp.z_fdiv_q_2exp(q, n, b); },
            /** Set the quotient q to floor(n / d), and return the remainder r = | n - q * d |. */
            mpz_fdiv_q_ui: (q, n, d) => gmp.z_fdiv_q_ui(q, n, d),
            /** Set the quotient q to floor(n / d), and set the remainder r to n - q * d. */
            mpz_fdiv_qr: (q, r, n, d) => { gmp.z_fdiv_qr(q, r, n, d); },
            /** Set quotient q to floor(n / d), set the remainder r to n - q * d, and return | r |. */
            mpz_fdiv_qr_ui: (q, r, n, d) => gmp.z_fdiv_qr_ui(q, r, n, d),
            /** Set the remainder r to n - q * d where q = floor(n / d). */
            mpz_fdiv_r: (r, n, d) => { gmp.z_fdiv_r(r, n, d); },
            /** Set the remainder r to n - q * 2^b where q = floor(n / 2^b). */
            mpz_fdiv_r_2exp: (r, n, b) => { gmp.z_fdiv_r_2exp(r, n, b); },
            /** Set the remainder r to n - q * d where q = floor(n / d), and return | r |. */
            mpz_fdiv_r_ui: (r, n, d) => gmp.z_fdiv_r_ui(r, n, d),
            /** Return the remainder | r | where r = n - q * d, and where q = floor(n / d). */
            mpz_fdiv_ui: (n, d) => gmp.z_fdiv_ui(n, d),
            /** Sets fn to to F[n], the n’th Fibonacci number. */
            mpz_fib_ui: (fn, n) => { gmp.z_fib_ui(fn, n); },
            /** Sets fn to F[n], and fnsub1 to F[n - 1]. */
            mpz_fib2_ui: (fn, fnsub1, n) => { gmp.z_fib2_ui(fn, fnsub1, n); },
            /** Return non-zero iff the value of op fits in a signed 32-bit integer. Otherwise, return zero. */
            mpz_fits_sint_p: (op) => gmp.z_fits_sint_p(op),
            /** Return non-zero iff the value of op fits in a signed 32-bit integer. Otherwise, return zero. */
            mpz_fits_slong_p: (op) => gmp.z_fits_slong_p(op),
            /** Return non-zero iff the value of op fits in a signed 16-bit integer. Otherwise, return zero. */
            mpz_fits_sshort_p: (op) => gmp.z_fits_sshort_p(op),
            /** Return non-zero iff the value of op fits in an unsigned 32-bit integer. Otherwise, return zero. */
            mpz_fits_uint_p: (op) => gmp.z_fits_uint_p(op),
            /** Return non-zero iff the value of op fits in an unsigned 32-bit integer. Otherwise, return zero. */
            mpz_fits_ulong_p: (op) => gmp.z_fits_ulong_p(op),
            /** Return non-zero iff the value of op fits in an unsigned 16-bit integer. Otherwise, return zero. */
            mpz_fits_ushort_p: (op) => gmp.z_fits_ushort_p(op),
            /** Set rop to the greatest common divisor of op1 and op2. */
            mpz_gcd: (rop, op1, op2) => { gmp.z_gcd(rop, op1, op2); },
            /** Compute the greatest common divisor of op1 and op2. If rop is not null, store the result there. */
            mpz_gcd_ui: (rop, op1, op2) => gmp.z_gcd_ui(rop, op1, op2),
            /** Set g to the greatest common divisor of a and b, and in addition set s and t to coefficients satisfying a * s + b * t = g. */
            mpz_gcdext: (g, s, t, a, b) => { gmp.z_gcdext(g, s, t, a, b); },
            /** Convert op to a double, truncating if necessary (i.e. rounding towards zero). */
            mpz_get_d: (op) => gmp.z_get_d(op),
            /** Convert op to a double, truncating if necessary (i.e. rounding towards zero), and returning the exponent separately. */
            mpz_get_d_2exp: (exp, op) => gmp.z_get_d_2exp(exp, op),
            /** Return the value of op as an signed long. */
            mpz_get_si: (op) => gmp.z_get_si(op),
            /** Convert op to a string of digits in base base. */
            mpz_get_str: (str, base, op) => gmp.z_get_str(str, base, op),
            /** Return the value of op as an unsigned long. */
            mpz_get_ui: (op) => gmp.z_get_ui(op),
            /** Return limb number n from op. */
            mpz_getlimbn: (op, n) => gmp.z_getlimbn(op, n),
            /** Return the hamming distance between the two operands. */
            mpz_hamdist: (op1, op2) => gmp.z_hamdist(op1, op2),
            /** Set rop from an array of word data at op. */
            mpz_import: (rop, count, order, size, endian, nails, op) => { gmp.z_import(rop, count, order, size, endian, nails, op); },
            /** Initialize x, and set its value to 0. */
            mpz_init: (x) => { gmp.z_init(x); },
            /** Initialize a NULL-terminated list of mpz_t variables, and set their values to 0. */
            mpz_inits: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.z_init(ptrs[i]);
                }
            },
            /** Initialize x, with space for n-bit numbers, and set its value to 0. */
            mpz_init2: (x, n) => { gmp.z_init2(x, n); },
            /** Initialize rop with limb space and set the initial numeric value from op. */
            mpz_init_set: (rop, op) => { gmp.z_init_set(rop, op); },
            /** Initialize rop with limb space and set the initial numeric value from op. */
            mpz_init_set_d: (rop, op) => { gmp.z_init_set_d(rop, op); },
            /** Initialize rop with limb space and set the initial numeric value from op. */
            mpz_init_set_si: (rop, op) => { gmp.z_init_set_si(rop, op); },
            /** Initialize rop and set its value like mpz_set_str. */
            mpz_init_set_str: (rop, str, base) => gmp.z_init_set_str(rop, str, base),
            /** Initialize rop with limb space and set the initial numeric value from op. */
            mpz_init_set_ui: (rop, op) => { gmp.z_init_set_ui(rop, op); },
            /** Compute the inverse of op1 modulo op2 and put the result in rop. */
            mpz_invert: (rop, op1, op2) => gmp.z_invert(rop, op1, op2),
            /** Set rop to op1 bitwise inclusive-or op2. */
            mpz_ior: (rop, op1, op2) => { gmp.z_ior(rop, op1, op2); },
            /** Calculate the Jacobi symbol (a/b). */
            mpz_jacobi: (a, b) => gmp.z_jacobi(a, b),
            /** Calculate the Jacobi symbol (a/b) with the Kronecker extension (a/2) = (2/a) when a odd, or (a/2) = 0 when a even. */
            mpz_kronecker: (a, b) => gmp.z_kronecker(a, b),
            /** Calculate the Jacobi symbol (a/b) with the Kronecker extension (a/2) = (2/a) when a odd, or (a/2) = 0 when a even. */
            mpz_kronecker_si: (a, b) => gmp.z_kronecker_si(a, b),
            /** Calculate the Jacobi symbol (a/b) with the Kronecker extension (a/2) = (2/a) when a odd, or (a/2) = 0 when a even. */
            mpz_kronecker_ui: (a, b) => gmp.z_kronecker_ui(a, b),
            /** Calculate the Jacobi symbol (a/b) with the Kronecker extension (a/2) = (2/a) when a odd, or (a/2) = 0 when a even. */
            mpz_si_kronecker: (a, b) => gmp.z_si_kronecker(a, b),
            /** Calculate the Jacobi symbol (a/b) with the Kronecker extension (a/2) = (2/a) when a odd, or (a/2) = 0 when a even. */
            mpz_ui_kronecker: (a, b) => gmp.z_ui_kronecker(a, b),
            /** Set rop to the least common multiple of op1 and op2. */
            mpz_lcm: (rop, op1, op2) => { gmp.z_lcm(rop, op1, op2); },
            /** Set rop to the least common multiple of op1 and op2. */
            mpz_lcm_ui: (rop, op1, op2) => { gmp.z_lcm_ui(rop, op1, op2); },
            /** Calculate the Legendre symbol (a/p). */
            mpz_legendre: (a, p) => gmp.z_legendre(a, p),
            /** Sets ln to to L[n], the n’th Lucas number. */
            mpz_lucnum_ui: (ln, n) => { gmp.z_lucnum_ui(ln, n); },
            /** Sets ln to L[n], and lnsub1 to L[n - 1]. */
            mpz_lucnum2_ui: (ln, lnsub1, n) => { gmp.z_lucnum2_ui(ln, lnsub1, n); },
            /** An implementation of the probabilistic primality test found in Knuth's Seminumerical Algorithms book. */
            mpz_millerrabin: (n, reps) => gmp.z_millerrabin(n, reps),
            /** Set r to n mod d. */
            mpz_mod: (r, n, d) => { gmp.z_mod(r, n, d); },
            /** Set r to n mod d. */
            mpz_mod_ui: (r, n, d) => { gmp.z_mod_ui(r, n, d); },
            /** Set rop to op1 * op2. */
            mpz_mul: (rop, op1, op2) => { gmp.z_mul(rop, op1, op2); },
            /** Set rop to op1 * 2^op2. */
            mpz_mul_2exp: (rop, op1, op2) => { gmp.z_mul_2exp(rop, op1, op2); },
            /** Set rop to op1 * op2. */
            mpz_mul_si: (rop, op1, op2) => { gmp.z_mul_si(rop, op1, op2); },
            /** Set rop to op1 * op2. */
            mpz_mul_ui: (rop, op1, op2) => { gmp.z_mul_ui(rop, op1, op2); },
            /** Set rop to -op. */
            mpz_neg: (rop, op) => { gmp.z_neg(rop, op); },
            /** Set rop to the next prime greater than op. */
            mpz_nextprime: (rop, op) => { gmp.z_nextprime(rop, op); },
            /** Determine whether op is odd. */
            mpz_odd_p: (op) => { gmp.z_odd_p(op); },
            /** Return non-zero if op is a perfect power, i.e., if there exist integers a and b, with b > 1, such that op = a^b. */
            mpz_perfect_power_p: (op) => gmp.z_perfect_power_p(op),
            /** Return non-zero if op is a perfect square, i.e., if the square root of op is an integer. */
            mpz_perfect_square_p: (op) => gmp.z_perfect_square_p(op),
            /** Return the population count of op. */
            mpz_popcount: (op) => gmp.z_popcount(op),
            /** Set rop to base^exp. The case 0^0 yields 1. */
            mpz_pow_ui: (rop, base, exp) => { gmp.z_pow_ui(rop, base, exp); },
            /** Set rop to (base^exp) modulo mod. */
            mpz_powm: (rop, base, exp, mod) => { gmp.z_powm(rop, base, exp, mod); },
            /** Set rop to (base^exp) modulo mod. */
            mpz_powm_sec: (rop, base, exp, mod) => { gmp.z_powm_sec(rop, base, exp, mod); },
            /** Set rop to (base^exp) modulo mod. */
            mpz_powm_ui: (rop, base, exp, mod) => { gmp.z_powm_ui(rop, base, exp, mod); },
            /** Determine whether n is prime. */
            mpz_probab_prime_p: (n, reps) => gmp.z_probab_prime_p(n, reps),
            /** Generate a random integer of at most maxSize limbs. */
            mpz_random: (rop, maxSize) => { gmp.z_random(rop, maxSize); },
            /** Generate a random integer of at most maxSize limbs, with long strings of zeros and ones in the binary representation. */
            mpz_random2: (rop, maxSize) => { gmp.z_random2(rop, maxSize); },
            /** Change the space allocated for x to n bits. */
            mpz_realloc2: (x, n) => { gmp.z_realloc2(x, n); },
            /** Remove all occurrences of the factor f from op and store the result in rop. */
            mpz_remove: (rop, op, f) => gmp.z_remove(rop, op, f),
            /** Set rop to the truncated integer part of the nth root of op. */
            mpz_root: (rop, op, n) => gmp.z_root(rop, op, n),
            /** Set root to the truncated integer part of the nth root of u. Set rem to the remainder, u - root^n. */
            mpz_rootrem: (root, rem, u, n) => { gmp.z_rootrem(root, rem, u, n); },
            /** Generate a random integer with long strings of zeros and ones in the binary representation. */
            mpz_rrandomb: (rop, state, n) => { gmp.z_rrandomb(rop, state, n); },
            /** Scan op for 0 bit. */
            mpz_scan0: (op, startingBit) => gmp.z_scan0(op, startingBit),
            /** Scan op for 1 bit. */
            mpz_scan1: (op, startingBit) => gmp.z_scan1(op, startingBit),
            /** Set the value of rop from op. */
            mpz_set: (rop, op) => { gmp.z_set(rop, op); },
            /** Set the value of rop from op. */
            mpz_set_d: (rop, op) => { gmp.z_set_d(rop, op); },
            /** Set the value of rop from op. */
            mpz_set_q: (rop, op) => { gmp.z_set_q(rop, op); },
            /** Set the value of rop from op. */
            mpz_set_si: (rop, op) => { gmp.z_set_si(rop, op); },
            /** Set the value of rop from str, a null-terminated C string in base base. */
            mpz_set_str: (rop, str, base) => gmp.z_set_str(rop, str, base),
            /** Set the value of rop from op. */
            mpz_set_ui: (rop, op) => { gmp.z_set_ui(rop, op); },
            /** Set bit bitIndex in rop. */
            mpz_setbit: (rop, bitIndex) => { gmp.z_setbit(rop, bitIndex); },
            /** Return +1 if op > 0, 0 if op = 0, and -1 if op < 0. */
            mpz_sgn: (op) => gmp.z_sgn(op),
            /** Return the size of op measured in number of limbs. */
            mpz_size: (op) => gmp.z_size(op),
            /** Return the size of op measured in number of digits in the given base. */
            mpz_sizeinbase: (op, base) => gmp.z_sizeinbase(op, base),
            /** Set rop to the truncated integer part of the square root of op. */
            mpz_sqrt: (rop, op) => { gmp.z_sqrt(rop, op); },
            /** Set rop1 to the truncated integer part of the square root of op, like mpz_sqrt. Set rop2 to the remainder op - rop1 * rop1, which will be zero if op is a perfect square. */
            mpz_sqrtrem: (rop1, rop2, op) => { gmp.z_sqrtrem(rop1, rop2, op); },
            /** Set rop to op1 - op2. */
            mpz_sub: (rop, op1, op2) => { gmp.z_sub(rop, op1, op2); },
            /** Set rop to op1 - op2. */
            mpz_sub_ui: (rop, op1, op2) => { gmp.z_sub_ui(rop, op1, op2); },
            /** Set rop to op1 - op2. */
            mpz_ui_sub: (rop, op1, op2) => { gmp.z_ui_sub(rop, op1, op2); },
            /** Set rop to rop - op1 * op2. */
            mpz_submul: (rop, op1, op2) => { gmp.z_submul(rop, op1, op2); },
            /** Set rop to rop - op1 * op2. */
            mpz_submul_ui: (rop, op1, op2) => { gmp.z_submul_ui(rop, op1, op2); },
            /** Swap the values rop1 and rop2 efficiently. */
            mpz_swap: (rop1, rop2) => { gmp.z_swap(rop1, rop2); },
            /** Return the remainder | r | where r = n - q * d, and where q = trunc(n / d). */
            mpz_tdiv_ui: (n, d) => gmp.z_tdiv_ui(n, d),
            /** Set the quotient q to trunc(n / d). */
            mpz_tdiv_q: (q, n, d) => { gmp.z_tdiv_q(q, n, d); },
            /** Set the quotient q to trunc(n / 2^b). */
            mpz_tdiv_q_2exp: (q, n, b) => { gmp.z_tdiv_q_2exp(q, n, b); },
            /** Set the quotient q to trunc(n / d), and return the remainder r = | n - q * d |. */
            mpz_tdiv_q_ui: (q, n, d) => gmp.z_tdiv_q_ui(q, n, d),
            /** Set the quotient q to trunc(n / d), and set the remainder r to n - q * d. */
            mpz_tdiv_qr: (q, r, n, d) => { gmp.z_tdiv_qr(q, r, n, d); },
            /** Set quotient q to trunc(n / d), set the remainder r to n - q * d, and return | r |. */
            mpz_tdiv_qr_ui: (q, r, n, d) => { return gmp.z_tdiv_qr_ui(q, r, n, d); },
            /** Set the remainder r to n - q * d where q = trunc(n / d). */
            mpz_tdiv_r: (r, n, d) => { gmp.z_tdiv_r(r, n, d); },
            /** Set the remainder r to n - q * 2^b where q = trunc(n / 2^b). */
            mpz_tdiv_r_2exp: (r, n, b) => { gmp.z_tdiv_r_2exp(r, n, b); },
            /** Set the remainder r to n - q * d where q = trunc(n / d), and return | r |. */
            mpz_tdiv_r_ui: (r, n, d) => gmp.z_tdiv_r_ui(r, n, d),
            /** Test bit bitIndex in op and return 0 or 1 accordingly. */
            mpz_tstbit: (op, bitIndex) => gmp.z_tstbit(op, bitIndex),
            /** Set rop to base^exp. The case 0^0 yields 1. */
            mpz_ui_pow_ui: (rop, base, exp) => { gmp.z_ui_pow_ui(rop, base, exp); },
            /** Generate a uniformly distributed random integer in the range 0 to 2^n - 1, inclusive. */
            mpz_urandomb: (rop, state, n) => { gmp.z_urandomb(rop, state, n); },
            /** Generate a uniform random integer in the range 0 to n - 1, inclusive. */
            mpz_urandomm: (rop, state, n) => { gmp.z_urandomm(rop, state, n); },
            /** Set rop to op1 bitwise exclusive-or op2. */
            mpz_xor: (rop, op1, op2) => { gmp.z_xor(rop, op1, op2); },
            /** Return a pointer to the limb array representing the absolute value of x. */
            mpz_limbs_read: (x) => gmp.z_limbs_read(x),
            /** Return a pointer to the limb array of x, intended for write access. */
            mpz_limbs_write: (x, n) => gmp.z_limbs_write(x, n),
            /** Return a pointer to the limb array of x, intended for write access. */
            mpz_limbs_modify: (x, n) => gmp.z_limbs_modify(x, n),
            /** Updates the internal size field of x. */
            mpz_limbs_finish: (x, s) => { gmp.z_limbs_finish(x, s); },
            /** Special initialization of x, using the given limb array and size. */
            mpz_roinit_n: (x, xp, xs) => gmp.z_roinit_n(x, xp, xs),
            /**************** Rational (i.e. Q) routines.  ****************/
            /** Allocates memory for the mpq_t C struct and returns pointer */
            mpq_t: () => gmp.q_t(),
            /** Deallocates memory of a mpq_t C struct */
            mpq_t_free: (mpq_ptr) => { gmp.q_t_free(mpq_ptr); },
            /** Deallocates memory of a NULL-terminated list of mpq_t variables */
            mpq_t_frees: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.q_t_free(ptrs[i]);
                }
            },
            /** Set rop to the absolute value of op. */
            mpq_abs: (rop, op) => { gmp.q_abs(rop, op); },
            /** Set sum to addend1 + addend2. */
            mpq_add: (sum, addend1, addend2) => { gmp.q_add(sum, addend1, addend2); },
            /** Remove any factors that are common to the numerator and denominator of op, and make the denominator positive. */
            mpq_canonicalize: (op) => { gmp.q_canonicalize(op); },
            /** Free the space occupied by x. */
            mpq_clear: (x) => { gmp.q_clear(x); },
            /** Free the space occupied by a NULL-terminated list of mpq_t variables. */
            mpq_clears: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.q_clear(ptrs[i]);
                }
            },
            /** Compare op1 and op2. */
            mpq_cmp: (op1, op2) => gmp.q_cmp(op1, op2),
            /** Compare op1 and num2 / den2. */
            mpq_cmp_si: (op1, num2, den2) => gmp.q_cmp_si(op1, num2, den2),
            /** Compare op1 and num2 / den2. */
            mpq_cmp_ui: (op1, num2, den2) => gmp.q_cmp_ui(op1, num2, den2),
            /** Compare op1 and op2. */
            mpq_cmp_z: (op1, op2) => gmp.q_cmp_z(op1, op2),
            /** Set quotient to dividend / divisor. */
            mpq_div: (quotient, dividend, divisor) => { gmp.q_div(quotient, dividend, divisor); },
            /** Set rop to op1 / 2^op2. */
            mpq_div_2exp: (rop, op1, op2) => { gmp.q_div_2exp(rop, op1, op2); },
            /** Return non-zero if op1 and op2 are equal, zero if they are non-equal. */
            mpq_equal: (op1, op2) => gmp.q_equal(op1, op2),
            /** Set numerator to the numerator of rational. */
            mpq_get_num: (numerator, rational) => { gmp.q_get_num(numerator, rational); },
            /** Set denominator to the denominator of rational. */
            mpq_get_den: (denominator, rational) => { gmp.q_get_den(denominator, rational); },
            /** Convert op to a double, truncating if necessary (i.e. rounding towards zero). */
            mpq_get_d: (op) => gmp.q_get_d(op),
            /** Convert op to a string of digits in base base. */
            mpq_get_str: (str, base, op) => gmp.q_get_str(str, base, op),
            /** Initialize x and set it to 0/1. */
            mpq_init: (x) => { gmp.q_init(x); },
            /** Initialize a NULL-terminated list of mpq_t variables, and set their values to 0/1. */
            mpq_inits: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.q_init(ptrs[i]);
                }
            },
            /** Set inverted_number to 1 / number. */
            mpq_inv: (inverted_number, number) => { gmp.q_inv(inverted_number, number); },
            /** Set product to multiplier * multiplicand. */
            mpq_mul: (product, multiplier, multiplicand) => { gmp.q_mul(product, multiplier, multiplicand); },
            /** Set rop to op1 * 2*op2. */
            mpq_mul_2exp: (rop, op1, op2) => { gmp.q_mul_2exp(rop, op1, op2); },
            /** Set negated_operand to -operand. */
            mpq_neg: (negated_operand, operand) => { gmp.q_neg(negated_operand, operand); },
            /** Assign rop from op. */
            mpq_set: (rop, op) => { gmp.q_set(rop, op); },
            /** Set rop to the value of op. There is no rounding, this conversion is exact. */
            mpq_set_d: (rop, op) => { gmp.q_set_d(rop, op); },
            /** Set the denominator of rational to denominator. */
            mpq_set_den: (rational, denominator) => { gmp.q_set_den(rational, denominator); },
            /** Set the numerator of rational to numerator. */
            mpq_set_num: (rational, numerator) => { gmp.q_set_num(rational, numerator); },
            /** Set the value of rop to op1 / op2. */
            mpq_set_si: (rop, op1, op2) => { gmp.q_set_si(rop, op1, op2); },
            /** Set rop from a null-terminated string str in the given base. */
            mpq_set_str: (rop, str, base) => gmp.q_set_str(rop, str, base),
            /** Set the value of rop to op1 / op2. */
            mpq_set_ui: (rop, op1, op2) => { gmp.q_set_ui(rop, op1, op2); },
            /** Assign rop from op. */
            mpq_set_z: (rop, op) => { gmp.q_set_z(rop, op); },
            /** Return +1 if op > 0, 0 if op = 0, and -1 if op < 0. */
            mpq_sgn: (op) => gmp.q_sgn(op),
            /** Set difference to minuend - subtrahend. */
            mpq_sub: (difference, minuend, subtrahend) => { gmp.q_sub(difference, minuend, subtrahend); },
            /** Swap the values rop1 and rop2 efficiently. */
            mpq_swap: (rop1, rop2) => { gmp.q_swap(rop1, rop2); },
            /** Return a reference to the numerator of op. */
            mpq_numref: (op) => gmp.q_numref(op),
            /** Return a reference to the denominator of op. */
            mpq_denref: (op) => gmp.q_denref(op),
            /**************** MPFR  ****************/
            /** Allocates memory for the mpfr_t C struct and returns pointer */
            mpfr_t: () => gmp.r_t(),
            /** Deallocates memory of a mpfr_t C struct */
            mpfr_t_free: (mpfr_ptr) => { gmp.r_t_free(mpfr_ptr); },
            /** Deallocates memory of a NULL-terminated list of mpfr_t variables */
            mpfr_t_frees: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.r_t_free(ptrs[i]);
                }
            },
            /** Return the MPFR version, as a null-terminated string. */
            mpfr_get_version: () => gmp.r_get_version(),
            /** Return a null-terminated string containing the ids of the patches applied to the MPFR library (contents of the PATCHES file), separated by spaces. */
            mpfr_get_patches: () => gmp.r_get_patches(),
            /** Return a non-zero value if MPFR was compiled as thread safe using compiler-level Thread Local Storage, return zero otherwise. */
            mpfr_buildopt_tls_p: () => gmp.r_buildopt_tls_p(),
            /** Return a non-zero value if MPFR was compiled with ‘__float128’ support, return zero otherwise. */
            mpfr_buildopt_float128_p: () => gmp.r_buildopt_float128_p(),
            /** Return a non-zero value if MPFR was compiled with decimal float support, return zero otherwise. */
            mpfr_buildopt_decimal_p: () => gmp.r_buildopt_decimal_p(),
            /** Return a non-zero value if MPFR was compiled with GMP internals, return zero otherwise. */
            mpfr_buildopt_gmpinternals_p: () => gmp.r_buildopt_gmpinternals_p(),
            /** Return a non-zero value if MPFR was compiled so that all threads share the same cache for one MPFR constant, return zero otherwise. */
            mpfr_buildopt_sharedcache_p: () => gmp.r_buildopt_sharedcache_p(),
            /** Return a string saying which thresholds file has been used at compile time. */
            mpfr_buildopt_tune_case: () => gmp.r_buildopt_tune_case(),
            /** Return the (current) smallest exponent allowed for a floating-point variable. */
            mpfr_get_emin: () => gmp.r_get_emin(),
            /** Set the smallest exponent allowed for a floating-point variable. */
            mpfr_set_emin: (exp) => gmp.r_set_emin(exp),
            /** Return the minimum exponent allowed for mpfr_set_emin. */
            mpfr_get_emin_min: () => gmp.r_get_emin_min(),
            /** Return the maximum exponent allowed for mpfr_set_emin. */
            mpfr_get_emin_max: () => gmp.r_get_emin_max(),
            /** Return the (current) largest exponent allowed for a floating-point variable. */
            mpfr_get_emax: () => gmp.r_get_emax(),
            /** Set the largest exponent allowed for a floating-point variable. */
            mpfr_set_emax: (exp) => gmp.r_set_emax(exp),
            /** Return the minimum exponent allowed for mpfr_set_emax. */
            mpfr_get_emax_min: () => gmp.r_get_emax_min(),
            /** Return the maximum exponent allowed for mpfr_set_emax. */
            mpfr_get_emax_max: () => gmp.r_get_emax_max(),
            /** Set the default rounding mode to rnd. */
            mpfr_set_default_rounding_mode: (rnd) => { gmp.r_set_default_rounding_mode(rnd); },
            /** Get the default rounding mode. */
            mpfr_get_default_rounding_mode: () => gmp.r_get_default_rounding_mode(),
            /** Return a string ("MPFR_RNDD", "MPFR_RNDU", "MPFR_RNDN", "MPFR_RNDZ", "MPFR_RNDA") corresponding to the rounding mode rnd, or a null pointer if rnd is an invalid rounding mode. */
            mpfr_print_rnd_mode: (rnd) => gmp.r_print_rnd_mode(rnd),
            /** Clear (lower) all global flags (underflow, overflow, divide-by-zero, invalid, inexact, erange). */
            mpfr_clear_flags: () => { gmp.r_clear_flags(); },
            /** Clear (lower) the underflow flag. */
            mpfr_clear_underflow: () => { gmp.r_clear_underflow(); },
            /** Clear (lower) the overflow flag. */
            mpfr_clear_overflow: () => { gmp.r_clear_overflow(); },
            /** Clear (lower) the divide-by-zero flag. */
            mpfr_clear_divby0: () => { gmp.r_clear_divby0(); },
            /** Clear (lower) the invalid flag. */
            mpfr_clear_nanflag: () => { gmp.r_clear_nanflag(); },
            /** Clear (lower) the inexact flag. */
            mpfr_clear_inexflag: () => { gmp.r_clear_inexflag(); },
            /** Clear (lower) the erange flag. */
            mpfr_clear_erangeflag: () => { gmp.r_clear_erangeflag(); },
            /** Set (raised) the underflow flag. */
            mpfr_set_underflow: () => { gmp.r_set_underflow(); },
            /** Set (raised) the overflow flag. */
            mpfr_set_overflow: () => { gmp.r_set_overflow(); },
            /** Set (raised) the divide-by-zero flag. */
            mpfr_set_divby0: () => { gmp.r_set_divby0(); },
            /** Set (raised) the invalid flag. */
            mpfr_set_nanflag: () => { gmp.r_set_nanflag(); },
            /** Set (raised) the inexact flag. */
            mpfr_set_inexflag: () => { gmp.r_set_inexflag(); },
            /** Set (raised) the erange flag. */
            mpfr_set_erangeflag: () => { gmp.r_set_erangeflag(); },
            /** Return the underflow flag, which is non-zero iff the flag is set. */
            mpfr_underflow_p: () => gmp.r_underflow_p(),
            /** Return the overflow flag, which is non-zero iff the flag is set. */
            mpfr_overflow_p: () => gmp.r_overflow_p(),
            /** Return the divide-by-zero flag, which is non-zero iff the flag is set. */
            mpfr_divby0_p: () => gmp.r_divby0_p(),
            /** Return the invalid flag, which is non-zero iff the flag is set. */
            mpfr_nanflag_p: () => gmp.r_nanflag_p(),
            /** Return the inexact flag, which is non-zero iff the flag is set. */
            mpfr_inexflag_p: () => gmp.r_inexflag_p(),
            /** Return the erange flag, which is non-zero iff the flag is set. */
            mpfr_erangeflag_p: () => gmp.r_erangeflag_p(),
            /** Clear (lower) the group of flags specified by mask. */
            mpfr_flags_clear: (mask) => { gmp.r_flags_clear(mask); },
            /** Set (raise) the group of flags specified by mask. */
            mpfr_flags_set: (mask) => { gmp.r_flags_set(mask); },
            /** Return the flags specified by mask. */
            mpfr_flags_test: (mask) => gmp.r_flags_test(mask),
            /** Return all the flags. */
            mpfr_flags_save: () => gmp.r_flags_save(),
            /** Restore the flags specified by mask to their state represented in flags. */
            mpfr_flags_restore: (flags, mask) => { gmp.r_flags_restore(flags, mask); },
            /** Check that x is within the current range of acceptable values. */
            mpfr_check_range: (x, t, rnd) => gmp.r_check_range(x, t, rnd),
            /** Initialize x, set its precision to be exactly prec bits and its value to NaN. */
            mpfr_init2: (x, prec) => { gmp.r_init2(x, prec); },
            /** Initialize all the mpfr_t variables of the given variable argument x, set their precision to be exactly prec bits and their value to NaN. */
            mpfr_inits2: (prec, ...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.r_init2(ptrs[i], prec);
                }
            },
            /** Initialize x, set its precision to the default precision, and set its value to NaN. */
            mpfr_init: (x) => { gmp.r_init(x); },
            /** Initialize all the mpfr_t variables of the given list x, set their precision to the default precision and their value to NaN. */
            mpfr_inits: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.r_init(ptrs[i]);
                }
            },
            /** Free the space occupied by the significand of x. */
            mpfr_clear: (x) => { gmp.r_clear(x); },
            /** Free the space occupied by all the mpfr_t variables of the given list x. */
            mpfr_clears: (...ptrs) => {
                for (let i = 0; i < ptrs.length; i++) {
                    if (!ptrs[i])
                        return;
                    gmp.r_clear(ptrs[i]);
                }
            },
            /** Round x according to rnd with precision prec, which must be an integer between MPFR_PREC_MIN and MPFR_PREC_MAX (otherwise the behavior is undefined). */
            mpfr_prec_round: (x, prec, rnd) => gmp.r_prec_round(x, prec, rnd),
            /** Return non-zero value if one is able to round correctly x to precision prec with the direction rnd2, and 0 otherwise. */
            mpfr_can_round: (b, err, rnd1, rnd2, prec) => gmp.r_can_round(b, err, rnd1, rnd2, prec),
            /** Return the minimal number of bits required to store the significand of x, and 0 for special values, including 0. */
            mpfr_min_prec: (x) => gmp.r_min_prec(x),
            /** Return the exponent of x, assuming that x is a non-zero ordinary number and the significand is considered in [1/2,1). */
            mpfr_get_exp: (x) => gmp.r_get_exp(x),
            /** Set the exponent of x if e is in the current exponent range. */
            mpfr_set_exp: (x, e) => gmp.r_set_exp(x, e),
            /** Return the precision of x, i.e., the number of bits used to store its significand. */
            mpfr_get_prec: (x) => gmp.r_get_prec(x),
            /** Reset the precision of x to be exactly prec bits, and set its value to NaN. */
            mpfr_set_prec: (x, prec) => { gmp.r_set_prec(x, prec); },
            /** Reset the precision of x to be exactly prec bits. */
            mpfr_set_prec_raw: (x, prec) => { gmp.r_set_prec_raw(x, prec); },
            /** Set the default precision to be exactly prec bits, where prec can be any integer between MPFR_PREC_MINand MPFR_PREC_MAX. */
            mpfr_set_default_prec: (prec) => { gmp.r_set_default_prec(prec); },
            /** Return the current default MPFR precision in bits. */
            mpfr_get_default_prec: () => gmp.r_get_default_prec(),
            /** Set the value of rop from op rounded toward the given direction rnd. */
            mpfr_set_d: (rop, op, rnd) => gmp.r_set_d(rop, op, rnd),
            /** Set the value of rop from op rounded toward the given direction rnd. */
            mpfr_set_z: (rop, op, rnd) => gmp.r_set_z(rop, op, rnd),
            /** Set the value of rop from op multiplied by two to the power e, rounded toward the given direction rnd. */
            mpfr_set_z_2exp: (rop, op, e, rnd) => gmp.r_set_z_2exp(rop, op, e, rnd),
            /** Set the variable x to NaN (Not-a-Number). */
            mpfr_set_nan: (x) => { gmp.r_set_nan(x); },
            /** Set the variable x to infinity. */
            mpfr_set_inf: (x, sign) => { gmp.r_set_inf(x, sign); },
            /** Set the variable x to zero. */
            mpfr_set_zero: (x, sign) => { gmp.r_set_zero(x, sign); },
            /** Set the value of rop from op rounded toward the given direction rnd. */
            mpfr_set_si: (rop, op, rnd) => gmp.r_set_si(rop, op, rnd),
            /** Set the value of rop from op rounded toward the given direction rnd. */
            mpfr_set_ui: (rop, op, rnd) => gmp.r_set_ui(rop, op, rnd),
            /** Set the value of rop from op multiplied by two to the power e, rounded toward the given direction rnd. */
            mpfr_set_si_2exp: (rop, op, e, rnd) => gmp.r_set_si_2exp(rop, op, e, rnd),
            /** Set the value of rop from op multiplied by two to the power e, rounded toward the given direction rnd. */
            mpfr_set_ui_2exp: (rop, op, e, rnd) => gmp.r_set_ui_2exp(rop, op, e, rnd),
            /** Set the value of rop from op rounded toward the given direction rnd. */
            mpfr_set_q: (rop, op, rnd) => gmp.r_set_q(rop, op, rnd),
            /** Set rop to op1 * op2 rounded in the direction rnd. */
            mpfr_mul_q: (rop, op1, op2, rnd) => gmp.r_mul_q(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_div_q: (rop, op1, op2, rnd) => gmp.r_div_q(rop, op1, op2, rnd),
            /** Set rop to op1 + op2 rounded in the direction rnd. */
            mpfr_add_q: (rop, op1, op2, rnd) => gmp.r_add_q(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_sub_q: (rop, op1, op2, rnd) => gmp.r_sub_q(rop, op1, op2, rnd),
            /** Compare op1 and op2. */
            mpfr_cmp_q: (op1, op2) => gmp.r_cmp_q(op1, op2),
            /** Convert op to a mpq_t. */
            mpfr_get_q: (rop, op) => gmp.r_get_q(rop, op),
            /** Set rop to the value of the string s in base base, rounded in the direction rnd. */
            mpfr_set_str: (rop, s, base, rnd) => gmp.r_set_str(rop, s, base, rnd),
            /** Initialize rop and set its value from op, rounded in the direction rnd. */
            mpfr_init_set: (rop, op, rnd) => gmp.r_init_set(rop, op, rnd),
            /** Initialize rop and set its value from op, rounded in the direction rnd. */
            mpfr_init_set_ui: (rop, op, rnd) => gmp.r_init_set_ui(rop, op, rnd),
            /** Initialize rop and set its value from op, rounded in the direction rnd. */
            mpfr_init_set_si: (rop, op, rnd) => gmp.r_init_set_si(rop, op, rnd),
            /** Initialize rop and set its value from op, rounded in the direction rnd. */
            mpfr_init_set_d: (rop, op, rnd) => gmp.r_init_set_d(rop, op, rnd),
            /** Initialize rop and set its value from op, rounded in the direction rnd. */
            mpfr_init_set_z: (rop, op, rnd) => gmp.r_init_set_z(rop, op, rnd),
            /** Initialize rop and set its value from op, rounded in the direction rnd. */
            mpfr_init_set_q: (rop, op, rnd) => gmp.r_init_set_q(rop, op, rnd),
            /** Initialize x and set its value from the string s in base base, rounded in the direction rnd. */
            mpfr_init_set_str: (x, s, base, rnd) => gmp.r_init_set_str(x, s, base, rnd),
            /** Set rop to the absolute value of op rounded in the direction rnd. */
            mpfr_abs: (rop, op, rnd) => gmp.r_abs(rop, op, rnd),
            /** Set the value of rop from op rounded toward the given direction rnd. */
            mpfr_set: (rop, op, rnd) => gmp.r_set(rop, op, rnd),
            /** Set rop to -op rounded in the direction rnd. */
            mpfr_neg: (rop, op, rnd) => gmp.r_neg(rop, op, rnd),
            /** Return a non-zero value iff op has its sign bit set (i.e., if it is negative, -0, or a NaN whose representation has its sign bit set). */
            mpfr_signbit: (op) => gmp.r_signbit(op),
            /** Set the value of rop from op, rounded toward the given direction rnd, then set (resp. clear) its sign bit if s is non-zero (resp. zero), even when op is a NaN. */
            mpfr_setsign: (rop, op, s, rnd) => gmp.r_setsign(rop, op, s, rnd),
            /** Set the value of rop from op1, rounded toward the given direction rnd, then set its sign bit to that of op2 (even when op1 or op2 is a NaN). */
            mpfr_copysign: (rop, op1, op2, rnd) => gmp.r_copysign(rop, op1, op2, rnd),
            /** Put the scaled significand of op (regarded as an integer, with the precision of op) into rop, and return the exponent exp (which may be outside the current exponent range) such that op = rop * 2^exp. */
            mpfr_get_z_2exp: (rop, op) => gmp.r_get_z_2exp(rop, op),
            /** Convert op to a double, using the rounding mode rnd. */
            mpfr_get_d: (op, rnd) => gmp.r_get_d(op, rnd),
            /** Return d and set exp such that 0.5 ≤ abs(d) <1 and d * 2^exp = op rounded to double precision, using the given rounding mode. */
            mpfr_get_d_2exp: (exp, op, rnd) => gmp.r_get_d_2exp(exp, op, rnd),
            /** Set exp and y such that 0.5 ≤ abs(y) < 1 and y * 2^exp = x rounded to the precision of y, using the given rounding mode. */
            mpfr_frexp: (exp, y, x, rnd) => gmp.r_frexp(exp, y, x, rnd),
            /** Convert op to a long after rounding it with respect to rnd. */
            mpfr_get_si: (op, rnd) => gmp.r_get_si(op, rnd),
            /** Convert op to an unsigned long after rounding it with respect to rnd. */
            mpfr_get_ui: (op, rnd) => gmp.r_get_ui(op, rnd),
            /** Return the minimal integer m such that any number of p bits, when output with m digits in radix b with rounding to nearest, can be recovered exactly when read again, still with rounding to nearest. More precisely, we have m = 1 + ceil(p*log(2)/log(b)), with p replaced by p-1 if b is a power of 2. */
            mpfr_get_str_ndigits: (b, p) => gmp.r_get_str_ndigits(b, p),
            /** Convert op to a string of digits in base b, with rounding in the direction rnd, where n is either zero (see below) or the number of significant digits output in the string; in the latter case, n must be greater or equal to 2. */
            mpfr_get_str: (str, expptr, base, n, op, rnd) => gmp.r_get_str(str, expptr, base, n, op, rnd),
            /** Convert op to a mpz_t, after rounding it with respect to rnd. */
            mpfr_get_z: (rop, op, rnd) => gmp.r_get_z(rop, op, rnd),
            /** Free a string allocated by mpfr_get_str using the unallocation function (see GNU MPFR - Memory Handling). */
            mpfr_free_str: (str) => { gmp.r_free_str(str); },
            /** Generate a uniformly distributed random float. */
            mpfr_urandom: (rop, state, rnd) => gmp.r_urandom(rop, state, rnd),
            /** Generate one random float according to a standard normal gaussian distribution (with mean zero and variance one). */
            mpfr_nrandom: (rop, state, rnd) => gmp.r_nrandom(rop, state, rnd),
            /** Generate one random float according to an exponential distribution, with mean one. */
            mpfr_erandom: (rop, state, rnd) => gmp.r_erandom(rop, state, rnd),
            /** Generate a uniformly distributed random float in the interval 0 ≤ rop < 1. */
            mpfr_urandomb: (rop, state) => gmp.r_urandomb(rop, state),
            /** Equivalent to mpfr_nexttoward where y is plus infinity. */
            mpfr_nextabove: (x) => { gmp.r_nextabove(x); },
            /** Equivalent to mpfr_nexttoward where y is minus infinity. */
            mpfr_nextbelow: (x) => { gmp.r_nextbelow(x); },
            /** Replace x by the next floating-point number in the direction of y. */
            mpfr_nexttoward: (x, y) => { gmp.r_nexttoward(x, y); },
            /** Set rop to op1 raised to op2, rounded in the direction rnd. */
            mpfr_pow: (rop, op1, op2, rnd) => gmp.r_pow(rop, op1, op2, rnd),
            /** Set rop to op1 raised to op2, rounded in the direction rnd. */
            mpfr_pow_si: (rop, op1, op2, rnd) => gmp.r_pow_si(rop, op1, op2, rnd),
            /** Set rop to op1 raised to op2, rounded in the direction rnd. */
            mpfr_pow_ui: (rop, op1, op2, rnd) => gmp.r_pow_ui(rop, op1, op2, rnd),
            /** Set rop to op1 raised to op2, rounded in the direction rnd. */
            mpfr_ui_pow_ui: (rop, op1, op2, rnd) => gmp.r_ui_pow_ui(rop, op1, op2, rnd),
            /** Set rop to op1 raised to op2, rounded in the direction rnd. */
            mpfr_ui_pow: (rop, op1, op2, rnd) => gmp.r_ui_pow(rop, op1, op2, rnd),
            /** Set rop to op1 raised to op2, rounded in the direction rnd. */
            mpfr_pow_z: (rop, op1, op2, rnd) => gmp.r_pow_z(rop, op1, op2, rnd),
            /** Set rop to the square root of op rounded in the direction rnd. */
            mpfr_sqrt: (rop, op, rnd) => gmp.r_sqrt(rop, op, rnd),
            /** Set rop to the square root of op rounded in the direction rnd. */
            mpfr_sqrt_ui: (rop, op, rnd) => gmp.r_sqrt_ui(rop, op, rnd),
            /** Set rop to the reciprocal square root of op rounded in the direction rnd. */
            mpfr_rec_sqrt: (rop, op, rnd) => gmp.r_rec_sqrt(rop, op, rnd),
            /** Set rop to op1 + op2 rounded in the direction rnd. */
            mpfr_add: (rop, op1, op2, rnd) => gmp.r_add(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_sub: (rop, op1, op2, rnd) => gmp.r_sub(rop, op1, op2, rnd),
            /** Set rop to op1 * op2 rounded in the direction rnd. */
            mpfr_mul: (rop, op1, op2, rnd) => gmp.r_mul(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_div: (rop, op1, op2, rnd) => gmp.r_div(rop, op1, op2, rnd),
            /** Set rop to op1 + op2 rounded in the direction rnd. */
            mpfr_add_ui: (rop, op1, op2, rnd) => gmp.r_add_ui(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_sub_ui: (rop, op1, op2, rnd) => gmp.r_sub_ui(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_ui_sub: (rop, op1, op2, rnd) => gmp.r_ui_sub(rop, op1, op2, rnd),
            /** Set rop to op1 * op2 rounded in the direction rnd. */
            mpfr_mul_ui: (rop, op1, op2, rnd) => gmp.r_mul_ui(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_div_ui: (rop, op1, op2, rnd) => gmp.r_div_ui(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_ui_div: (rop, op1, op2, rnd) => gmp.r_ui_div(rop, op1, op2, rnd),
            /** Set rop to op1 + op2 rounded in the direction rnd. */
            mpfr_add_si: (rop, op1, op2, rnd) => gmp.r_add_si(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_sub_si: (rop, op1, op2, rnd) => gmp.r_sub_si(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_si_sub: (rop, op1, op2, rnd) => gmp.r_si_sub(rop, op1, op2, rnd),
            /** Set rop to op1 * op2 rounded in the direction rnd. */
            mpfr_mul_si: (rop, op1, op2, rnd) => gmp.r_mul_si(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_div_si: (rop, op1, op2, rnd) => gmp.r_div_si(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_si_div: (rop, op1, op2, rnd) => gmp.r_si_div(rop, op1, op2, rnd),
            /** Set rop to op1 + op2 rounded in the direction rnd. */
            mpfr_add_d: (rop, op1, op2, rnd) => gmp.r_add_d(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_sub_d: (rop, op1, op2, rnd) => gmp.r_sub_d(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_d_sub: (rop, op1, op2, rnd) => gmp.r_d_sub(rop, op1, op2, rnd),
            /** Set rop to op1 * op2 rounded in the direction rnd. */
            mpfr_mul_d: (rop, op1, op2, rnd) => gmp.r_mul_d(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_div_d: (rop, op1, op2, rnd) => gmp.r_div_d(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_d_div: (rop, op1, op2, rnd) => gmp.r_d_div(rop, op1, op2, rnd),
            /** Set rop to the square of op rounded in the direction rnd. */
            mpfr_sqr: (rop, op, rnd) => gmp.r_sqr(rop, op, rnd),
            /** Set rop to the value of Pi rounded in the direction rnd. */
            mpfr_const_pi: (rop, rnd) => gmp.r_const_pi(rop, rnd),
            /** Set rop to the logarithm of 2 rounded in the direction rnd. */
            mpfr_const_log2: (rop, rnd) => gmp.r_const_log2(rop, rnd),
            /** Set rop to the value of Euler’s constant 0.577… rounded in the direction rnd. */
            mpfr_const_euler: (rop, rnd) => gmp.r_const_euler(rop, rnd),
            /** Set rop to the value of Catalan’s constant 0.915… rounded in the direction rnd. */
            mpfr_const_catalan: (rop, rnd) => gmp.r_const_catalan(rop, rnd),
            /** Set rop to the arithmetic-geometric mean of op1 and op2 rounded in the direction rnd. */
            mpfr_agm: (rop, op1, op2, rnd) => gmp.r_agm(rop, op1, op2, rnd),
            /** Set rop to the natural logarithm of op rounded in the direction rnd. */
            mpfr_log: (rop, op, rnd) => gmp.r_log(rop, op, rnd),
            /** Set rop to log2(op) rounded in the direction rnd. */
            mpfr_log2: (rop, op, rnd) => gmp.r_log2(rop, op, rnd),
            /** Set rop to log10(op) rounded in the direction rnd. */
            mpfr_log10: (rop, op, rnd) => gmp.r_log10(rop, op, rnd),
            /** Set rop to the logarithm of one plus op, rounded in the direction rnd. */
            mpfr_log1p: (rop, op, rnd) => gmp.r_log1p(rop, op, rnd),
            /** Set rop to the natural logarithm of op rounded in the direction rnd. */
            mpfr_log_ui: (rop, op, rnd) => gmp.r_log_ui(rop, op, rnd),
            /** Set rop to the exponential of op rounded in the direction rnd. */
            mpfr_exp: (rop, op, rnd) => gmp.r_exp(rop, op, rnd),
            /** Set rop to 2^op rounded in the direction rnd. */
            mpfr_exp2: (rop, op, rnd) => gmp.r_exp2(rop, op, rnd),
            /** Set rop to 10^op rounded in the direction rnd. */
            mpfr_exp10: (rop, op, rnd) => gmp.r_exp10(rop, op, rnd),
            /** Set rop to the e^op - 1, rounded in the direction rnd. */
            mpfr_expm1: (rop, op, rnd) => gmp.r_expm1(rop, op, rnd),
            /** Set rop to the exponential integral of op rounded in the direction rnd. */
            mpfr_eint: (rop, op, rnd) => gmp.r_eint(rop, op, rnd),
            /** Set rop to real part of the dilogarithm of op rounded in the direction rnd. */
            mpfr_li2: (rop, op, rnd) => gmp.r_li2(rop, op, rnd),
            /** Compare op1 and op2. */
            mpfr_cmp: (op1, op2) => gmp.r_cmp(op1, op2),
            /** Compare op1 and op2. */
            mpfr_cmp_d: (op1, op2) => gmp.r_cmp_d(op1, op2),
            /** Compare op1 and op2. */
            mpfr_cmp_ui: (op1, op2) => gmp.r_cmp_ui(op1, op2),
            /** Compare op1 and op2. */
            mpfr_cmp_si: (op1, op2) => gmp.r_cmp_si(op1, op2),
            /** Compare op1 and op2 * 2^e. */
            mpfr_cmp_ui_2exp: (op1, op2, e) => gmp.r_cmp_ui_2exp(op1, op2, e),
            /** Compare op1 and op2 * 2^e. */
            mpfr_cmp_si_2exp: (op1, op2, e) => gmp.r_cmp_si_2exp(op1, op2, e),
            /** Compare |op1| and |op2|. */
            mpfr_cmpabs: (op1, op2) => gmp.r_cmpabs(op1, op2),
            /** Compare |op1| and |op2|. */
            mpfr_cmpabs_ui: (op1, op2) => gmp.r_cmpabs_ui(op1, op2),
            /** Compute the relative difference between op1 and op2 and store the result in rop. */
            mpfr_reldiff: (rop, op1, op2, rnd) => { gmp.r_reldiff(rop, op1, op2, rnd); },
            /** Return non-zero if op1 and op2 are both non-zero ordinary numbers with the same exponent and the same first op3 bits. */
            mpfr_eq: (op1, op2, op3) => gmp.r_eq(op1, op2, op3),
            /** Return a positive value if op > 0, zero if op = 0, and a negative value if op < 0. */
            mpfr_sgn: (op) => gmp.r_sgn(op),
            /** Set rop to op1 * 2^op2 rounded in the direction rnd. */
            mpfr_mul_2exp: (rop, op1, op2, rnd) => gmp.r_mul_2exp(rop, op1, op2, rnd),
            /** Set rop to op1 divided by 2^op2 rounded in the direction rnd. */
            mpfr_div_2exp: (rop, op1, op2, rnd) => gmp.r_div_2exp(rop, op1, op2, rnd),
            /** Set rop to op1 * 2^op2 rounded in the direction rnd. */
            mpfr_mul_2ui: (rop, op1, op2, rnd) => gmp.r_mul_2ui(rop, op1, op2, rnd),
            /** Set rop to op1 divided by 2^op2 rounded in the direction rnd. */
            mpfr_div_2ui: (rop, op1, op2, rnd) => gmp.r_div_2ui(rop, op1, op2, rnd),
            /** Set rop to op1 * 2^op2 rounded in the direction rnd. */
            mpfr_mul_2si: (rop, op1, op2, rnd) => gmp.r_mul_2si(rop, op1, op2, rnd),
            /** Set rop to op1 divided by 2^op2 rounded in the direction rnd. */
            mpfr_div_2si: (rop, op1, op2, rnd) => gmp.r_div_2si(rop, op1, op2, rnd),
            /** Set rop to op rounded to the nearest representable integer in the given direction rnd. */
            mpfr_rint: (rop, op, rnd) => gmp.r_rint(rop, op, rnd),
            /** Set rop to op rounded to the nearest representable integer, rounding halfway cases with the even-rounding rule zero (like mpfr_rint(mpfr_t, mpfr_t, mpfr_rnd_t) with MPFR_RNDN). */
            mpfr_roundeven: (rop, op) => gmp.r_roundeven(rop, op),
            /** Set rop to op rounded to the nearest representable integer, rounding halfway cases away from zero (as in the roundTiesToAway mode of IEEE 754-2008). */
            mpfr_round: (rop, op) => gmp.r_round(rop, op),
            /** Set rop to op rounded to the next representable integer toward zero (like mpfr_rint(mpfr_t, mpfr_t, mpfr_rnd_t) with MPFR_RNDZ). */
            mpfr_trunc: (rop, op) => gmp.r_trunc(rop, op),
            /** Set rop to op rounded to the next higher or equal representable integer (like mpfr_rint(mpfr_t, mpfr_t, mpfr_rnd_t) with MPFR_RNDU). */
            mpfr_ceil: (rop, op) => gmp.r_ceil(rop, op),
            /** Set rop to op rounded to the next lower or equal representable integer. */
            mpfr_floor: (rop, op) => gmp.r_floor(rop, op),
            /** Set rop to op rounded to the nearest integer, rounding halfway cases to the nearest even integer. */
            mpfr_rint_roundeven: (rop, op, rnd) => gmp.r_rint_roundeven(rop, op, rnd),
            /** Set rop to op rounded to the nearest integer, rounding halfway cases away from zero. */
            mpfr_rint_round: (rop, op, rnd) => gmp.r_rint_round(rop, op, rnd),
            /** Set rop to op rounded to the next integer toward zero. */
            mpfr_rint_trunc: (rop, op, rnd) => gmp.r_rint_trunc(rop, op, rnd),
            /** Set rop to op rounded to the next higher or equal integer. */
            mpfr_rint_ceil: (rop, op, rnd) => gmp.r_rint_ceil(rop, op, rnd),
            /** Set rop to op rounded to the next lower or equal integer. */
            mpfr_rint_floor: (rop, op, rnd) => gmp.r_rint_floor(rop, op, rnd),
            /** Set rop to the fractional part of op, having the same sign as op, rounded in the direction rnd. */
            mpfr_frac: (rop, op, rnd) => gmp.r_frac(rop, op, rnd),
            /** Set simultaneously iop to the integral part of op and fop to the fractional part of op, rounded in the direction rnd with the corresponding precision of iop and fop. */
            mpfr_modf: (rop, fop, op, rnd) => gmp.r_modf(rop, fop, op, rnd),
            /** Set r to the value of x - n * y, rounded according to the direction rnd, where n is the integer quotient of x divided by y, rounded to the nearest integer (ties rounded to even). */
            mpfr_remquo: (r, q, x, y, rnd) => gmp.r_remquo(r, q, x, y, rnd),
            /** Set r to the value of x - n * y, rounded according to the direction rnd, where n is the integer quotient of x divided by y, rounded to the nearest integer (ties rounded to even). */
            mpfr_remainder: (rop, x, y, rnd) => gmp.r_remainder(rop, x, y, rnd),
            /** Set r to the value of x - n * y, rounded according to the direction rnd, where n is the integer quotient of x divided by y, rounded toward zero. */
            mpfr_fmod: (rop, x, y, rnd) => gmp.r_fmod(rop, x, y, rnd),
            /** Set r to the value of x - n * y, rounded according to the direction rnd, where n is the integer quotient of x divided by y, rounded toward zero. */
            mpfr_fmodquo: (rop, q, x, y, rnd) => gmp.r_fmodquo(rop, q, x, y, rnd),
            /** Return non-zero if op would fit in the C data type (32-bit) unsigned long when rounded to an integer in the direction rnd. */
            mpfr_fits_ulong_p: (op, rnd) => gmp.r_fits_ulong_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (32-bit) long when rounded to an integer in the direction rnd. */
            mpfr_fits_slong_p: (op, rnd) => gmp.r_fits_slong_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (32-bit) unsigned int when rounded to an integer in the direction rnd. */
            mpfr_fits_uint_p: (op, rnd) => gmp.r_fits_uint_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (32-bit) int when rounded to an integer in the direction rnd. */
            mpfr_fits_sint_p: (op, rnd) => gmp.r_fits_sint_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (16-bit) unsigned short when rounded to an integer in the direction rnd. */
            mpfr_fits_ushort_p: (op, rnd) => gmp.r_fits_ushort_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (16-bit) short when rounded to an integer in the direction rnd. */
            mpfr_fits_sshort_p: (op, rnd) => gmp.r_fits_sshort_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (32-bit) unsigned long when rounded to an integer in the direction rnd. */
            mpfr_fits_uintmax_p: (op, rnd) => gmp.r_fits_uintmax_p(op, rnd),
            /** Return non-zero if op would fit in the C data type (32-bit) long when rounded to an integer in the direction rnd. */
            mpfr_fits_intmax_p: (op, rnd) => gmp.r_fits_intmax_p(op, rnd),
            /** Swap the structures pointed to by x and y. */
            mpfr_swap: (x, y) => { gmp.r_swap(x, y); },
            /** Output op on stdout in some unspecified format, then a newline character. This function is mainly for debugging purpose. Thus invalid data may be supported. */
            mpfr_dump: (op) => { gmp.r_dump(op); },
            /** Return non-zero if op is NaN. Return zero otherwise. */
            mpfr_nan_p: (op) => gmp.r_nan_p(op),
            /** Return non-zero if op is an infinity. Return zero otherwise. */
            mpfr_inf_p: (op) => gmp.r_inf_p(op),
            /** Return non-zero if op is an ordinary number (i.e., neither NaN nor an infinity). Return zero otherwise. */
            mpfr_number_p: (op) => gmp.r_number_p(op),
            /** Return non-zero iff op is an integer. */
            mpfr_integer_p: (op) => gmp.r_integer_p(op),
            /** Return non-zero if op is zero. Return zero otherwise. */
            mpfr_zero_p: (op) => gmp.r_zero_p(op),
            /** Return non-zero if op is a regular number (i.e., neither NaN, nor an infinity nor zero). Return zero otherwise. */
            mpfr_regular_p: (op) => gmp.r_regular_p(op),
            /** Return non-zero if op1 > op2, and zero otherwise. */
            mpfr_greater_p: (op1, op2) => gmp.r_greater_p(op1, op2),
            /** Return non-zero if op1 ≥ op2, and zero otherwise. */
            mpfr_greaterequal_p: (op1, op2) => gmp.r_greaterequal_p(op1, op2),
            /** Return non-zero if op1 < op2, and zero otherwise. */
            mpfr_less_p: (op1, op2) => gmp.r_less_p(op1, op2),
            /** Return non-zero if op1 ≤ op2, and zero otherwise. */
            mpfr_lessequal_p: (op1, op2) => gmp.r_lessequal_p(op1, op2),
            /** Return non-zero if op1 < op2 or op1 > op2 (i.e., neither op1, nor op2 is NaN, and op1 ≠ op2), zero otherwise (i.e., op1 and/or op2 is NaN, or op1 = op2). */
            mpfr_lessgreater_p: (op1, op2) => gmp.r_lessgreater_p(op1, op2),
            /** Return non-zero if op1 = op2, and zero otherwise. */
            mpfr_equal_p: (op1, op2) => gmp.r_equal_p(op1, op2),
            /** Return non-zero if op1 or op2 is a NaN (i.e., they cannot be compared), zero otherwise. */
            mpfr_unordered_p: (op1, op2) => gmp.r_unordered_p(op1, op2),
            /** Set rop to the inverse hyperbolic tangent of op rounded in the direction rnd. */
            mpfr_atanh: (rop, op, rnd) => gmp.r_atanh(rop, op, rnd),
            /** Set rop to the inverse hyperbolic cosine of op rounded in the direction rnd. */
            mpfr_acosh: (rop, op, rnd) => gmp.r_acosh(rop, op, rnd),
            /** Set rop to the inverse hyperbolic sine of op rounded in the direction rnd. */
            mpfr_asinh: (rop, op, rnd) => gmp.r_asinh(rop, op, rnd),
            /** Set rop to the hyperbolic cosine of op rounded in the direction rnd. */
            mpfr_cosh: (rop, op, rnd) => gmp.r_cosh(rop, op, rnd),
            /** Set rop to the hyperbolic sine of op rounded in the direction rnd. */
            mpfr_sinh: (rop, op, rnd) => gmp.r_sinh(rop, op, rnd),
            /** Set rop to the hyperbolic tangent of op rounded in the direction rnd. */
            mpfr_tanh: (rop, op, rnd) => gmp.r_tanh(rop, op, rnd),
            /** Set simultaneously sop to the hyperbolic sine of op and cop to the hyperbolic cosine of op, rounded in the direction rnd with the corresponding precision of sop and cop, which must be different variables. */
            mpfr_sinh_cosh: (sop, cop, op, rnd) => gmp.r_sinh_cosh(sop, cop, op, rnd),
            /** Set rop to the hyperbolic secant of op rounded in the direction rnd. */
            mpfr_sech: (rop, op, rnd) => gmp.r_sech(rop, op, rnd),
            /** Set rop to the hyperbolic cosecant of op rounded in the direction rnd. */
            mpfr_csch: (rop, op, rnd) => gmp.r_csch(rop, op, rnd),
            /** Set rop to the hyperbolic cotangent of op rounded in the direction rnd. */
            mpfr_coth: (rop, op, rnd) => gmp.r_coth(rop, op, rnd),
            /** Set rop to the arc-cosine of op rounded in the direction rnd. */
            mpfr_acos: (rop, op, rnd) => gmp.r_acos(rop, op, rnd),
            /** Set rop to the arc-sine of op rounded in the direction rnd. */
            mpfr_asin: (rop, op, rnd) => gmp.r_asin(rop, op, rnd),
            /** Set rop to the arc-tangent of op rounded in the direction rnd. */
            mpfr_atan: (rop, op, rnd) => gmp.r_atan(rop, op, rnd),
            /** Set rop to the sine of op rounded in the direction rnd. */
            mpfr_sin: (rop, op, rnd) => gmp.r_sin(rop, op, rnd),
            /** Set simultaneously sop to the sine of op and cop to the cosine of op, rounded in the direction rnd with the corresponding precisions of sop and cop, which must be different variables. */
            mpfr_sin_cos: (sop, cop, op, rnd) => gmp.r_sin_cos(sop, cop, op, rnd),
            /** Set rop to the cosine of op rounded in the direction rnd. */
            mpfr_cos: (rop, op, rnd) => gmp.r_cos(rop, op, rnd),
            /** Set rop to the tangent of op rounded in the direction rnd. */
            mpfr_tan: (rop, op, rnd) => gmp.r_tan(rop, op, rnd),
            /** Set rop to the arc-tangent2 of y and x rounded in the direction rnd. */
            mpfr_atan2: (rop, y, x, rnd) => gmp.r_atan2(rop, y, x, rnd),
            /** Set rop to the secant of op rounded in the direction rnd. */
            mpfr_sec: (rop, op, rnd) => gmp.r_sec(rop, op, rnd),
            /** Set rop to the cosecant of op rounded in the direction rnd. */
            mpfr_csc: (rop, op, rnd) => gmp.r_csc(rop, op, rnd),
            /** Set rop to the cotangent of op rounded in the direction rnd. */
            mpfr_cot: (rop, op, rnd) => gmp.r_cot(rop, op, rnd),
            /** Set rop to the Euclidean norm of x and y, i.e., the square root of the sum of the squares of x and y rounded in the direction rnd. */
            mpfr_hypot: (rop, x, y, rnd) => gmp.r_hypot(rop, x, y, rnd),
            /** Set rop to the value of the error function on op rounded in the direction rnd. */
            mpfr_erf: (rop, op, rnd) => gmp.r_erf(rop, op, rnd),
            /** Set rop to the value of the complementary error function on op rounded in the direction rnd. */
            mpfr_erfc: (rop, op, rnd) => gmp.r_erfc(rop, op, rnd),
            /** Set rop to the cubic root of op rounded in the direction rnd. */
            mpfr_cbrt: (rop, op, rnd) => gmp.r_cbrt(rop, op, rnd),
            /** Set rop to the kth root of op rounded in the direction rnd. */
            mpfr_rootn_ui: (rop, op, k, rnd) => gmp.r_rootn_ui(rop, op, k, rnd),
            /** Set rop to the value of the Gamma function on op rounded in the direction rnd. */
            mpfr_gamma: (rop, op, rnd) => gmp.r_gamma(rop, op, rnd),
            /** Set rop to the value of the incomplete Gamma function on op and op2, rounded in the direction rnd. */
            mpfr_gamma_inc: (rop, op, op2, rnd) => gmp.r_gamma_inc(rop, op, op2, rnd),
            /** Set rop to the value of the Beta function at arguments op1 and op2, rounded in the direction rnd. */
            mpfr_beta: (rop, op1, op2, rnd) => gmp.r_beta(rop, op1, op2, rnd),
            /** Set rop to the value of the logarithm of the Gamma function on op rounded in the direction rnd. */
            mpfr_lngamma: (rop, op, rnd) => gmp.r_lngamma(rop, op, rnd),
            /** Set rop to the value of the logarithm of the absolute value of the Gamma function on op rounded in the direction rnd. */
            mpfr_lgamma: (rop, signp, op, rnd) => gmp.r_lgamma(rop, signp, op, rnd),
            /** Set rop to the value of the Digamma (sometimes also called Psi) function on op rounded in the direction rnd. */
            mpfr_digamma: (rop, op, rnd) => gmp.r_digamma(rop, op, rnd),
            /** Set rop to the value of the Riemann Zeta function on op rounded in the direction rnd. */
            mpfr_zeta: (rop, op, rnd) => gmp.r_zeta(rop, op, rnd),
            /** Set rop to the value of the Riemann Zeta function on op rounded in the direction rnd. */
            mpfr_zeta_ui: (rop, op, rnd) => gmp.r_zeta_ui(rop, op, rnd),
            /** Set rop to the factorial of op rounded in the direction rnd. */
            mpfr_fac_ui: (rop, op, rnd) => gmp.r_fac_ui(rop, op, rnd),
            /** Set rop to the value of the first kind Bessel function of order 0 on op rounded in the direction rnd. */
            mpfr_j0: (rop, op, rnd) => gmp.r_j0(rop, op, rnd),
            /** Set rop to the value of the first kind Bessel function of order 1 on op rounded in the direction rnd. */
            mpfr_j1: (rop, op, rnd) => gmp.r_j1(rop, op, rnd),
            /** Set rop to the value of the first kind Bessel function of order n on op rounded in the direction rnd. */
            mpfr_jn: (rop, n, op, rnd) => gmp.r_jn(rop, n, op, rnd),
            /** Set rop to the value of the first kind Bessel function of order 0 on op rounded in the direction rnd. */
            mpfr_y0: (rop, op, rnd) => gmp.r_y0(rop, op, rnd),
            /** Set rop to the value of the first kind Bessel function of order 1 on op rounded in the direction rnd. */
            mpfr_y1: (rop, op, rnd) => gmp.r_y1(rop, op, rnd),
            /** Set rop to the value of the first kind Bessel function of order n on op rounded in the direction rnd. */
            mpfr_yn: (rop, n, op, rnd) => gmp.r_yn(rop, n, op, rnd),
            /** Set rop to the value of the Airy function Ai on x rounded in the direction rnd. */
            mpfr_ai: (rop, x, rnd) => gmp.r_ai(rop, x, rnd),
            /** Set rop to the minimum of op1 and op2. */
            mpfr_min: (rop, op1, op2, rnd) => gmp.r_min(rop, op1, op2, rnd),
            /** Set rop to the maximum of op1 and op2. */
            mpfr_max: (rop, op1, op2, rnd) => gmp.r_max(rop, op1, op2, rnd),
            /** Set rop to the positive difference of op1 and op2, i.e., op1 - op2 rounded in the direction rnd if op1 > op2, +0 if op1 ≤ op2, and NaN if op1 or op2 is NaN. */
            mpfr_dim: (rop, op1, op2, rnd) => gmp.r_dim(rop, op1, op2, rnd),
            /** Set rop to op1 * op2 rounded in the direction rnd. */
            mpfr_mul_z: (rop, op1, op2, rnd) => gmp.r_mul_z(rop, op1, op2, rnd),
            /** Set rop to op1 / op2 rounded in the direction rnd. */
            mpfr_div_z: (rop, op1, op2, rnd) => gmp.r_div_z(rop, op1, op2, rnd),
            /** Set rop to op1 + op2 rounded in the direction rnd. */
            mpfr_add_z: (rop, op1, op2, rnd) => gmp.r_add_z(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_sub_z: (rop, op1, op2, rnd) => gmp.r_sub_z(rop, op1, op2, rnd),
            /** Set rop to op1 - op2 rounded in the direction rnd. */
            mpfr_z_sub: (rop, op1, op2, rnd) => gmp.r_z_sub(rop, op1, op2, rnd),
            /** Compare op1 and op2. */
            mpfr_cmp_z: (op1, op2) => gmp.r_cmp_z(op1, op2),
            /** Set rop to (op1 * op2) + op3 rounded in the direction rnd. */
            mpfr_fma: (rop, op1, op2, op3, rnd) => gmp.r_fma(rop, op1, op2, op3, rnd),
            /** Set rop to (op1 * op2) - op3 rounded in the direction rnd. */
            mpfr_fms: (rop, op1, op2, op3, rnd) => gmp.r_fms(rop, op1, op2, op3, rnd),
            /** Set rop to (op1 * op2) + (op3 * op4) rounded in the direction rnd. */
            mpfr_fmma: (rop, op1, op2, op3, op4, rnd) => gmp.r_fmma(rop, op1, op2, op3, op4, rnd),
            /** Set rop to (op1 * op2) - (op3 * op4) rounded in the direction rnd. */
            mpfr_fmms: (rop, op1, op2, op3, op4, rnd) => gmp.r_fmms(rop, op1, op2, op3, op4, rnd),
            /** Set rop to the sum of all elements of tab, whose size is n, correctly rounded in the direction rnd. */
            mpfr_sum: (rop, tab, n, rnd) => gmp.r_sum(rop, tab, n, rnd),
            /** Set rop to the dot product of elements of a by those of b, whose common size is n, correctly rounded in the direction rnd. */
            mpfr_dot: (rop, a, b, n, rnd) => gmp.r_dot(rop, a, b, n, rnd),
            /** Free all caches and pools used by MPFR internally. */
            mpfr_free_cache: () => { gmp.r_free_cache(); },
            /** Free various caches and pools used by MPFR internally, as specified by way, which is a set of flags */
            mpfr_free_cache2: (way) => { gmp.r_free_cache2(way); },
            /** Free the pools used by MPFR internally. */
            mpfr_free_pool: () => { gmp.r_free_pool(); },
            /** This function should be called before calling mp_set_memory_functions(allocate_function, reallocate_function, free_function). */
            mpfr_mp_memory_cleanup: () => gmp.r_mp_memory_cleanup(),
            /** This function rounds x emulating subnormal number arithmetic. */
            mpfr_subnormalize: (x, t, rnd) => gmp.r_subnormalize(x, t, rnd),
            /** Read a floating-point number from a string nptr in base base, rounded in the direction rnd. */
            mpfr_strtofr: (rop, nptr, endptr, base, rnd) => gmp.r_strtofr(rop, nptr, endptr, base, rnd),
            /** Return the needed size in bytes to store the significand of a floating-point number of precision prec. */
            mpfr_custom_get_size: (prec) => gmp.r_custom_get_size(prec),
            /** Initialize a significand of precision prec. */
            mpfr_custom_init: (significand, prec) => { gmp.r_custom_init(significand, prec); },
            /** Return a pointer to the significand used by a mpfr_t initialized with mpfr_custom_init_set. */
            mpfr_custom_get_significand: (x) => gmp.r_custom_get_significand(x),
            /** Return the exponent of x */
            mpfr_custom_get_exp: (x) => gmp.r_custom_get_exp(x),
            /** Inform MPFR that the significand of x has moved due to a garbage collect and update its new position to new_position. */
            mpfr_custom_move: (x, new_position) => { gmp.r_custom_move(x, new_position); },
            /** Perform a dummy initialization of a mpfr_t. */
            mpfr_custom_init_set: (x, kind, exp, prec, significand) => { gmp.r_custom_init_set(x, kind, exp, prec, significand); },
            /** Return the current kind of a mpfr_t as created by mpfr_custom_init_set. */
            mpfr_custom_get_kind: (x) => gmp.r_custom_get_kind(x),
            /** This function implements the totalOrder predicate from IEEE 754-2008, where -NaN < -Inf < negative finite numbers < -0 < +0 < positive finite numbers < +Inf < +NaN. It returns a non-zero value (true) when x is smaller than or equal to y for this order relation, and zero (false) otherwise */
            mpfr_total_order_p: (x, y) => gmp.r_total_order_p(x, y),
            /**************** Helper functions  ****************/
            /** Converts JS string into MPZ integer */
            mpz_set_string(mpz, input, base) {
                const srcPtr = getStringPointer(input);
                const res = gmp.z_set_str(mpz, srcPtr, base);
                if (srcPtr !== strBuf) {
                    gmp.g_free(srcPtr);
                }
                return res;
            },
            /** Initializes new MPFR float from JS string */
            mpz_init_set_string(mpz, input, base) {
                const srcPtr = getStringPointer(input);
                const res = gmp.z_init_set_str(mpz, srcPtr, base);
                if (srcPtr !== strBuf) {
                    gmp.g_free(srcPtr);
                }
                return res;
            },
            /** Converts MPZ int into JS string */
            mpz_to_string(x, base) {
                let destPtr = 0;
                if (gmp.z_sizeinbase(x, base) + 2 < PREALLOCATED_STR_SIZE) {
                    destPtr = strBuf;
                }
                const strPtr = gmp.z_get_str(destPtr, base, x);
                const endPtr = this.mem.indexOf(0, strPtr);
                const str = decoder.decode(this.mem.subarray(strPtr, endPtr));
                if (destPtr !== strBuf) {
                    gmp.g_free(strPtr);
                }
                return str;
            },
            /** Converts JS string into MPQ rational */
            mpq_set_string(mpq, input, base) {
                const srcPtr = getStringPointer(input);
                const res = gmp.q_set_str(mpq, srcPtr, base);
                if (srcPtr !== strBuf) {
                    gmp.g_free(srcPtr);
                }
                return res;
            },
            /** Converts MPQ rational into JS string */
            mpq_to_string(x, base) {
                let destPtr = 0;
                const requiredSize = gmp.z_sizeinbase(gmp.q_numref(x), base) + gmp.z_sizeinbase(gmp.q_denref(x), base) + 3;
                if (requiredSize < PREALLOCATED_STR_SIZE) {
                    destPtr = strBuf;
                }
                const strPtr = gmp.q_get_str(destPtr, base, x);
                const endPtr = this.mem.indexOf(0, strPtr);
                const str = decoder.decode(this.mem.subarray(strPtr, endPtr));
                if (destPtr !== strBuf) {
                    gmp.g_free(strPtr);
                }
                return str;
            },
            /** Converts JS string into MPFR float */
            mpfr_set_string(mpfr, input, base, rnd) {
                const srcPtr = getStringPointer(input);
                const res = gmp.r_set_str(mpfr, srcPtr, base, rnd);
                if (srcPtr !== strBuf) {
                    gmp.g_free(srcPtr);
                }
                return res;
            },
            /** Initializes new MPFR float from JS string */
            mpfr_init_set_string(mpfr, input, base, rnd) {
                const srcPtr = getStringPointer(input);
                const res = gmp.r_init_set_str(mpfr, srcPtr, base, rnd);
                if (srcPtr !== strBuf) {
                    gmp.g_free(srcPtr);
                }
                return res;
            },
            /** Converts MPFR float into JS string */
            mpfr_to_string(x, base, rnd) {
                let destPtr = 0;
                const n = gmp.r_get_str_ndigits(base, gmp.r_get_prec(x));
                const requiredSize = Math.max(7, n + 2);
                if (requiredSize < PREALLOCATED_STR_SIZE) {
                    destPtr = strBuf;
                }
                const strPtr = gmp.r_get_str(destPtr, mpfr_exp_t_ptr, base, n, x, rnd);
                const endPtr = this.mem.indexOf(0, strPtr);
                let str = decoder.decode(this.mem.subarray(strPtr, endPtr));
                if (FLOAT_SPECIAL_VALUE_KEYS.includes(str)) {
                    str = FLOAT_SPECIAL_VALUES[str];
                }
                else {
                    // decimal point needs to be inserted
                    const pointPos = this.memView.getInt32(mpfr_exp_t_ptr, true);
                    str = insertDecimalPoint(str, pointPos);
                }
                if (destPtr !== strBuf) {
                    gmp.r_free_str(strPtr);
                }
                return str;
            }
        };
    });
}

var DivMode;
(function (DivMode) {
    DivMode[DivMode["CEIL"] = 0] = "CEIL";
    DivMode[DivMode["FLOOR"] = 1] = "FLOOR";
    DivMode[DivMode["TRUNCATE"] = 2] = "TRUNCATE";
})(DivMode || (DivMode = {}));
const INVALID_PARAMETER_ERROR$1 = 'Invalid parameter!';
function getIntegerContext(gmp, ctx) {
    const mpz_t_arr = [];
    const isInteger = (val) => ctx.intContext.isInteger(val);
    const isRational = (val) => ctx.rationalContext.isRational(val);
    const isFloat = (val) => ctx.floatContext.isFloat(val);
    const compare = (mpz_t, val) => {
        if (typeof val === 'number') {
            assertInt32(val);
            return gmp.mpz_cmp_si(mpz_t, val);
        }
        if (typeof val === 'string') {
            const i = IntegerFn(val);
            return gmp.mpz_cmp(mpz_t, i.mpz_t);
        }
        if (isInteger(val)) {
            return gmp.mpz_cmp(mpz_t, val.mpz_t);
        }
        if (isRational(val)) {
            return -gmp.mpq_cmp_z(val.mpq_t, mpz_t);
        }
        if (isFloat(val)) {
            return -gmp.mpfr_cmp_z(val.mpfr_t, mpz_t);
        }
        throw new Error(INVALID_PARAMETER_ERROR$1);
    };
    const IntPrototype = {
        mpz_t: 0,
        type: 'integer',
        /** Returns the sum of this number and the given one. */
        add(val) {
            if (typeof val === 'number') {
                assertInt32(val);
                const n = IntegerFn();
                if (val < 0) {
                    gmp.mpz_sub_ui(n.mpz_t, this.mpz_t, -val);
                }
                else {
                    gmp.mpz_add_ui(n.mpz_t, this.mpz_t, val);
                }
                return n;
            }
            if (typeof val === 'string') {
                const n = IntegerFn(val);
                gmp.mpz_add(n.mpz_t, this.mpz_t, n.mpz_t);
                return n;
            }
            if (isInteger(val)) {
                const n = IntegerFn();
                gmp.mpz_add(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            if (isRational(val) || isFloat(val)) {
                return val.add(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the difference of this number and the given one. */
        sub(val) {
            if (typeof val === 'number') {
                const n = IntegerFn();
                assertInt32(val);
                if (val < 0) {
                    gmp.mpz_add_ui(n.mpz_t, this.mpz_t, -val);
                }
                else {
                    gmp.mpz_sub_ui(n.mpz_t, this.mpz_t, val);
                }
                return n;
            }
            if (typeof val === 'string') {
                const n = IntegerFn(val);
                gmp.mpz_sub(n.mpz_t, this.mpz_t, n.mpz_t);
                return n;
            }
            if (isInteger(val)) {
                const n = IntegerFn();
                gmp.mpz_sub(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            if (isRational(val) || isFloat(val)) {
                return val.neg().add(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the product of this number and the given one. */
        mul(val) {
            if (typeof val === 'number') {
                const n = IntegerFn();
                assertInt32(val);
                gmp.mpz_mul_si(n.mpz_t, this.mpz_t, val);
                return n;
            }
            if (typeof val === 'string') {
                const n = IntegerFn(val);
                gmp.mpz_mul(n.mpz_t, this.mpz_t, n.mpz_t);
                return n;
            }
            if (isInteger(val)) {
                const n = IntegerFn();
                gmp.mpz_mul(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            if (isRational(val) || isFloat(val)) {
                return val.mul(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the number with inverted sign. */
        neg() {
            const n = IntegerFn();
            gmp.mpz_neg(n.mpz_t, this.mpz_t);
            return n;
        },
        /** Returns the absolute value of this number. */
        abs() {
            const n = IntegerFn();
            gmp.mpz_abs(n.mpz_t, this.mpz_t);
            return n;
        },
        /** Returns the result of the division of this number by the given one. */
        div(val, mode = DivMode.CEIL) {
            if (typeof val === 'number') {
                const n = IntegerFn(this);
                assertInt32(val);
                if (val < 0) {
                    gmp.mpz_neg(n.mpz_t, n.mpz_t);
                    val = -val;
                }
                if (mode === DivMode.CEIL) {
                    gmp.mpz_cdiv_q_ui(n.mpz_t, n.mpz_t, val);
                }
                else if (mode === DivMode.FLOOR) {
                    gmp.mpz_fdiv_q_ui(n.mpz_t, n.mpz_t, val);
                }
                else if (mode === DivMode.TRUNCATE) {
                    gmp.mpz_tdiv_q_ui(n.mpz_t, n.mpz_t, val);
                }
                return n;
            }
            if (typeof val === 'string' || isInteger(val)) {
                const n = IntegerFn(this);
                const intVal = typeof val === 'string' ? IntegerFn(val) : val;
                if (mode === DivMode.CEIL) {
                    gmp.mpz_cdiv_q(n.mpz_t, this.mpz_t, intVal.mpz_t);
                }
                else if (mode === DivMode.FLOOR) {
                    gmp.mpz_fdiv_q(n.mpz_t, this.mpz_t, intVal.mpz_t);
                }
                else if (mode === DivMode.TRUNCATE) {
                    gmp.mpz_tdiv_q(n.mpz_t, this.mpz_t, intVal.mpz_t);
                }
                return n;
            }
            if (isRational(val)) {
                return val.invert().mul(this);
            }
            if (isFloat(val)) {
                return ctx.floatContext.Float(this).div(val);
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns this number exponentiated to the given value. */
        pow(exp, mod) {
            if (typeof exp === 'number') {
                const n = IntegerFn();
                assertUint32(exp);
                if (mod !== undefined) {
                    if (typeof mod === 'number') {
                        assertUint32(mod);
                        gmp.mpz_powm_ui(n.mpz_t, this.mpz_t, exp, IntegerFn(mod).mpz_t);
                    }
                    else {
                        gmp.mpz_powm_ui(n.mpz_t, this.mpz_t, exp, mod.mpz_t);
                    }
                }
                else {
                    gmp.mpz_pow_ui(n.mpz_t, this.mpz_t, exp);
                }
                return n;
            }
            if (isInteger(exp)) {
                const n = IntegerFn();
                if (mod !== undefined) {
                    if (typeof mod === 'number') {
                        assertUint32(mod);
                        gmp.mpz_powm(n.mpz_t, this.mpz_t, exp.mpz_t, IntegerFn(mod).mpz_t);
                    }
                    else {
                        gmp.mpz_powm(n.mpz_t, this.mpz_t, exp.mpz_t, mod.mpz_t);
                    }
                }
                else {
                    const expNum = exp.toNumber();
                    assertUint32(expNum);
                    gmp.mpz_pow_ui(n.mpz_t, this.mpz_t, expNum);
                }
                return n;
            }
            if (isRational(exp) && mod === undefined) {
                const n = IntegerFn();
                const numerator = exp.numerator().toNumber();
                assertUint32(numerator);
                const denominator = exp.denominator().toNumber();
                assertUint32(denominator);
                gmp.mpz_pow_ui(n.mpz_t, this.mpz_t, numerator);
                gmp.mpz_root(n.mpz_t, n.mpz_t, denominator);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the integer square root number, rounded down. */
        sqrt() {
            const n = IntegerFn();
            gmp.mpz_sqrt(n.mpz_t, this.mpz_t);
            return n;
        },
        /** Returns the truncated integer part of the nth root */
        nthRoot(nth) {
            const n = IntegerFn();
            assertUint32(nth);
            gmp.mpz_root(n.mpz_t, this.mpz_t, nth);
            return n;
        },
        /** Returns the factorial */
        factorial() {
            if (gmp.mpz_fits_ulong_p(this.mpz_t) === 0) {
                throw new Error('Out of bounds!');
            }
            const n = IntegerFn();
            const value = gmp.mpz_get_ui(this.mpz_t);
            gmp.mpz_fac_ui(n.mpz_t, value);
            return n;
        },
        /** Returns the double factorial */
        doubleFactorial() {
            if (gmp.mpz_fits_ulong_p(this.mpz_t) === 0) {
                throw new Error('Out of bounds!');
            }
            const n = IntegerFn();
            const value = gmp.mpz_get_ui(this.mpz_t);
            gmp.mpz_2fac_ui(n.mpz_t, value);
            return n;
        },
        /** Determines whether a number is prime using some trial divisions, then reps Miller-Rabin probabilistic primality tests. */
        isProbablyPrime(reps = 20) {
            assertUint32(reps);
            const ret = gmp.mpz_probab_prime_p(this.mpz_t, reps);
            if (ret === 0)
                return false; // definitely non-prime
            if (ret === 1)
                return 'probably-prime';
            if (ret === 2)
                return true; // definitely prime
        },
        /** Identifies primes using a probabilistic algorithm; the chance of a composite passing will be extremely small. */
        nextPrime() {
            const n = IntegerFn();
            gmp.mpz_nextprime(n.mpz_t, this.mpz_t);
            return n;
        },
        /** Returns the greatest common divisor of this number and the given one. */
        gcd(val) {
            const n = IntegerFn();
            if (typeof val === 'number') {
                assertUint32(val);
                gmp.mpz_gcd_ui(n.mpz_t, this.mpz_t, val);
                return n;
            }
            if (isInteger(val)) {
                gmp.mpz_gcd(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the least common multiple of this number and the given one. */
        lcm(val) {
            const n = IntegerFn();
            if (typeof val === 'number') {
                assertUint32(val);
                gmp.mpz_lcm_ui(n.mpz_t, this.mpz_t, val);
                return n;
            }
            if (isInteger(val)) {
                gmp.mpz_lcm(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the one's complement. */
        complement1() {
            const n = IntegerFn();
            gmp.mpz_com(n.mpz_t, this.mpz_t);
            return n;
        },
        /** Returns the two's complement. */
        complement2() {
            const n = IntegerFn();
            gmp.mpz_com(n.mpz_t, this.mpz_t);
            gmp.mpz_add_ui(n.mpz_t, n.mpz_t, 1);
            return n;
        },
        /** Returns the integer bitwise-and combined with another integer. */
        and(val) {
            const n = IntegerFn();
            if (typeof val === 'number') {
                assertUint32(val);
                gmp.mpz_and(n.mpz_t, this.mpz_t, IntegerFn(val).mpz_t);
                return n;
            }
            if (isInteger(val)) {
                gmp.mpz_and(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the integer bitwise-or combined with another integer. */
        or(val) {
            const n = IntegerFn();
            if (typeof val === 'number') {
                assertUint32(val);
                gmp.mpz_ior(n.mpz_t, this.mpz_t, IntegerFn(val).mpz_t);
                return n;
            }
            if (isInteger(val)) {
                gmp.mpz_ior(n.mpz_t, this.mpz_t, val.mpz_t);
                return n;
            }
            throw new Error(INVALID_PARAMETER_ERROR$1);
        },
        /** Returns the integer bitwise-xor combined with another integer. */
        xor(val) {
            const n = IntegerFn();
            if (typeof val === 'number') {
                assertUint32(val);
                gmp.mpz_xor(n.mpz_t, this.mpz_t, IntegerFn(val).mpz_t);
            }
            else {
                gmp.mpz_xor(n.mpz_t, this.mpz_t, val.mpz_t);
            }
            return n;
        },
        /** Returns the integer left shifted by a given number of bits. */
        shiftLeft(val) {
            assertUint32(val);
            const n = IntegerFn();
            gmp.mpz_mul_2exp(n.mpz_t, this.mpz_t, val);
            return n;
        },
        /** Returns the integer right shifted by a given number of bits. */
        shiftRight(val) {
            assertUint32(val);
            const n = IntegerFn();
            gmp.mpz_fdiv_q_2exp(n.mpz_t, this.mpz_t, val);
            return n;
        },
        /** Sets the value of bit i to 1. The least significant bit is number 0 */
        setBit(i) {
            const n = IntegerFn(this);
            assertUint32(i);
            gmp.mpz_setbit(n.mpz_t, i);
            return n;
        },
        /** Sets the value of multiple bits to 1. The least significant bit is number 0 */
        setBits(indices) {
            const n = IntegerFn(this);
            assertArray(indices);
            indices.forEach(i => {
                assertUint32(i);
                gmp.mpz_setbit(n.mpz_t, i);
            });
            return n;
        },
        /** Sets the value of bit i to 0. The least significant bit is number 0 */
        clearBit(index) {
            const n = IntegerFn(this);
            assertUint32(index);
            gmp.mpz_clrbit(n.mpz_t, index);
            return n;
        },
        /** Sets the value of multiple bits to 0. The least significant bit is number 0 */
        clearBits(indices) {
            const n = IntegerFn(this);
            assertArray(indices);
            indices.forEach(i => {
                assertUint32(i);
                gmp.mpz_clrbit(n.mpz_t, i);
            });
            return n;
        },
        /** Inverts the value of bit i. The least significant bit is number 0 */
        flipBit(index) {
            const n = IntegerFn(this);
            assertUint32(index);
            gmp.mpz_combit(n.mpz_t, index);
            return n;
        },
        /** Inverts the value of multiple bits. The least significant bit is number 0 */
        flipBits(indices) {
            const n = IntegerFn(this);
            assertArray(indices);
            indices.forEach(i => {
                assertUint32(i);
                gmp.mpz_combit(n.mpz_t, i);
            });
            return n;
        },
        /** Returns 0 or 1 based on the value of a bit at the provided index. The least significant bit is number 0 */
        getBit(index) {
            assertUint32(index);
            return gmp.mpz_tstbit(this.mpz_t, index);
        },
        // Returns the position of the most significant bit. The least significant bit is number 0.
        msbPosition() {
            return gmp.mpz_sizeinbase(this.mpz_t, 2) - 1;
        },
        /** Works similarly to JS Array.slice() but on bits. The least significant bit is number 0 */
        sliceBits(start, end) {
            if (start === undefined)
                start = 0;
            assertInt32(start);
            const msb = gmp.mpz_sizeinbase(this.mpz_t, 2);
            if (start < 0)
                start = msb + start;
            start = Math.max(0, start);
            if (end === undefined)
                end = msb + 1;
            assertInt32(end);
            if (end < 0)
                end = msb + end;
            end = Math.min(msb + 1, end);
            if (start >= end)
                return IntegerFn(0);
            const n = IntegerFn(1);
            if (end < msb + 1) {
                gmp.mpz_mul_2exp(n.mpz_t, n.mpz_t, end);
                gmp.mpz_sub_ui(n.mpz_t, n.mpz_t, 1);
                gmp.mpz_and(n.mpz_t, this.mpz_t, n.mpz_t);
                gmp.mpz_fdiv_q_2exp(n.mpz_t, n.mpz_t, start);
            }
            else {
                gmp.mpz_fdiv_q_2exp(n.mpz_t, this.mpz_t, start);
            }
            return n;
        },
        /** Creates new integer with the copy of binary representation of num to position offset. Optionally bitCount can be used to zero-pad the number to a specific number of bits. The least significant bit is number 0 */
        writeTo(num, offset = 0, bitCount) {
            assertUint32(offset);
            if (!isInteger(num))
                throw new Error('Only Integers are supported');
            if (bitCount === undefined) {
                bitCount = gmp.mpz_sizeinbase(num.mpz_t, 2);
            }
            assertUint32(bitCount);
            const aux = IntegerFn();
            const n = IntegerFn();
            gmp.mpz_fdiv_q_2exp(n.mpz_t, this.mpz_t, offset + bitCount);
            gmp.mpz_mul_2exp(n.mpz_t, n.mpz_t, bitCount);
            gmp.mpz_tdiv_r_2exp(aux.mpz_t, num.mpz_t, bitCount);
            gmp.mpz_ior(n.mpz_t, n.mpz_t, aux.mpz_t);
            gmp.mpz_tdiv_r_2exp(aux.mpz_t, this.mpz_t, offset);
            gmp.mpz_mul_2exp(n.mpz_t, n.mpz_t, offset);
            gmp.mpz_ior(n.mpz_t, n.mpz_t, aux.mpz_t);
            return n;
        },
        /** Returns true if the current number is equal to the provided number */
        isEqual(val) {
            return compare(this.mpz_t, val) === 0;
        },
        /** Returns true if the current number is less than the provided number */
        lessThan(val) {
            return compare(this.mpz_t, val) < 0;
        },
        /** Returns true if the current number is less than or equal to the provided number */
        lessOrEqual(val) {
            return compare(this.mpz_t, val) <= 0;
        },
        /** Returns true if the current number is greater than the provided number */
        greaterThan(val) {
            return compare(this.mpz_t, val) > 0;
        },
        /** Returns true if the current number is greater than or equal to the provided number */
        greaterOrEqual(val) {
            return compare(this.mpz_t, val) >= 0;
        },
        /** Returns the sign of the current value (-1 or 0 or 1) */
        sign() {
            return gmp.mpz_sgn(this.mpz_t);
        },
        /** Converts current value into a JavaScript number */
        toNumber() {
            if (gmp.mpz_fits_slong_p(this.mpz_t) === 0) {
                return gmp.mpz_get_d(this.mpz_t);
            }
            return gmp.mpz_get_si(this.mpz_t);
        },
        /** Exports integer into an Uint8Array. Sign is ignored. */
        toBuffer(littleEndian = false) {
            const countPtr = gmp.malloc(4);
            const startptr = gmp.mpz_export(0, countPtr, littleEndian ? -1 : 1, 1, 1, 0, this.mpz_t);
            const size = gmp.memView.getUint32(countPtr, true);
            const endptr = startptr + size;
            const buf = gmp.mem.slice(startptr, endptr);
            gmp.free(startptr);
            gmp.free(countPtr);
            return buf;
        },
        /** Converts the number to string */
        toString(radix = 10) {
            if (!Number.isSafeInteger(radix) || radix < 2 || radix > 62) {
                throw new Error('radix must have a value between 2 and 62');
            }
            return gmp.mpz_to_string(this.mpz_t, radix);
        },
        /** Converts the number to a rational number */
        toRational() {
            return ctx.rationalContext.Rational(this);
        },
        /** Converts the number to a floating-point number */
        toFloat() {
            return ctx.floatContext.Float(this);
        },
    };
    const IntegerFn = (num, radix = 10) => {
        const instance = Object.create(IntPrototype);
        instance.mpz_t = gmp.mpz_t();
        if (num === undefined) {
            gmp.mpz_init(instance.mpz_t);
        }
        else if (typeof num === 'string') {
            assertValidRadix(radix);
            const res = gmp.mpz_init_set_string(instance.mpz_t, num, radix);
            if (res !== 0) {
                throw new Error('Invalid number provided!');
            }
        }
        else if (typeof num === 'number') {
            assertInt32(num);
            gmp.mpz_init_set_si(instance.mpz_t, num);
        }
        else if (isInteger(num)) {
            gmp.mpz_init_set(instance.mpz_t, num.mpz_t);
        }
        else if (ArrayBuffer.isView(num)) {
            if (!(num instanceof Uint8Array)) {
                throw new Error('Only Uint8Array is supported!');
            }
            gmp.mpz_init(instance.mpz_t);
            const wasmBufPtr = gmp.malloc(num.length);
            gmp.mem.set(num, wasmBufPtr);
            gmp.mpz_import(instance.mpz_t, num.length, 1, 1, 1, 0, wasmBufPtr);
            gmp.free(wasmBufPtr);
        }
        else if (isRational(num)) {
            gmp.mpz_init(instance.mpz_t);
            const f = ctx.floatContext.Float(num);
            gmp.mpfr_get_z(instance.mpz_t, f.mpfr_t, 0);
        }
        else if (isFloat(num)) {
            gmp.mpz_init(instance.mpz_t);
            gmp.mpfr_get_z(instance.mpz_t, num.mpfr_t, num.rndMode);
        }
        else {
            gmp.mpz_t_free(instance.mpz_t);
            throw new Error('Invalid value for the Integer type!');
        }
        mpz_t_arr.push(instance.mpz_t);
        return instance;
    };
    return {
        Integer: IntegerFn,
        isInteger: (val) => IntPrototype.isPrototypeOf(val),
        destroy: () => {
            for (let i = mpz_t_arr.length - 1; i >= 0; i--) {
                gmp.mpz_clear(mpz_t_arr[i]);
                gmp.mpz_t_free(mpz_t_arr[i]);
            }
            mpz_t_arr.length = 0;
        }
    };
}

const INVALID_PARAMETER_ERROR = 'Invalid parameter!';
function getRationalContext(gmp, ctx) {
    const mpq_t_arr = [];
    const isInteger = (val) => ctx.intContext.isInteger(val);
    const isRational = (val) => ctx.rationalContext.isRational(val);
    const isFloat = (val) => ctx.floatContext.isFloat(val);
    const compare = (mpq_t, val) => {
        if (typeof val === 'number') {
            assertInt32(val);
            return gmp.mpq_cmp_si(mpq_t, val, 1);
        }
        if (typeof val === 'string') {
            const r = RationalFn(val);
            return gmp.mpq_cmp(mpq_t, r.mpq_t);
        }
        if (isInteger(val)) {
            return gmp.mpq_cmp_z(mpq_t, val.mpz_t);
        }
        if (isRational(val)) {
            return gmp.mpq_cmp(mpq_t, val.mpq_t);
        }
        if (isFloat(val)) {
            return -gmp.mpfr_cmp_q(val.mpfr_t, mpq_t);
        }
        throw new Error(INVALID_PARAMETER_ERROR);
    };
    const RationalPrototype = {
        mpq_t: 0,
        type: 'rational',
        /** Returns the sum of this number and the given one. */
        add(val) {
            if (typeof val === 'number' || isInteger(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_add(n.mpq_t, this.mpq_t, RationalFn(val).mpq_t);
                return n;
            }
            if (typeof val === 'string') {
                const n = RationalFn(val);
                gmp.mpq_add(n.mpq_t, this.mpq_t, n.mpq_t);
                return n;
            }
            if (isRational(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_add(n.mpq_t, this.mpq_t, val.mpq_t);
                return n;
            }
            if (isFloat(val)) {
                return val.add(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR);
        },
        /** Returns the difference of this number and the given one. */
        sub(val) {
            if (typeof val === 'number' || isInteger(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_sub(n.mpq_t, this.mpq_t, RationalFn(val).mpq_t);
                return n;
            }
            if (typeof val === 'string') {
                const n = RationalFn(val);
                gmp.mpq_sub(n.mpq_t, this.mpq_t, n.mpq_t);
                return n;
            }
            if (isRational(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_sub(n.mpq_t, this.mpq_t, val.mpq_t);
                return n;
            }
            if (isFloat(val)) {
                return val.neg().add(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR);
        },
        /** Returns the product of this number and the given one. */
        mul(val) {
            if (typeof val === 'number' || isInteger(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_mul(n.mpq_t, this.mpq_t, RationalFn(val).mpq_t);
                return n;
            }
            if (typeof val === 'string') {
                const n = RationalFn(val);
                gmp.mpq_mul(n.mpq_t, this.mpq_t, n.mpq_t);
                return n;
            }
            if (isRational(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_mul(n.mpq_t, this.mpq_t, val.mpq_t);
                return n;
            }
            if (isFloat(val)) {
                return val.mul(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR);
        },
        /** Returns the number with inverted sign. */
        neg() {
            const n = RationalFn(0, 1);
            gmp.mpq_neg(n.mpq_t, this.mpq_t);
            return n;
        },
        /** Returns the inverse of the number. */
        invert() {
            const n = RationalFn(0, 1);
            gmp.mpq_inv(n.mpq_t, this.mpq_t);
            return n;
        },
        /** Returns the absolute value of this number. */
        abs() {
            const n = RationalFn(0, 1);
            gmp.mpq_abs(n.mpq_t, this.mpq_t);
            return n;
        },
        /** Returns the result of the division of this number by the given one. */
        div(val) {
            if (typeof val === 'number' || isInteger(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_div(n.mpq_t, this.mpq_t, RationalFn(val).mpq_t);
                return n;
            }
            if (typeof val === 'string') {
                const n = RationalFn(val);
                gmp.mpq_div(n.mpq_t, this.mpq_t, n.mpq_t);
                return n;
            }
            if (isRational(val)) {
                const n = RationalFn(0, 1);
                gmp.mpq_div(n.mpq_t, this.mpq_t, val.mpq_t);
                return n;
            }
            if (isFloat(val)) {
                return ctx.floatContext.Float(this).div(val);
            }
            throw new Error(INVALID_PARAMETER_ERROR);
        },
        /** Returns true if the current number is equal to the provided number */
        isEqual(val) {
            if (typeof val === 'number' || isInteger(val)) {
                return gmp.mpq_equal(this.mpq_t, RationalFn(val).mpq_t) !== 0;
            }
            if (typeof val === 'string') {
                const n = RationalFn(val);
                return gmp.mpq_equal(this.mpq_t, n.mpq_t) !== 0;
            }
            if (isRational(val)) {
                return gmp.mpq_equal(this.mpq_t, val.mpq_t) !== 0;
            }
            if (isFloat(val)) {
                return val.isEqual(this);
            }
            throw new Error(INVALID_PARAMETER_ERROR);
        },
        /** Returns true if the current number is less than the provided number */
        lessThan(val) {
            return compare(this.mpq_t, val) < 0;
        },
        /** Returns true if the current number is less than or equal to the provided number */
        lessOrEqual(val) {
            return compare(this.mpq_t, val) <= 0;
        },
        /** Returns true if the current number is greater than the provided number */
        greaterThan(val) {
            return compare(this.mpq_t, val) > 0;
        },
        /** Returns true if the current number is greater than or equal to the provided number */
        greaterOrEqual(val) {
            return compare(this.mpq_t, val) >= 0;
        },
        /** Returns the numerator of the number */
        numerator() {
            const n = ctx.intContext.Integer();
            gmp.mpq_get_num(n.mpz_t, this.mpq_t);
            return n;
        },
        /** Returns the denominator of the number */
        denominator() {
            const n = ctx.intContext.Integer();
            gmp.mpq_get_den(n.mpz_t, this.mpq_t);
            return n;
        },
        /** Returns the sign of the current value (-1 or 0 or 1) */
        sign() {
            return gmp.mpq_sgn(this.mpq_t);
        },
        /** Converts current value to a JavaScript number */
        toNumber() {
            return gmp.mpq_get_d(this.mpq_t);
        },
        /** Converts the number to string */
        toString(radix = 10) {
            if (!Number.isSafeInteger(radix) || radix < 2 || radix > 62) {
                throw new Error('radix must have a value between 2 and 62');
            }
            return gmp.mpq_to_string(this.mpq_t, radix);
        },
        /** Converts the number to an integer */
        toInteger() {
            return ctx.intContext.Integer(this);
        },
        /** Converts the number to a floating-point number */
        toFloat() {
            return ctx.floatContext.Float(this);
        },
    };
    const parseParameters = (mpq_t, p1, p2) => {
        if (typeof p1 === 'number' && (p2 === undefined || typeof p2 === 'number')) {
            assertInt32(p1);
            if (p2 !== undefined) {
                assertInt32(p2);
                gmp.mpq_set_si(mpq_t, p1, Math.abs(p2));
                if (p2 < 0) {
                    gmp.mpq_neg(mpq_t, mpq_t);
                }
            }
            else {
                gmp.mpq_set_si(mpq_t, p1, 1);
            }
            return;
        }
        if (isInteger(p1) && p2 === undefined) {
            gmp.mpq_set_z(mpq_t, p1.mpz_t);
            return;
        }
        if (isRational(p1) && p2 === undefined) {
            gmp.mpq_set(mpq_t, p1.mpq_t);
            return;
        }
        const finalString = p2 !== undefined ? `${p1.toString()}/${p2.toString()}` : p1.toString();
        const res = gmp.mpq_set_string(mpq_t, finalString, 10);
        if (res !== 0) {
            throw new Error('Invalid number provided!');
        }
    };
    const RationalFn = (p1, p2) => {
        const instance = Object.create(RationalPrototype);
        instance.mpq_t = gmp.mpq_t();
        gmp.mpq_init(instance.mpq_t);
        parseParameters(instance.mpq_t, p1, p2);
        gmp.mpq_canonicalize(instance.mpq_t);
        mpq_t_arr.push(instance.mpq_t);
        return instance;
    };
    return {
        Rational: RationalFn,
        isRational: (val) => RationalPrototype.isPrototypeOf(val),
        destroy: () => {
            for (let i = mpq_t_arr.length - 1; i >= 0; i--) {
                gmp.mpq_clear(mpq_t_arr[i]);
                gmp.mpq_t_free(mpq_t_arr[i]);
            }
            mpq_t_arr.length = 0;
        }
    };
}

var mpfr_rnd_t;
(function (mpfr_rnd_t) {
    /** Round to nearest, with ties to even */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDN"] = 0] = "MPFR_RNDN";
    /** Round toward zero */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDZ"] = 1] = "MPFR_RNDZ";
    /** Round toward +Inf */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDU"] = 2] = "MPFR_RNDU";
    /** Round toward -Inf */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDD"] = 3] = "MPFR_RNDD";
    /** Round away from zero */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDA"] = 4] = "MPFR_RNDA";
    /** (Experimental) Faithful rounding */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDF"] = 5] = "MPFR_RNDF";
    /** (Experimental) Round to nearest, with ties away from zero (mpfr_round) */
    mpfr_rnd_t[mpfr_rnd_t["MPFR_RNDNA"] = -1] = "MPFR_RNDNA";
})(mpfr_rnd_t || (mpfr_rnd_t = {}));
var mpfr_flags;
(function (mpfr_flags) {
    mpfr_flags[mpfr_flags["MPFR_FLAGS_UNDERFLOW"] = 1] = "MPFR_FLAGS_UNDERFLOW";
    mpfr_flags[mpfr_flags["MPFR_FLAGS_OVERFLOW"] = 2] = "MPFR_FLAGS_OVERFLOW";
    mpfr_flags[mpfr_flags["MPFR_FLAGS_NAN"] = 4] = "MPFR_FLAGS_NAN";
    mpfr_flags[mpfr_flags["MPFR_FLAGS_INEXACT"] = 8] = "MPFR_FLAGS_INEXACT";
    mpfr_flags[mpfr_flags["MPFR_FLAGS_ERANGE"] = 16] = "MPFR_FLAGS_ERANGE";
    mpfr_flags[mpfr_flags["MPFR_FLAGS_DIVBY0"] = 32] = "MPFR_FLAGS_DIVBY0";
    mpfr_flags[mpfr_flags["MPFR_FLAGS_ALL"] = 63] = "MPFR_FLAGS_ALL";
})(mpfr_flags || (mpfr_flags = {}));
var mpfr_free_cache_t;
(function (mpfr_free_cache_t) {
    mpfr_free_cache_t[mpfr_free_cache_t["MPFR_FREE_LOCAL_CACHE"] = 1] = "MPFR_FREE_LOCAL_CACHE";
    mpfr_free_cache_t[mpfr_free_cache_t["MPFR_FREE_GLOBAL_CACHE"] = 2] = "MPFR_FREE_GLOBAL_CACHE"; /* 1 << 1 */
})(mpfr_free_cache_t || (mpfr_free_cache_t = {}));

function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const binding = yield getGMPInterface();
        const createContext = (options) => {
            const ctx = {
                intContext: null,
                rationalContext: null,
                floatContext: null,
            };
            ctx.intContext = getIntegerContext(binding, ctx);
            ctx.rationalContext = getRationalContext(binding, ctx);
            ctx.floatContext = getFloatContext(binding, ctx, options);
            return {
                types: {
                    Integer: ctx.intContext.Integer,
                    Rational: ctx.rationalContext.Rational,
                    Float: ctx.floatContext.Float,
                    Pi: ctx.floatContext.Pi,
                    EulerConstant: ctx.floatContext.EulerConstant,
                    EulerNumber: ctx.floatContext.EulerNumber,
                    Log2: ctx.floatContext.Log2,
                    Catalan: ctx.floatContext.Catalan,
                },
                destroy: () => {
                    ctx.intContext.destroy();
                    ctx.rationalContext.destroy();
                    ctx.floatContext.destroy();
                },
            };
        };
        return {
            binding,
            calculate: (fn, options = {}) => {
                const context = createContext(options);
                if (typeof fn !== 'function') {
                    throw new Error('calculate() requires a callback function');
                }
                const fnRes = fn(context.types);
                const res = fnRes === null || fnRes === void 0 ? void 0 : fnRes.toString();
                context.destroy();
                return res;
            },
            getContext: (options = {}) => {
                const context = createContext(options);
                return Object.assign(Object.assign({}, context.types), { destroy: context.destroy });
            },
            /** Resets the WASM instance (clears all previously allocated objects) */
            reset: () => __awaiter(this, void 0, void 0, function* () {
                return binding.reset();
            }),
        };
    });
}
const precisionToBits = (digits) => Math.ceil(digits * 3.3219281); // digits * log2(10)




/***/ }),

/***/ "../node_modules/path-browserify/index.js":
/*!************************************************!*\
  !*** ../node_modules/path-browserify/index.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!********************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(obj, key, value) {
  key = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!*****************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "../node_modules/@babel/runtime/helpers/esm/typeof.js");

function _toPrimitive(input, hint) {
  if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!*******************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "../node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "../node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function _toPropertyKey(arg) {
  var key = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arg, "string");
  return (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) === "symbol" ? key : String(key);
}

/***/ }),

/***/ "../node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!************************************************************!*\
  !*** ../node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "../node_modules/pako/dist/pako.esm.mjs":
/*!**********************************************!*\
  !*** ../node_modules/pako/dist/pako.esm.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Deflate": () => (/* binding */ Deflate_1),
/* harmony export */   "Inflate": () => (/* binding */ Inflate_1),
/* harmony export */   "constants": () => (/* binding */ constants_1),
/* harmony export */   "default": () => (/* binding */ pako),
/* harmony export */   "deflate": () => (/* binding */ deflate_1),
/* harmony export */   "deflateRaw": () => (/* binding */ deflateRaw_1),
/* harmony export */   "gzip": () => (/* binding */ gzip_1),
/* harmony export */   "inflate": () => (/* binding */ inflate_1),
/* harmony export */   "inflateRaw": () => (/* binding */ inflateRaw_1),
/* harmony export */   "ungzip": () => (/* binding */ ungzip_1)
/* harmony export */ });

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED$1               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH$1    = 3;
const MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS$1      = 256;
/* number of literal bytes 0..255 */

const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES$1       = 30;
/* number of distance codes */

const BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

const MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init$1 = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block$1(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally$1 = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

var _tr_init_1  = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1  = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants$2 = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_MEM_ERROR:       -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;




/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS$1 = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let HASH = HASH_ZLIB;


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH$3) ||
                        flush === Z_NO_FLUSH$2 ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};


/* ========================================================================= */
const deflate$2 = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$3)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$3;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$3;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK$1) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$3;
      }
    }
  }

  if (flush !== Z_FINISH$3) { return Z_OK$3; }
  if (s.wrap <= 0) { return Z_STREAM_END$3; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
var flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};

var common = {
	assign: assign,
	flattenChunks: flattenChunks
};

// String encode/decode helpers


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
var buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

const toString$1 = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate$1(options) {
  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED$1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = deflate_1$2.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}


var Deflate_1$1 = Deflate$1;
var deflate_2 = deflate$1;
var deflateRaw_1$1 = deflateRaw$1;
var gzip_1$1 = gzip$1;
var constants$1 = constants$2;

var deflate_1$1 = {
	Deflate: Deflate_1$1,
	deflate: deflate_2,
	deflateRaw: deflateRaw_1$1,
	gzip: gzip_1$1,
	constants: constants$1
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
const BAD$1 = 16209;       /* got a data error -- remain here until reset */
const TYPE$1 = 16191;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
var inffast = function inflate_fast(strm, start) {
  let _in;                    /* local strm.input */
  let last;                   /* have enough input while in < last */
  let _out;                   /* local strm.output */
  let beg;                    /* inflate()'s initial strm.output */
  let end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  let dmax;                   /* maximum distance from zlib header */
//#endif
  let wsize;                  /* window size or zero if not using window */
  let whave;                  /* valid bytes in the window */
  let wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  let s_window;               /* allocated sliding window, if wsize != 0 */
  let hold;                   /* local strm.hold */
  let bits;                   /* local strm.bits */
  let lcode;                  /* local strm.lencode */
  let dcode;                  /* local strm.distcode */
  let lmask;                  /* mask for first level of length codes */
  let dmask;                  /* mask for first level of distance codes */
  let here;                   /* retrieved table entry */
  let op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  let len;                    /* match length, unused bytes */
  let dist;                   /* match distance */
  let from;                   /* where to copy match from */
  let from_source;


  let input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  const state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;

const lbase = new Uint16Array([ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
]);

const lext = new Uint8Array([ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
]);

const dbase = new Uint16Array([ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
]);

const dext = new Uint8Array([ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
]);

const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
{
  const bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  let len = 0;               /* a code's length in bits */
  let sym = 0;               /* index of code symbols */
  let min = 0, max = 0;          /* minimum and maximum code lengths */
  let root = 0;              /* number of index bits for root table */
  let curr = 0;              /* number of index bits for current table */
  let drop = 0;              /* code bits to drop for sub-table */
  let left = 0;                   /* number of prefix codes available */
  let used = 0;              /* code entries in table used */
  let huff = 0;              /* Huffman code */
  let incr;              /* for incrementing code, index */
  let fill;              /* index for replicating entries */
  let low;               /* low bits for current root entry */
  let mask;              /* mask for low root bits */
  let next;             /* next available space in table */
  let base = null;     /* base value table to use */
//  let shoextra;    /* extra bits table to use */
  let match;                  /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null;

  let here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work;    /* dummy value--not used */
    match = 20;

  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    match = 0;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


var inftrees = inflate_table;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.






const CODES = 0;
const LENS = 1;
const DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES,
  Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;


/* STATES ====================================================================*/
/* ===========================================================================*/


const    HEAD = 16180;       /* i: waiting for magic header */
const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
const    TIME = 16182;       /* i: waiting for modification time (gzip) */
const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
const    DICTID = 16189;    /* i: waiting for dictionary check value */
const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
const        LENLENS = 16197;   /* i: waiting for code length code lengths */
const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
const            LEN = 16200;       /* i: waiting for length/lit/eob code */
const            LENEXT = 16201;    /* i: waiting for length extra bits */
const            DIST = 16202;      /* i: waiting for distance code */
const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
const            MATCH = 16204;     /* o: waiting for output space to copy string */
const            LIT = 16205;       /* o: waiting for output space to write literal */
const    CHECK = 16206;     /* i: waiting for 32-bit check value */
const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
const    DONE = 16208;      /* finished check, done -- remain here until reset */
const    BAD = 16209;       /* got a data error -- remain here until reset */
const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_WBITS = MAX_WBITS;


const zswap32 = (q) => {

  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
};


function InflateState() {
  this.strm = null;           /* pointer back to this zlib stream */
  this.mode = 0;              /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new Uint16Array(320); /* temporary storage for code lengths */
  this.work = new Uint16Array(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}


const inflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm ||
    state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};


const inflateResetKeep = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$1;
};


const inflateReset = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

};


const inflateReset2 = (strm, windowBits) => {
  let wrap;

  /* get the state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};


const inflateInit2 = (strm, windowBits) => {

  if (!strm) { return Z_STREAM_ERROR$1; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  const state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.strm = strm;
  state.window = null/*Z_NULL*/;
  state.mode = HEAD;     /* to pass state test in inflateReset2() */
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
};


const inflateInit = (strm) => {

  return inflateInit2(strm, DEF_WBITS);
};


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
let virgin = true;

let lenfix, distfix; // We have no pointers in JS, so keep tables separate


const fixedtables = (state) => {

  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);

    /* literal/length table */
    let sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
const updatewindow = (strm, src, end, copy) => {

  let dist;
  const state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new Uint8Array(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
};


const inflate$2 = (strm, flush) => {

  let state;
  let input, output;          // input/output buffers
  let next;                   /* next input INDEX */
  let put;                    /* next output INDEX */
  let have, left;             /* available input and output */
  let hold;                   /* bit buffer */
  let bits;                   /* bits in bit buffer */
  let _in, _out;              /* save starting available input and output */
  let copy;                   /* number of stored or match bytes to copy */
  let from;                   /* where to copy match bytes from */
  let from_source;
  let here = 0;               /* current decoding table entry */
  let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //let last;                   /* parent table entry */
  let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  let len;                    /* length to copy for repeats, bits to drop */
  let ret;                    /* return code */
  const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
  let opts;

  let n; // temporary variable for NEED_BITS

  const order = /* permutation of code lengths */
    new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


  if (inflateStateCheck(strm) || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$1;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          if (state.wbits === 0) {
            state.wbits = 15;
          }
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        if (len > 15 || len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        // !!! pako patch. Force use `options.windowBits` if passed.
        // Required to always use max window size by default.
        state.dmax = 1 << state.wbits;
        //state.dmax = 1 << len;

        state.flags = 0;               /* indicate zlib header */
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32_1(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Uint8Array(state.head.extra_len);
              }
              state.head.extra.set(
                input.subarray(
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  next + copy
                ),
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT$1;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          output.set(input.subarray(next, next + copy), put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inffast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if ((state.wrap & 4) && _out) {
            strm.adler = state.check =
                /*UPDATE_CHECK(state.check, put - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$1;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR$1;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH$1))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if ((state.wrap & 4) && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};


const inflateEnd = (strm) => {

  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }

  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};


const inflateGetHeader = (strm, head) => {

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK$1;
};


const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;

  let state;
  let dictid;
  let ret;

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK$1;
};


var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/

var inflate_1$2 = {
	inflateReset: inflateReset_1,
	inflateReset2: inflateReset2_1,
	inflateResetKeep: inflateResetKeep_1,
	inflateInit: inflateInit_1,
	inflateInit2: inflateInit2_1,
	inflate: inflate_2$1,
	inflateEnd: inflateEnd_1,
	inflateGetHeader: inflateGetHeader_1,
	inflateSetDictionary: inflateSetDictionary_1,
	inflateInfo: inflateInfo
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

var gzheader = GZheader;

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR
} = constants$2;

/* ===========================================================================*/


/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ''
  }, options || {});

  const opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new zstream();
  this.strm.avail_out = 0;

  let status  = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }

  this.header = new gzheader();

  inflate_1$2.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;

  if (this.ended) return false;

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = inflate_1$2.inflate(strm, _flush_mode);

    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);

      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        // Replace code with more verbose
        status = Z_NEED_DICT;
      }
    }

    // Skip snyc markers if more data follows and not raw mode
    while (strm.avail_in > 0 &&
           status === Z_STREAM_END &&
           strm.state.wrap > 0 &&
           data[strm.next_in] !== 0)
    {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }

    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }

    // Remember real `avail_out` value, because we may patch out buffer content
    // to align utf8 strings boundaries.
    last_avail_out = strm.avail_out;

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {

        if (this.options.to === 'string') {

          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail & realign counters
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

          this.onData(utf8str);

        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }

    // Must repeat iteration if out buffer is full
    if (status === Z_OK && last_avail_out === 0) continue;

    // Finalize if end of stream reached.
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);

  inflator.push(input);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) throw inflator.msg || messages[inflator.err];

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return inflate$1(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


var Inflate_1$1 = Inflate$1;
var inflate_2 = inflate$1;
var inflateRaw_1$1 = inflateRaw$1;
var ungzip$1 = inflate$1;
var constants = constants$2;

var inflate_1$1 = {
	Inflate: Inflate_1$1,
	inflate: inflate_2,
	inflateRaw: inflateRaw_1$1,
	ungzip: ungzip$1,
	constants: constants
};

const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;

const { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;



var Deflate_1 = Deflate;
var deflate_1 = deflate;
var deflateRaw_1 = deflateRaw;
var gzip_1 = gzip;
var Inflate_1 = Inflate;
var inflate_1 = inflate;
var inflateRaw_1 = inflateRaw;
var ungzip_1 = ungzip;
var constants_1 = constants$2;

var pako = {
	Deflate: Deflate_1,
	deflate: deflate_1,
	deflateRaw: deflateRaw_1,
	gzip: gzip_1,
	Inflate: Inflate_1,
	inflate: inflate_1,
	inflateRaw: inflateRaw_1,
	ungzip: ungzip_1,
	constants: constants_1
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ../src/index.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AssetLoader": () => (/* reexport safe */ _asset_loader__WEBPACK_IMPORTED_MODULE_0__.AssetLoader),
/* harmony export */   "BufferValue": () => (/* reexport safe */ _buffer_value__WEBPACK_IMPORTED_MODULE_1__.BufferValue),
/* harmony export */   "ObjectFlags_T": () => (/* reexport safe */ _unreal_un_object_flags__WEBPACK_IMPORTED_MODULE_3__.ObjectFlags_T),
/* harmony export */   "UEncodedFile": () => (/* reexport safe */ _unreal_un_encoded_file__WEBPACK_IMPORTED_MODULE_2__.UEncodedFile),
/* harmony export */   "UExport": () => (/* reexport safe */ _unreal_un_export__WEBPACK_IMPORTED_MODULE_6__.UExport),
/* harmony export */   "UImport": () => (/* reexport safe */ _unreal_un_import__WEBPACK_IMPORTED_MODULE_7__.UImport),
/* harmony export */   "UName": () => (/* reexport safe */ _unreal_un_name__WEBPACK_IMPORTED_MODULE_5__.UName),
/* harmony export */   "UNativePackage": () => (/* reexport safe */ _unreal_un_package__WEBPACK_IMPORTED_MODULE_4__.UNativePackage),
/* harmony export */   "UObject": () => (/* reexport safe */ _unreal_un_object__WEBPACK_IMPORTED_MODULE_8__.UObject),
/* harmony export */   "UPackage": () => (/* reexport safe */ _unreal_un_package__WEBPACK_IMPORTED_MODULE_4__.UPackage)
/* harmony export */ });
/* harmony import */ var _asset_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asset-loader */ "../src/asset-loader.ts");
/* harmony import */ var _buffer_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buffer-value */ "../src/buffer-value.ts");
/* harmony import */ var _unreal_un_encoded_file__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unreal/un-encoded-file */ "../src/unreal/un-encoded-file.ts");
/* harmony import */ var _unreal_un_object_flags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unreal/un-object-flags */ "../src/unreal/un-object-flags.ts");
/* harmony import */ var _unreal_un_package__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./unreal/un-package */ "../src/unreal/un-package.ts");
/* harmony import */ var _unreal_un_name__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./unreal/un-name */ "../src/unreal/un-name.ts");
/* harmony import */ var _unreal_un_export__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./unreal/un-export */ "../src/unreal/un-export.ts");
/* harmony import */ var _unreal_un_import__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./unreal/un-import */ "../src/unreal/un-import.ts");
/* harmony import */ var _unreal_un_object__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./unreal/un-object */ "../src/unreal/un-object.ts");









})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map