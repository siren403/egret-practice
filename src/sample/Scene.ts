abstract class Scene extends GameObject {

    private _deltaTimer: DeltaTimer = null;

    private _isPreloaded: boolean = false;

    private _loader: Preloader = null;
    private _container: DI.IContainter = null;


    protected get load(): Preloader {
        return this._loader;
    }
    public get container(): DI.IContainter {
        return this._container;
    }

    public constructor() {
        super();
        Game.addDisposables(
            this.className,
            Observer.onAddToStageObservable(this).subscribe(this.onAddToStage.bind(this))
        )
        this._loader = new Preloader();
        this._container = DI.create();
        this._deltaTimer = new DeltaTimer(this);
    }

    private onAddToStage(e: egret.Event): void {
        if (this._isPreloaded === false) {
            this._isPreloaded = true;
            this.preload();

            this._loader.load({
                onProgress: () => { this.onPreloading(Math.floor(this._loader.progress * 100)); }
            }).then(this.onPreloadComplete.bind(this));
        }
    }


    private onPreloadComplete(): void {
        Game.addDisposables(
            this.className,
            Observer.onEgretEventAsObservable(this.stage, egret.Event.RESIZE).subscribe(this.onResizeScreen.bind(this))
        );
        this.onResizeScreen();
        this.create();
    }

    protected preload(): void { }
    /** progress 0 ~ 100 */
    protected onPreloading(progress: number): void { }
    protected create(): void { }

    private onResizeScreen(): void {
        // this.x = this.stage.stageWidth * .5;
        // this.y = this.stage.stageHeight * .5;
        this.x = 0;
        this.y = 0;
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
    }

    public dispose(): void {
        super.dispose();
        this.setEnableUpdate(false);
        this._container.dispose();
        this._container = null;
        Game.dispose(this.className);
    }

    protected setEnableUpdate(isEnable: boolean): void {
        if (isEnable === true) {
            this._deltaTimer.start();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        } else {
            this._deltaTimer.stop();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
    }

    private onEnterFrame(): void {
        this.onUpdate(this._deltaTimer.deltaTime);
    }

    protected onUpdate(deltaTime: number): void {

    }

}