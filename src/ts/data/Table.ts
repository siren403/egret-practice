/**
 * Loader
 */
interface IJsonLoadHandler<T> {
    load(fileKey: string): T;
}
class EgretJsonLoader<T> implements IJsonLoadHandler<T>{
    public load(fileKey: string): T {
        return RES.getRes(fileKey);
    }
}

/**
 * Table
 */
interface ITable<TKey, TValue> {
    get(key: TKey): TValue;
}
abstract class JsonTable<TKey, TValue> implements ITable<TKey, TValue>{

    private _data: IMap<TValue> = null;
    private _list: Array<TValue>;

    private loadHandler: IJsonLoadHandler<IMap<TValue>> = new EgretJsonLoader<IMap<TValue>>();

    public load(fileKey: string): JsonTable<TKey, TValue> {
        this._data = this.loadHandler.load(fileKey);
        return this;
    }
    public get data(): IMap<TValue> {
        return this._data;
    }
    public abstract get(key: TKey): TValue;

    public get list(): Array<TValue> {
        if(this._list === undefined){
            this._list = Object.toList<TValue>(this.data, false) as Array<TValue>;
        }
        return this._list;
    }

}
// abstract class JsonTableArray<TValue> implements ITable<number, TValue>{

//     private _data: Array<TValue> = null;

//     private loadHandler: IJsonLoadHandler<Array<TValue>> = new EgretJsonLoader<Array<TValue>>();

//     public load(fileKey: string): JsonTableArray<TValue> {
//         this._data = this.loadHandler.load(fileKey);
//         return this;
//     }
//     public get data(): Array<TValue> {
//         return this._data;
//     }
//     public abstract get(key: number): TValue;

// }


/**
 * DataObject
 */
interface IDataObject<TValue> {
    get(): TValue;
}
abstract class JsonDataObject<TValue> implements IDataObject<TValue>{
    protected data: TValue = null;
    private loadHandler: IJsonLoadHandler<TValue> = new EgretJsonLoader<TValue>();
    public load(fileKey: string): JsonDataObject<TValue> {
        this.data = this.loadHandler.load(fileKey);
        return this;
    }
    public get(): TValue {
        return this.data;
    }
}