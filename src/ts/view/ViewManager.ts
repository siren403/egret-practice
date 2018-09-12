interface IViewManagerData {
    languageFile: string;
}
interface ILanguageTextProvider {
    get(key: string): string;
}
class ViewManager implements IInitialize {

    private rootLayer: ILayerManager = null;
    private languageData: any = null;
    private languageType: eLanguage = eLanguage.end;

    private languageTextProvider: ILanguageTextProvider = null;


    public initialize(layerManager: ILayerManager, data: IViewManagerData, languageProvider: ILanguageProvider): void {
        this.rootLayer = layerManager;
        this.languageData = RES.getRes(data.languageFile);
        this.languageType = languageProvider.language;
    }


    public usingLanguageText(provider: ILanguageTextProvider): void {
        this.languageTextProvider = provider;
    }

    public getText(key: string): string {
        if (this.languageTextProvider) {
            return this.languageTextProvider.get(key);
        }
        return '';
    }

    public loadScene<T extends BaseScene,U>(sceneConstructor: (new () => T), data?: U): Promise<T> {
        // let constructor: (new () => BaseScene) = egret.getDefinitionByName(sceneName);
        let scene = Container.resolve<T>(sceneConstructor);
        if (scene === null) {
            Container.bind(sceneConstructor);
            scene = Container.resolve(sceneConstructor);
        }
        return scene.ready(data).then(() => {
            scene.initialize();
            this.rootLayer.addChild(scene, eLayerType.SCENE, {
                clearLayer: true
            });
            return scene;
        });
    }

    public showPanel<T extends BasePanel, U>(panel: T, data?: U): Promise<{ panel: T, disposables: Observer.CompositeDisposables }> {
        return panel.ready(data).then(() => {
            panel.initialize();
        this.rootLayer.addChild(panel, eLayerType.PANEL);
            panel.show();
            return { panel: panel, disposables: panel.hideDisposables };
        });
    }

    public hidePanel(panel: BasePanel): void {
        panel.hide().then(() => {
            this.rootLayer.removeChild(panel, eLayerType.PANEL);
        });
    }

    public createUI<T extends BaseUI, U>(uiConstructor: (new () => T), data?: U): Promise<T> {
        let ui = new uiConstructor();
        return ui.ready(data).then(() => {
            ui.initialize();
            return ui;
        });
    }
}
