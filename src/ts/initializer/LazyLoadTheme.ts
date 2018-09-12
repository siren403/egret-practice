class LazyLoadTheme implements ILazyAsync {

    public constructor(
        private _filePath: string,
        private _stage: egret.Stage
    ) {

    }

    public do(): Promise<any> {
        return new Promise((resolve, reject) => {
            let theme = new eui.Theme(this._filePath, this._stage);
            theme.once(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }
}