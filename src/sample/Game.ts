class Game {

    private static _stage: egret.Stage = null;
    private static _disposables: IMap<IDisposable[]> = {};
    private static _deltaTimer: DeltaTimer = null;

    public static get stage(): egret.Stage {
        return this._stage;
    }

    public static get deltaTime(): number {
        return this._deltaTimer.deltaTime;
    }

    public static initialize(stage: egret.Stage, isDeltaTime: boolean = false): void {
        this._stage = stage;
        if (isDeltaTime === true) {
            this._deltaTimer = new DeltaTimer();
            this._deltaTimer.start(this._stage);
        }
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

    public static adder(gameobject: GameObject): ((disposer: IDisposable) => void) {
        return (disposer) => {
            let go = gameobject;
            this.addDisposables(go.className, disposer);
        }
    }
}

// class Events {
//     public static addToStage(target: egret.DisplayObject): Observer.IObservable<egret.Event> {
//         return Observer.onEgretEventAsObservable(target, egret.Event.ADDED_TO_STAGE);
//     }
// }
