class EnterFrameHandler {

    private latestTime: number = 0;
    private currentTime: number = 0;

    private deltaTime: number = 0;
    private deltaTimeMs: number = 0;
    private isPause: boolean = false;

    private _onUpdate: Observer.Subject<number> = new Observer.Subject<number>();
    private _onUpdateMs: Observer.Subject<number> = new Observer.Subject<number>();

    public onUpdate(): Observer.IObservable<number> {
        return this._onUpdate.asObservable();
    }
    public onUpdateMs(): Observer.IObservable<number> {
        return this._onUpdateMs.asObservable();
    }

    public onEnterFrame(e: egret.Event): void {

        if (this.isPause) {
            return;
        }

        if (this.latestTime === 0) {
            this.latestTime = egret.getTimer();
        }
        this.currentTime = egret.getTimer();
        this.deltaTimeMs = this.currentTime - this.latestTime;
        this.deltaTime = this.deltaTimeMs / 1000;
        this.latestTime = this.currentTime;
        this._onUpdate.onNext(this.deltaTime);
        this._onUpdateMs.onNext(this.deltaTimeMs);
    }

    public pause(): void {
        this.isPause = true;
    }
    public resume(): void {
        this.isPause = false;
        this.latestTime = egret.getTimer();
        this.currentTime = egret.getTimer();
    }
}