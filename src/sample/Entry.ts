interface IEntryConfig {
    scene: IConstructor<Scene>;
}
abstract class Entry extends egret.DisplayObject {

    protected abstract get config(): IEntryConfig;

    public constructor() {
        super();
        Game.addDisposables(
            type.className(this),
            Observer.onEgretEventAsObservable(this, egret.Event.ADDED_TO_STAGE).subscribe(this.onAddToStage.bind(this))
        );
    }

    protected onAddToStage(e: egret.Event): void {
        Game.dispose(type.className(this));
        Game.initialize(this.stage, true);

        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        let config = this.config;
        SceneManager.loadScene(config.scene);
    }


}