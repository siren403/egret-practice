interface ISlideInfo {
    beginX: number;
    beginY: number;
    endX: number;
    endY: number;
    acc: number;
}
interface ISlideOption {
    isRetouch: boolean;
    isAccumulate: boolean;
}
class SlideController {

    private _target: egret.DisplayObject = null;
    private _beginPosition: egret.Point = egret.Point.create(0, 0);
    private _movePosition: egret.Point = egret.Point.create(0, 0);
    private _tempPoint: egret.Point = egret.Point.create(0, 0);
    private _isActive: boolean = false;
    private _distance: number = 30;
    private _accDistance: number = 0;
    private _disposables: Observer.CompositeDisposables = new Observer.CompositeDisposables();

    private _isRetouch: boolean = true;
    private _isAccumulate: boolean = false;

    private _onSlide: Observer.Subject<ISlideInfo> = new Observer.Subject<ISlideInfo>();
    // private _touchCount: number = 0;
    // private _touchCountLimit: number = 1;
    // private _slideInterval: number = 0;
    // private _latestSlideTime: number = 0;

    public get onSlide(): Observer.IObservable<ISlideInfo> {
        return this._onSlide.asObservable();
    }

    public constructor(target: egret.DisplayObject, distance: number, option: ISlideOption = {
        isRetouch: true,
        isAccumulate: false
    }) {
        this._target = target;
        this._isRetouch = option.isRetouch !== undefined ? option.isRetouch : this._isRetouch;
        this._isAccumulate = option.isAccumulate !== undefined ? option.isAccumulate : this._isAccumulate;

        Observer.onTouchBeginObservable(this._target).subscribe({
            onNext: this.onTouchBegin.bind(this),
            composite: this._disposables
        });
        Observer.onTouchMoveObservable(this._target).subscribe({
            onNext: this.onTouchMove.bind(this),
            composite: this._disposables
        });
        Observer.onTouchEndObservable(this._target).subscribe({
            onNext: this.onTouchEnd.bind(this),
            composite: this._disposables
        });

        this._distance = distance;

    }

    private onTouchBegin(e: egret.TouchEvent): void {
        // if (this._touchCount >= this._touchCountLimit) {
        //     return;
        // }
        // this._touchCount++;
        this._isActive = false;
        this._beginPosition.setTo(e.stageX, e.stageY);
    }
    private onTouchMove(e: egret.TouchEvent): void {
        if (this._isActive === false) {
            this._movePosition.setTo(e.stageX, e.stageY);
            Math2.subtract(this._movePosition, this._beginPosition, this._tempPoint);

            let isSlide = false;
            if (this._isAccumulate) {
                this._accDistance += Math.abs(this._tempPoint.length - this._accDistance);
                isSlide = this._accDistance >= this._distance;
            } else {
                isSlide = this._tempPoint.length > this._distance;
            }

            // if (isSlide && (Date.now() - this._latestSlideTime) < this._slideInterval) {
            //     isSlide = false;
            // }

            if (isSlide) {
                // this._latestSlideTime = Date.now();
                this._onSlide.onNext({
                    beginX: this._beginPosition.x,
                    beginY: this._beginPosition.y,
                    endX: this._movePosition.x,
                    endY: this._movePosition.y,
                    acc: this._accDistance
                });

                if (this._isRetouch) {
                    this._isActive = true;
                } else {
                    this._beginPosition.setTo(this._movePosition.x, this._movePosition.y);
                }
                this._accDistance = 0;
            }
        }
    }

    private onTouchEnd(e: egret.TouchEvent): void {
        this._isActive = true;
        this._accDistance = 0;
        // this._touchCount = Math2.clamp(this._touchCount - 1, 0, this._touchCountLimit);
    }

    public dispose(): void {
        this._onSlide.onCompleted();
        this._onSlide = null;

        this._disposables.dispose();
        this._disposables = null;

        this._target = null;

        egret.Point.release(this._beginPosition);
        egret.Point.release(this._movePosition);
        egret.Point.release(this._tempPoint);

        this._beginPosition = null;
        this._movePosition = null;
        this._tempPoint = null;
    }
}