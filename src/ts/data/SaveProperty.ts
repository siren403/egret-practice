interface ISaveProperty<T> {
    set(value: T): void;
    get(): T;
    remove(): void;
}
interface IAsynSaveProperty<T> {
    set(value: T): Promise<void>;
    get(): Promise<T>;
    remove(): Promise<void>;
}

abstract class BaseSaveProprty<T>{
    protected value: T;
    protected platform: IPlatformProvider = null;
    public constructor(
        protected key: string,
        protected defaultValue: T
    ) {
        this.platform = Container.resolve(PlatformProvider);
    }
}

class LocalProperty<T> extends BaseSaveProprty<T> implements ISaveProperty<T>{

    public get(): T {
        this.value = this.platform.getLocalData<T>(this.key, this.defaultValue);
        return this.value;
    }

    public set(value: T) {
        this.value = value;
        this.platform.setLocalData<T>(this.key, this.value);
    }

    public remove(): void {
        this.platform.removeLocalData(this.key);
    }
}

interface IServerPropertyInfo<T> {
    key: string;
    defaultValue: T;
}
class ServerProperty<T> extends BaseSaveProprty<T> implements IAsynSaveProperty<T>{

    public constructor(info: IServerPropertyInfo<T>) {
        super(info.key, info.defaultValue);
    }

    public get(): Promise<T> {
        return this.platform.getData<T>(this.key, this.defaultValue)
            .then((value: T) => {
                // if (value[this.key] !== undefined) {
                //     this.value = value[this.key];
                // } else {
                //     this.value = value;
                // }
                this.value = value;
                return this.value;
            });
    }

    public set(value: T): Promise<void> {
        return this.platform.setData(this.key, value);
    }

    public remove(): Promise<void> {
        return this.platform.removeData(this.key);
    }
}