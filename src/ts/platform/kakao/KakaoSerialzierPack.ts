class KakaoSerializerPack extends BaseSerializerPack {

    public constructor() {
        super();

        let serializers: IPlatformSerializers = {
            default: null
        }
        serializers["1.0.0"] = {
            before: [
                new Simplify(
                    // {
                    //     key: StoreDefine.KEY_AGE_STATE,
                    //     schema: DefaultAgeState.SCHEMA
                    // }, {
                    //     key: StoreDefine.KEY_BOARD_STATE,
                    //     schema: DefaultBoardState.SCHEMA
                    // }
                )
            ],
            after: [
                // new LzStringSerializer()
            ]
        }

        serializers.default = serializers["1.0.0"];


        this.serializers = serializers;
    }

}