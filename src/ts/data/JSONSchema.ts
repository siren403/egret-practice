interface IJSONSchemaInfo {

    type: "object" | "number" | "string" | "boolean" | "array" | "map";
    /** array 또는 map 일 경우 요소들의 스키마 정보*/
    schema?: IJSONSchemaInfo;
    /**핃드 명 단순화 시 변환할 필드명 */
    simple?: string;

    [key: string]: any;
}

class JSONSchema {

    /**
     * {
            "type":"object",
            "currentAge": {
                "type": "number"
            },
            "eachAgeStates": {
                "type": "map",
                "schema":{
                    "type":"object",
                    "id": { "type": "string" },
                    "age": { "type": "number" }
                }
            },
            "setting":{
                "type":"object",
                "isbgm":{ 
                    "type":"boolean"
                }
            },
            "list":{
                "type":"array",
                 "schema":{
                    "type":"number"
                }
            }
        }
     */
    private schema: IJSONSchemaInfo = null;
    private simplifySchema: IJSONSchemaInfo = null;

    public constructor(schema: IJSONSchemaInfo) {
        this.schema = schema;
    }

    public throwValidate(instance: any): void {
        this.innerValidate(this.schema, instance, "root", true);
    }
    public validate(instance: any): boolean {
        return this.innerValidate(this.schema, instance, "root", false);
    }
    public simplify(instance: any): void {
        this.innerSimplify(this.schema, instance, "root");
    }
    public desimplify(instance: any): void {
        this.innerDesimplify(this.schema, instance, "root");
    }


    private innerValidate(schema: IJSONSchemaInfo, instance: any, latestKey: string, isThrow: boolean): boolean {
        let type = schema.type;
        if (type === undefined) {
            throw new Error('not found type property');
        }

        let result: boolean = true;
        switch (type) {
            case "object":
                if ((instance instanceof Object) === false) {
                    if (isThrow === true) {
                        throw new Error('invalidate type : ' + latestKey + '/' + type + '/' + instance);
                    } else {
                        return false;
                    }
                }
                for (let key in instance) {
                    let nextSchema = schema[key];
                    if (nextSchema === undefined) {
                        continue;
                    }
                    let nextTarget = instance[key];
                    result = this.innerValidate(nextSchema, nextTarget, key, isThrow);
                }
                break;
            case "map":
                let mapSchema = schema.schema;
                for (let key in instance) {
                    result = this.innerValidate(mapSchema, instance[key], latestKey + '/' + key, isThrow);
                }
                break;
            case "array":
                let arraySchema = schema.schema;
                for (let item of instance) {
                    result = this.innerValidate(arraySchema, item, latestKey + '/' + item, isThrow);
                }
                break;
            case "number":
            case "string":
            case "boolean":
                if ((typeof instance) !== type) {
                    if (isThrow === true) {
                        throw new Error('invalidate type : ' + latestKey + '/' + type + '/' + instance);
                    } else {
                        return false;
                    }
                }
                break;
        }
        return result;
    }
    private innerSimplify(schema: IJSONSchemaInfo, instance: any, latestKey: string): void {
        let type = schema.type;
        if (type === undefined) {
            throw new Error('not found type property');
        }
        switch (type) {
            case "object":
                for (let key in instance) {
                    let nextSchema = schema[key];
                    if (nextSchema === undefined) {
                        continue;
                    }
                    let nextTarget = instance[key];
                    this.innerSimplify(nextSchema, nextTarget, key);
                    let simpleKey = nextSchema.simple;
                    if (simpleKey !== undefined) {
                        let temp = instance[key];
                        delete instance[key];
                        instance[simpleKey] = temp;
                    }
                }
                break;
            case "map":
                let mapSchema = schema.schema;
                for (let key in instance) {
                    this.innerSimplify(mapSchema, instance[key], latestKey + '.' + key);
                }
                break;
            case "array":
                let arraySchema = schema.schema;
                for (let item of instance) {
                    this.innerSimplify(arraySchema, item, latestKey + '.' + item);
                }
                break;
        }
    }
    private innerDesimplify(schema: IJSONSchemaInfo, instance: any, latestKey: string): void {
        let type = schema.type;
        if (type === undefined) {
            throw new Error('not found type property');
        }
        let continueFields = [
            "type",
            "schema",
            "simple"
        ];
        switch (type) {
            case "object":
                for (let key in schema) {

                    if (continueFields.indexOf(key) !== -1) {
                        continue;
                    }

                    let nextSchema = schema[key];
                    let nextTarget = null;

                    if (nextSchema.simple !== undefined && instance[nextSchema.simple] !== undefined) {
                        nextTarget = instance[nextSchema.simple];
                    } else if (instance[key] !== undefined) {
                        nextTarget = instance[key];
                    } else {
                        continue;
                    }
                    this.innerDesimplify(nextSchema, nextTarget, key);

                    if (nextSchema.simple !== undefined && instance[nextSchema.simple] !== undefined) {
                        let temp = instance[nextSchema.simple];
                        delete instance[nextSchema.simple];
                        instance[key] = temp;


                    }
                }
                break;
            case "map":
                let mapSchema = schema.schema;
                for (let key in instance) {
                    this.innerDesimplify(mapSchema, instance[key], latestKey + '.' + key);
                }
                break;
            case "array":
                let arraySchema = schema.schema;
                for (let item of instance) {
                    this.innerDesimplify(arraySchema, item, latestKey + '.' + item);
                }
                break;
        }
    }


}