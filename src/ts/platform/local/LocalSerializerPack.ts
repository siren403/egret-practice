class LocalSerializerPack extends BaseSerializerPack {
    public constructor() {
        super();
        let serializers: IPlatformSerializers = {
            default: null
        }

        serializers["1.0.0"] = {
            before: [],
            after: []
        }

        serializers.default = serializers["1.0.0"];

        this.serializers = serializers;
    }
}