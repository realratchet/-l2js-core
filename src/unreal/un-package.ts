import BufferValue from "../buffer-value";
import UClass from "./un-class";
import UEncodedFile from "./un-encoded-file";
import UEnum from "./un-enum";
import UExport from "./un-export";
import UFunction from "./un-function";
import UGeneration from "./un-generation";
import UHeader from "./un-header";
import UImport from "./un-import";
import UName from "./un-name";
import UObject from "./un-object";
import ObjectFlags_T from "./un-object-flags";
import UStruct from "./un-struct";
import UConst from "./un-const";
import * as UnProperties from "./un-property/un-properties";
import UState from "./un-state";
import { flagBitsToDict } from "../utils/flags";


abstract class APackage extends UEncodedFile {
    public readonly loader: C.AAssetLoader;

    public exports: UExport[];
    public imports: UImport[];
    public nameTable: UName[];
    public header: UHeader;

    public exportGroups: Record<string, { index: number; export: UExport; }[]>;
    public importGroups: Record<string, { import: UImport; index: number; }[]>;

    public nameHash = new Map<string, number>();

    public readonly isCore: boolean;
    public readonly isEngine: boolean;
    public readonly isNative: boolean = false;

    public isDecoded() { return !!this.buffer; }

    constructor(loader: C.AAssetLoader, path: string) {
        super(path);

        this.loader = loader;

        this.isCore = path.toLocaleLowerCase().endsWith("core.u");
        this.isEngine = path.toLocaleLowerCase().endsWith("engine.u");
    }

    public async decode(): Promise<this> {
        if (this.buffer) return this;
        if (this.promiseDecoding) {
            await this.promiseDecoding;
            return this;
        }

        const readable = this.asReadable();
        const signature = await readable._doDecode();

        if (signature.value !== 0x9E2A83C1)
            throw new Error(`Invalid signature: '0x${signature.value.toString(16).toUpperCase()}' expected '0x9E2A83C1'`);

        const header = new UHeader();
        const uint32 = new BufferValue(BufferValue.uint32);
        const int32 = new BufferValue(BufferValue.uint32);

        header.version = readable.read(uint32).value;

        // const v = new DataView(new ArrayBuffer(4));
        // v.setUint32(0, header.version, true);
        // const b = new BufferValue(BufferValue.uint32);

        // b.bytes = v;

        // debugger;

        header._packageFlags = readable.read(int32).value;
        header.packageFlags = flagBitsToDict(header._packageFlags, PackageFlags_T);
         
        header.packageFlags

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
            console.assert(header._packageFlags === 0x1);
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

            const generationCount = readable.read(new BufferValue(BufferValue.int32)).value;

            if (readable.path === "assets/maps/20_21.unr") {
                console.assert(generationCount === 1);
            }

            for (let i = 0, gc = generationCount; i < gc; i++) {
                const gen = new UGeneration();

                gen.exportCount = readable.read(uint32).value;
                gen.nameCount = readable.read(uint32).value;

                header.generations.push(gen);
            }
        }

        const [nameTable, nameHash] = readable.loadNameTable(header);
        const imports = readable.loadImportTable(header, nameTable);
        const exports = readable.loadExportTable(header, nameTable);

        readable.exports = exports;
        readable.imports = imports;
        readable.nameTable = nameTable;
        readable.nameHash = nameHash;
        readable.header = header;

