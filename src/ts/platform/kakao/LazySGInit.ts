class LazySGInit implements ILazyAsync {

    public constructor(
        private initData: SG.ISG
    ) { }

    public do(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SG.UI.setFloatingPos({ xPos: 98, yPos: 98 }, function (status, result) { });
            // let initData: SG.ISG = {
            //     appId: global.emong.config.appId,
            //     snackId: global.emong.config.gameId,
            //     snackVer: global.emong.config.snackVer,
            //     appKey: global.emong.config.appKey
            // };
            SG.init(this.initData, (status, result) => {
                if (status === 200) {
                    resolve();
                } else if (status === 404) {
                    SG.login((status, result) => {
                        if (status === 200) {
                            resolve();
                        } else {
                            //TODO: log login fail
                        }
                    });
                } else {
                    window.close();
                }
            });
        });
    }
}