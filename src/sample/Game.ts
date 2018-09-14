class Game {

    private static _stage: egret.Stage = null;
    private static _disposables: IMap<IDisposable[]> = {};

    public static get stage(): egret.Stage {
        return this._stage;
    }

    public static initialize(stage: egret.Stage): void {
        this._stage = stage;
    }

    public static addDisposables(key: string, ...args: IDisposable[]): void {
        if (this._disposables[key] === undefined) {
            this._disposables[key] = args;
        } else {
            this._disposables[key].push(...args);
        }
    }
    public static dispose(key: string): void {
        if (this._disposables[key] !== undefined) {
            for (let disposer of this._disposables[key]) {
                disposer.dispose();
            }
            this._disposables[key].splice(0);
            delete this._disposables[key];
        }
    }

}

// class Events {
//     public static addToStage(target: egret.DisplayObject): Observer.IObservable<egret.Event> {
//         return Observer.onEgretEventAsObservable(target, egret.Event.ADDED_TO_STAGE);
//     }
// }
