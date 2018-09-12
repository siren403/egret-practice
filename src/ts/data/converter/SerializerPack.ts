interface IPlatformSerializers {
    default: { before: DataConverter.IBeforeSerializer[], after: DataConverter.IAfterSerializer[] };
    [key: string]: { before: DataConverter.IBeforeSerializer[], after: DataConverter.IAfterSerializer[] };
}

abstract class BaseSerializerPack implements DataConverter.ISerializerPack {

    protected serializers: IPlatformSerializers = null;

    public getSerializerVersion(clientVersion: string): string {
        let returnVersion = '';

        if (this.serializers[clientVersion] !== undefined) {
            returnVersion = clientVersion;
        } else {
            for (let key in this.serializers) {
                if (key === 'default') {
                    continue;
                }
                if (this.serializers[key] === this.serializers.default) {
                    returnVersion = key;
                    break;
                }
            }
        }

        return returnVersion;
    }

    public getBefore(version: string): DataConverter.IBeforeSerializer[] {
        if (this.serializers[version] !== undefined) {
            return this.serializers[version].before;
        } else {
            return this.serializers.default.before;
        }
    }
    public getAfter(version: string): DataConverter.IAfterSerializer[] {
        if (this.serializers[version] !== undefined) {
            return this.serializers[version].after;
        } else {
            return this.serializers.default.after;
        }
    }

    public serialize(data: Object, info: DataConverter.ISerializeInfo): string {

        let before = data;

        for (let serializer of this.getBefore(info.version)) {
            before = serializer.serialize(before, info);
        }

        let after: string = JSON.stringify(before);

        for (let serializer of this.getAfter(info.version)) {
            after = serializer.serialize(after, info);
        }

        return after;
    }
    public deserialize(data: string, info: DataConverter.ISerializeInfo): Object {

        let after: string = data;

        let afterSerializers = this.getAfter(info.version).concat().reverse();
        for (let serializer of afterSerializers) {
            after = serializer.deserialize(after, info);
        }

        let before: Object = JSON.parse(after);

        let beforeSerializers = this.getBefore(info.version).concat().reverse();
        for (let serializer of beforeSerializers) {
            before = serializer.deserialize(before, info);
        }

        return before;
    }
}

