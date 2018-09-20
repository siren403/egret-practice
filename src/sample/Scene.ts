abstract class Scene extends GameObject {

    private _latestTime: number = 0;
    private _currentTime: number = 0;

    private _deltaTime: number = 0;
    private _deltaTimeMs: number = 0;

    private _isPreloaded: boolean = false;

    private _loader: Preloader = null;
    private _container: { scene: DI.IContainter, game: DI.IContainter } = null;


    protected get loader(): Preloader {
        return this._loader;
    }
    public get container(): { scene: DI.IContainter, game: DI.IContainter } {
        return this._container;
    }

    public constructor() {
        super();
        Game.addDisposables(
            this.className,
            Observer.onAddToStageObservable(this).subscribe(this.onAddToStage.bind(this))
        )
        this._loader = new Preloader();
        this._container = { scene: DI.create(), game: Game.container };
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
        this._container.scene.dispose();
        this._container.scene = null;
        this._container.game = null;
        Game.dispose(this.className);
    }

    protected setEnableUpdate(isEnable: boolean): void {
        if (isEnable === true) {
            this._latestTime = egret.getTimer();
            this._currentTime = egret.getTimer();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        } else {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this._deltaTime = 0;
            this._deltaTimeMs = 0;
        }
    }

    private onEnterFrame(): void {
        this._currentTime = egret.getTimer();
        this._deltaTimeMs = this._currentTime - this._latestTime;
        this._deltaTime = this._deltaTimeMs / 1000;
        this._latestTime = this._currentTime;
        this.onUpdate(this._deltaTime);
    }

    protected onUpdate(deltaTime: number): void {

    }

}