namespace DataConverter {

    interface ISerializer {
    }

    export interface IBeforeSerializer extends ISerializer {

        serialize(data: Object, info: ISerializeInfo): Object;
        deserialize(data: Object, info: ISerializeInfo): Object;
    }
    export interface IAfterSerializer extends ISerializer {
        serialize(data: string, info: ISerializeInfo): string;
        deserialize(data: string, info: ISerializeInfo): string;
    }


    interface IValidater {
        validate(data: string): boolean;
    }

    export interface ISerializeInfo {
        version: string;
        key: string;
    }
    export interface ISerializerPack {
        // getBefore(): IBeforeSerializer[];
        // getAfter(): IAfterSerializer[];
        getSerializerVersion(clientVersion: string): string;
        serialize(data: Object, info: ISerializeInfo): string;
        deserialize(data: string, info: ISerializeInfo): Object;
    }

    interface IMetaData {
        version: string;
    }
    interface ISerializedData {
        meta: IMetaData;
        data: string;
    }
    const serializedDataSchemaInfo: IJSONSchemaInfo = {
        type: "object",
        "meta": {
            type: "object",
            "version": { type: "string" }
        } as IJSONSchemaInfo,
        "data": { type: "string" }
    }
    const serializedDataSchema: JSONSchema = new JSONSchema(serializedDataSchemaInfo);


    let currentVersion: string = '';
    let converterValidater: IValidater = null;

    let serializerPack: ISerializerPack = null;

    export function initialize(
        serializer: ISerializerPack,
        version: string = "1.0.0"
    ): void {
        currentVersion = version;
        serializerPack = serializer
    }

    export function usingValidater(validater: IValidater): void {
        converterValidater = validater;
    }

    export function serialize(key: string, data: Object): ISerializedData {
        let before: Object = data;

        // let serializerPack = getVersionSerializerPack(version);
        let info: ISerializeInfo = {
            version: currentVersion,
            key: key
        };
        let after = serializerPack.serialize(before, info);

        if (converterValidater !== null && converterValidater.validate(after) === false) {
            // throw new Error('serialize error');
        }

        let result: ISerializedData = {
            meta: {
                version: serializerPack.getSerializerVersion(currentVersion)
            },
            data: after
        }
        return result;
    }

    export function deserialize(key: string, serializedData: ISerializedData): Object {
        // let serializerPack = getVersionSerializerPack(serializedData.meta.version);
        let info: ISerializeInfo = {
            version: serializedData.meta.version,
            key: key
        };
        let data = serializerPack.deserialize(serializedData.data, info);
        return data;
    }

    export function isSerializedData(obj: Object): boolean {
        let data: ISerializedData = obj as ISerializedData;
        let result = serializedDataSchema.validate(obj);
        return result;
    }

    // function getVersionSerializerPack(version: string): ISerializerPack {
    //     let serializerPack = defaultSerializer;
    //     if (versionSerializers[version] !== undefined) {
    //         serializerPack = versionSerializers[version];
    //     }
    //     return serializerPack
    // }

    class ByteLengthValidater implements IValidater {

        public constructor(
            private limitLength: number
        ) { }

        public validate(data: string): boolean {
            let dataLength = String.getByteLength(data);
            debug.log("[DataConverter.ByteLengthValidater]", dataLength, this.limitLength, data);
            return dataLength > this.limitLength;
        }
    }
}