        if (this.isCore) {
            const nativeIndex = -(imports.length + 1);
            for (const imp of imports) {
                if (imp.className === "Package")
                    continue;

                if (imp.classPackage !== "Core")
                    continue;

                imp.classPackage = "Native";
                imp.idPackage = nativeIndex;

                {
                    const className = imp.objectName;

                    registerNameTable(nameTable, nameHash, className);

                    {
                        const exp = new UExport();

                        exp.index = exports.length
                        exp.idClass = -(imp.index + 1);
                        exp.idSuper = 0;
                        exp.idPackage = nativeIndex;
                        exp.idObjectName = nameHash.get(className);
                        exp.objectName = className;
                        exp.flags = ObjectFlags_T.Native;
                        exp.size = 0;
                        exp.offset = 0;

                        exports.push(exp);
                    }
                }
            }

            addPackageDependendency(nameTable, nameHash, imports, "Native")
            addClassDependency(nameTable, nameHash, imports, exports, "Native", "State");
            addClassDependency(nameTable, nameHash, imports, exports, "Native", "DelegateProperty");

        } else if (this.isEngine) {
            addPackageDependendency(nameTable, nameHash, imports, "Native")
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

            list.push({ import: imp, index: -index - 1 });

            return accum;
        }, {} as Record<string, { import: UImport, index: number }[]>);

        readable.exportGroups = readable.exports.reduce((accum, exp, index) => {

            const expType = readable.getPackageName(exp.idClass) || "Class";
            const list = accum[expType] = accum[expType] || [];

            list.push({ index, export: exp });

            return accum;
        }, {} as Record<string, { index: number, export: UExport }[]>);

        Object.assign(this, readable, { isReadable: false });

        return this;
    }

    protected loadNameTable(header: UHeader): [UName[], Map<string, number>] {
        this.seek(header.nameOffset, "set");

        const nameTable: UName[] = [];
        const nameHash = new Map<string, number>();

        const char = new BufferValue<"char">(BufferValue.char);
        const uint32 = new BufferValue<"uint32">(BufferValue.uint32);

        for (let i = 0, nc = header.nameCount; i < nc; i++) {
            const uname = new UName();

            uname.name = this.read(char).string;
            uname.flags = this.read(uint32).value;

            nameTable.push(uname);
            nameHash.set(uname.name, i);
        }

        return [nameTable, nameHash];
    }

    protected loadExportTable(header: UHeader, nameTable: UName[]) {
        this.seek(header.exportOffset, "set");

        const exports: UExport[] = [];
        const compat32 = new BufferValue(BufferValue.compat32);
        const uint32 = new BufferValue(BufferValue.uint32);

        for (let i = 0, ec = header.exportCount; i < ec; i++) {
            const uexport = new UExport();

            uexport.idClass = this.read(compat32).value;
            uexport.idSuper = this.read(compat32).value;
            uexport.idPackage = this.read(uint32).value;
            uexport.idObjectName = this.read(compat32).value;

            uexport.index = i;
            uexport.objectName = nameTable[uexport.idObjectName].name;

            uexport.flags = this.read(uint32).value;
            uexport.size = this.read(compat32).value;

            if (uexport.size > 0)
                uexport.offset = this.read(compat32).value;

            exports.push(uexport);
        }

        return exports;
    }

    protected loadImportTable(header: UHeader, nameTable: UName[]) {
        this.seek(header.importOffset, "set");

        const imports: UImport[] = [];
        const compat32 = new BufferValue(BufferValue.compat32);
        const int32 = new BufferValue(BufferValue.int32);

        for (let i = 0, ic = header.importCount; i < ic; i++) {
            const uimport = new UImport();

            uimport.index = i;

            uimport.idClassPackage = this.read(compat32).value;
            uimport.classPackage = nameTable[uimport.idClassPackage].name;

            uimport.idClassName = this.read(compat32).value;
            uimport.className = nameTable[uimport.idClassName].name;

            uimport.idPackage = this.read(int32).value;

            uimport.idObjectName = this.read(compat32).value;
            uimport.objectName = nameTable[uimport.idObjectName].name;

            imports.push(uimport);
        }

        return imports;
    }

    public getPackageName(index: number) {
        return index < 0
            ? this.imports[-index - 1].objectName as string
            : index > 0
                ? this.exports[index - 1].objectName as string
                : null;
    }

    public toString() { return `Package=(${this.path}, imports=${this.imports.length}, exports=${this.exports.length})`; }

    public getImportEntry(objref: number) {
        if (objref === 0)
            return null;
        else if (objref > 0)
            throw Error("Expected an import table entry");

        const index = -objref - 1;
        if (index >= this.imports.length)
            throw Error("Import table entry out of bounds!");

        return this.imports[index];
    }

    public loadExportObject(index: number) {
        const entry = this.exports[index];
        const objname = entry.objectName;

        if (entry.idClass !== 0) {
            const objclass: UClass = this.fetchObject(entry.idClass) as UClass;

            if (!objclass) {
                debugger;
                throw Error("Could not find the object class for " + objname);
            }

            const object = entry.object = this.newObject(objclass) as UObject;

            object.setExport(this, entry);

        } else {
            let objbase = entry.idSuper === 0 ? null : this.fetchObject(entry.idSuper) as UClass;
            let pkg: APackage = this;

            if (!objbase && objname !== "Object") {
                debugger;
                pkg = this.loader.getCorePackage();

                if (!pkg.isDecoded()) throw new Error(`Package must be decoded: 'Core'`);

                objbase = pkg.fetchObjectByType("Class", "Object") as UClass;
            }

            if (!this.exports[index].object) {
                const obj = new UClass();

                this.exports[index].object = obj as unknown as UObject;

                if (entry.size === 0) {
                    if (entry.flags !== ObjectFlags_T.Native)
                        throw new Error("0xdeadbeef")

                    obj.friendlyName = objname;
                }

                obj.setExport(pkg, entry);
            }
        }
    }

    public fetchObject<T extends UObject = UObject>(objref: number): T {
        if (objref > 0) {   // Export table object
            const index = objref - 1;

            if (index > this.exports.length)
                throw new Error("Invalid object reference");

            const entry = this.exports[index];

            if (!entry.object)
                this.loadExportObject(index);

            return entry.object as T;
        } else if (objref < 0) {    // Import table object

            const entry = this.getImportEntry(objref);
            let entrypackage = this.getImportEntry(entry.idPackage);

            let groupName = "None";
            if (entrypackage.idPackage !== 0)
                groupName = entrypackage.objectName;

            while (entrypackage.idPackage !== 0)
                entrypackage = this.getImportEntry(entrypackage.idPackage);

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

            if (!obj && packageName == "UnrealI")
                throw new Error("Not yet implemented");
            else if (!obj && packageName == "UnrealShare")
                throw new Error("Not yet implemented");

            return obj as T;
        }

        return null;
    }

    public fetchObjectByType<T extends UObject>(className: string, objectName: string, groupName: string = "None") {
        const index = this.findObjectRef(className, objectName, groupName);

        return this.fetchObject<T>(index);
    }

    protected findObjectRef(className: string, objectName: string, groupName: string = "None"): number {
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

                    if (other && className === other.objectName)
                        return exp.index + 1;

                    debugger;
                } else if (exp.idClass < 0) {
                    const clsImport = this.imports[-exp.idClass - 1];

                    if (clsImport && objectName === clsImport.objectName) {
                        if (clsImport.classPackage === "Native")
                            return -(clsImport.index + 1);

                        return exp.index + 1;
                    }
                } else if (exp.idClass === 0) return exp.index + 1;

            } else if (exp.idClass !== 0) {

                const obj = this.fetchObject(exp.idClass) as any as typeof UObject;

                if (obj) {
                    const inheritenceChain = obj instanceof UClass ? [obj.loadSelf().friendlyName] : obj.inheritenceChain;

                    if (!inheritenceChain)
                        debugger;

                    if (inheritenceChain.includes(className))
                        return exp.index + 1;
                }
            }
        }

        return 0;
    }

    public newObject<T extends UObject = UObject>(objclass: UClass | ObjectConstructor): T {
        if (objclass instanceof UClass) {
            const native = this.loader.getNativePackage();
            const Constructor = objclass.buildClass<T>(native);

            return new Constructor();
        }

        const obj = new (objclass as ObjectConstructor)();

        return obj as T;
    }
}

