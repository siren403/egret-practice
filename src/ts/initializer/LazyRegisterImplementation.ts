class LazyRegisterImplementation implements ILazyAsync {

    public constructor(
        private _name: string,
        private _instance: any
    ) {

    }

    public do(): Promise<any> {
        egret.registerImplementation(this._name, this._instance);
        return Promise.resolve();
    }
}