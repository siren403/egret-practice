class TweenCounter {

    private _tweenCount: number = 0;
    private _onCompleted: Observer.Subject<Observer.Unit> = new Observer.Subject<Observer.Unit>();

    public get onCompleted(): Observer.IObservable<Observer.Unit> {
        return this._onCompleted.asObservable();
    }

    public get isZero(): boolean {
        return this._tweenCount === 0;
    }

    public add(): void {
        this._tweenCount++;
    }

    public complete(): void {
        this._tweenCount--;
        if (this._tweenCount === 0) {
            this._onCompleted.onNext(Observer.Unit.default);
            // this._onCompleted.onCompleted();
        } else if (this._tweenCount < 0) {
            throw new Error('not equals add count to completed count');
        }
    }

    public reset(): void {
        this._tweenCount = 0;
    }
}