abstract class ANativePackage extends APackage {
    public readonly isCore = false;
    public readonly isEngine = false;
    public readonly isNative = true;

    public constructor(loader: C.AAssetLoader) { super(loader, "__native__.u"); }

    protected readArrayBuffer(): Promise<ArrayBuffer> { throw new Error("Method not used by native package."); }
    public toBuffer(): ArrayBuffer { throw new Error("Method not used by native package."); }

    protected registerNativeClasses() {
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
    }

    public async decode(): Promise<this> {
        if (this.buffer) return this;

        const tStart = performance.now();

        this.imports = [];
        this.exports = [];
        this.nameTable = [];
        this.nameHash = new Map();

        this.registerNativeClasses();

        this.buffer = new ArrayBuffer(0);

        console.log(`'${this.path}' loaded in ${performance.now() - tStart} ms`);

        return this;
    }

    public getStructConstructor<T extends typeof UObject = typeof UObject>(constructorName: string): new () => T { return UObject as any; }
    protected getNonNativeConstructor<T extends typeof UObject = typeof UObject>(constructorName: C.NativeTypes_T): new () => T { return UObject as any; }

    public getConstructor<T extends typeof UObject = typeof UObject>(constructorName: C.NativeTypes_T): new () => T {
        let Constructor: any;

        switch (constructorName) {
            case "Class": Constructor = UClass; break;
            case "Struct": Constructor = UStruct; break;
            case "Const": Constructor = UConst; break;
            case "Enum": Constructor = UEnum; break;
            case "Function": Constructor = UFunction; break;
            case "State": Constructor = UState; break;

            case "FloatProperty": Constructor = UnProperties.UFloatProperty; break;
            case "ByteProperty": Constructor = UnProperties.UByteProperty; break;
            case "StrProperty": Constructor = UnProperties.UStrProperty; break;
            case "IntProperty": Constructor = UnProperties.UIntProperty; break;
            case "BoolProperty": Constructor = UnProperties.UBoolProperty; break;
            case "NameProperty": Constructor = UnProperties.UNameProperty; break;
            case "ClassProperty": Constructor = UnProperties.UClassProperty; break;
            case "ArrayProperty": Constructor = UnProperties.UArrayProperty; break;
            case "StructProperty": Constructor = UnProperties.UStructProperty; break;
            case "ObjectProperty": Constructor = UnProperties.UObjectProperty; break;
            case "DelegateProperty": Constructor = UnProperties.UDelegateProperty; break;

            default: Constructor = this.getNonNativeConstructor(constructorName); break;
        }

        return Constructor;
    }

