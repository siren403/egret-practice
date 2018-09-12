class FacebookSerializerPack extends BaseSerializerPack {
    public constructor() {
        super();
        let platform = Container.resolve(PlatformProvider);
        let Id = platform.getUserId();

        let serializers: IPlatformSerializers = {
            default: null
        }
        serializers["1.0.0"] = {
            before: [],
            after: [
                new AESSerializer(Id)
            ]
        }

        serializers.default = serializers["1.0.0"];

        this.serializers = serializers;
    }
}