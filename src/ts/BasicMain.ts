interface IBasicInitializerParts {
    version: string;
    platform: PlatformProvider;
    serializerPack: BaseSerializerPack;
    progressReporter: RES.PromiseTaskReporter;
}
abstract class BasicMain extends eui.UILayer implements RES.PromiseTaskReporter {

    private languageProvider: ILanguageProvider = null;
    private currentInitParts: IBasicInitializerParts = null;

    protected abstract createInitializeParts(): IBasicInitializerParts;
    protected abstract createLoadConfigs(language: eLanguage): LazyLoadConfig[];

    public constructor() {
        super();
        this.currentInitParts = this.createInitializeParts();
        Container.bind(PlatformProvider, this.currentInitParts.platform);
        DataConverter.initialize(this.currentInitParts.serializerPack, this.currentInitParts.version);
    }

    protected createChildren(): void {
        super.createChildren();
        
        LifeCycle.onPause().subscribe({
            onNext: () => SoundManager.stopAll()
        });
        LifeCycle.onResume().subscribe({
            onNext: () => SoundManager.play()
        });

        Container.bind(LayerManager);
        Container.bind(ViewManager);
        Container.bind(egret.Stage, this.stage);

        this.preInitialize().then((languageProvider) => {
            this.languageProvider = languageProvider;
            return this.generateBuilder().build().initialize();
        }).then(() => {
            this.onInitComplete();
        })
        // .catch(e => {
        //     debug.log(e);
        // });
    }

    protected getLanguageProvider(): ILanguageProvider {
        return this.languageProvider;
    }

    /**return saved LanguageType */
    protected abstract async preInitialize(): Promise<ILanguageProvider>;

    protected generateBuilder(): IEgretInitBuilder {

        let combineGroupReporter: ICombineGroupReporter = new CombineGroupReporter(this.currentInitParts.progressReporter);

        let builder = EgretInitializeBuilder.create()
            .append(new LazyRegisterImplementation("eui.IAssetAdapter", new AssetAdapter()))
            .append(new LazyRegisterImplementation("eui.IThemeAdapter", new ThemeAdapter()));

        let configs = this.createLoadConfigs(this.languageProvider.language);

        for (let i = 0; i < configs.length; i++) {
            configs[i].injectCombineReporter(combineGroupReporter);
            builder.append(configs[i]);
        }

        builder.append(new LazyLoadCombineGroup(combineGroupReporter))
            .append(new LazyLoadTheme("resource/default.thm.json", this.stage));

        return builder;

        // .append(new LazyLoadConfig("resource/default.res.json", {
        //     resourceRoot: "resource/",
        //     loadGroups: ["preload"],
        //     reporter: combineGroupReporter
        // }))
        // .append(new LazyLoadLocalizeConfig(this.languageProvider.language, {
        //     resourceRoot: "resource/",
        //     loadGroups: ["ResGroup_Localize"],
        //     reporter: combineGroupReporter
        // }))
        // .append(new LazyLoadCombineGroup(combineGroupReporter))
        // .append(new LazyLoadTheme("resource/default.thm.json", this.stage));
    }


    private onInitComplete(): void {

        let layerManager = Container.resolve(LayerManager);

        layerManager.initialize({
            stage: Container.resolve(egret.Stage),
            count: eLayerType.END
        });

        let viewManager = Container.resolve(ViewManager);
        let data: IViewManagerData = {
            languageFile: "language_json"
        };

        viewManager.initialize(layerManager, data, this.languageProvider);
        this.createGameScene(viewManager);
        this.parent.removeChild(this);
    }

    public abstract onProgress(current: number, total: number): void;
    protected abstract createGameScene(sceneManager: ViewManager): void;
}