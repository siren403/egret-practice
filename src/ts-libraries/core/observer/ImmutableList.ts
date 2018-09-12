class ImmutableList<T>{
    public static readonly empty: ImmutableList<any> = new ImmutableList<any>(null);

    private _data: T[] = null;

    public get data(): T[] {
        return this._data;
    }

    public constructor(data: T[]) {
        if (data === null) {
            this._data = [];
        } else {
            this._data = data;
        }
    }

    public add(value: T): ImmutableList<T> {
        let newData: T[] = this._data.concat(value);
        return new ImmutableList<T>(newData);
    }

    public remove(value: T): ImmutableList<T> {
        let newData: T[] = [];

        this._data.forEach((element: T) => {
            if (element !== value) {
                newData.push(element);
            }
        });

        return new ImmutableList<T>(newData);
    }
}