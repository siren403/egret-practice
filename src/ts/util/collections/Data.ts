namespace Collections {

    export interface IData extends IEquatable<IData> {

    }

    class BasicData<T> implements IData {
        public constructor(
            public data: T
        ) { }

        public equals(other: BasicData<T>): boolean {
            return this.data === other.data;
        }
    }

    export class String extends BasicData<string>{ }
    export class Number extends BasicData<number>{ }
    export class Object extends BasicData<Object>{ }
    export class Boolean extends BasicData<boolean>{ }
}