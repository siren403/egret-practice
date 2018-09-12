interface ISimplifySchema {
    key: string;
    schema: IJSONSchemaInfo;
}

class Simplify implements DataConverter.IBeforeSerializer {

    private schema: IMap<JSONSchema> = null;


    public constructor(...schemas: ISimplifySchema[]) {
        this.schema = {};
        for (let element of schemas) {
            if (this.schema[element.key] === undefined) {
                this.schema[element.key] = new JSONSchema(element.schema);
            } else {
                throw new Error('duplicate schema key : ' + JSON.stringify(element));
            }
        }
    }

    public serialize(data: Object, info: DataConverter.ISerializeInfo): Object {
        if (this.schema[info.key] !== undefined) {
            let copyData = JSON.parse(JSON.stringify(data));
            this.schema[info.key].simplify(copyData);
            return copyData;
        }
        return data;
    }

    public deserialize(data: Object, info: DataConverter.ISerializeInfo): Object {
        if (this.schema[info.key] !== undefined) {
            let copyData = JSON.parse(JSON.stringify(data));
            this.schema[info.key].desimplify(copyData);
            return copyData;
        }
        return data;
    }
}