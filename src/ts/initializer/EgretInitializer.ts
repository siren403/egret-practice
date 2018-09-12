interface IBuilder {
    build(): IInitializeAsync;
}

declare interface IEgretInitBuilder extends IBuilder {
    insert(instance: ILazyAsync): IEgretInitBuilder;
    append(instance: ILazyAsync): IEgretInitBuilder;
}

interface IInitializeAsync {
    initialize(): Promise<any>;
}

class EgretInitializeBuilder implements IEgretInitBuilder, IInitializeAsync {

    private _processes: ILazyAsync[] = null;

    private constructor() {
        this._processes = [];
    }

    public static create(): IEgretInitBuilder {
        let instance = new EgretInitializeBuilder();
        return instance;
    }

    public build(): IInitializeAsync {

        return this;
    }

    public async initialize(): Promise<any> {
        for (let i = 0; i < this._processes.length; i++) {
            await this._processes[i].do();
        }
        this._processes.splice(0);
        this._processes = null;
    }
    public append(instance: ILazyAsync): IEgretInitBuilder {
        this._processes.push(instance);
        return this;
    }

    public insert(instance: ILazyAsync): IEgretInitBuilder{
        this._processes.unshift(instance);
        return this;
    }
}