    protected registerNativeClass(className: C.NativeTypes_T, baseClass: C.NativeTypes_T | "None" = "None"): void {
        if (!this.nameHash.has(className)) {
            const name = new UName();

            name.name = className;
            name.flags = 0;

            this.nameTable.push(name);
            this.nameHash.set(className, this.nameTable.length - 1);
        }

        const exp = new UExport();

        exp.index = this.exports.length
        exp.idClass = 0;
        exp.idSuper = baseClass === "None" ? 0 : this.findObjectRef("Class", baseClass);
        exp.idPackage = 0;
        exp.idObjectName = this.nameHash.get(className);
        exp.objectName = className;
        exp.flags = ObjectFlags_T.Native;
        exp.size = 0;
        exp.offset = 0;

        this.exports.push(exp);
    }
}

enum PackageFlags_T {
    NoFlags = 0,
    AllowDownload = 0x0001, // Allow downloading package
    ClientOptional = 0x0002, // Purely optional for clients
    ServerSideOnly = 0x0004, // Only needed on the server side
    BrokenLinks = 0x0008, // Loaded from linker with broken import links
    Unsecure = 0x0010, // Not trusted
    Need = 0x8000 // Client needs to download this package
};

export default APackage;
export { APackage, ANativePackage, PackageFlags_T };

function registerNameTable(nameTable: UName[], nameHash: Map<string, number>, value: string) {
    if (nameHash.has(value)) return nameHash.get(value);

    const name = new UName();

    name.name = value;
    name.flags = 0;
    name.isFake = true;

    nameTable.push(name);
    nameHash.set(value, nameTable.length - 1);

    return name;
}

function addPackageDependendency(nameTable: UName[], nameHash: Map<string, number>, imports: UImport[], classPackage: string) {
    registerNameTable(nameTable, nameHash, "Native");

    const imp = new UImport();

    const className = "Package";
    const idClassName = nameHash.get("Package");
    const idClassPackage = nameHash.get(classPackage);

    imp.className = className;
    imp.classPackage = classPackage;
    imp.idClassName = idClassName;
    imp.idClassPackage = idClassPackage;
    imp.idObjectName = idClassPackage;
    imp.idPackage = 0
    imp.index = imports.length;
    imp.objectName = classPackage;
    imp.isFake = true;

    imports.push(imp);
}
function addClassDependency(nameTable: UName[], nameHash: Map<string, number>, imports: UImport[], exports: UExport<UObject>[], classPackage: string, objectName: string) {
    registerNameTable(nameTable, nameHash, objectName);

    const imp = new UImport();
    const exp = new UExport();
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

    exp.index = exports.length
    exp.idClass = -(imp.index + 1);
    exp.idSuper = 0;
    exp.idPackage = nativeIndex;
    exp.idObjectName = idObjectName;
    exp.objectName = objectName;
    exp.flags = ObjectFlags_T.Native;
    exp.size = 0;
    exp.offset = 0;
    exp.isFake = true;

    imports.push(imp);
    exports.push(exp);

    return { imp, exp };
}