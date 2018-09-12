type ViewSetter = (view: ViewManager) => void;
type DataSetter = (data: any) => void;

interface IUILoadInfo {
    themePath?: string;
    groupName?: string;
    skin?: any;
    viewSetter?: ViewSetter;
    dataSetter?: DataSetter;
}
/** abstract */
class BaseUI extends BaseComponent {

    protected isAwake: boolean = false;

    private _isEuiComplete: boolean = false;
    private _loadInfo: IUILoadInfo = null;

    protected view: ViewManager;
    protected disposables: Observer.CompositeDisposables = new Observer.CompositeDisposables();

    protected viewSetter(view: ViewManager): void {
        this.view = view;
    }

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.once(eui.UIEvent.COMPLETE, this.onEuiComplete, this);
    }
    public initialize(): void {

    }
    protected awake(): void {

    }
    protected start(): void {

    }
    protected onEuiComplete(): void {
        this._isEuiComplete = true;
    }

    private getThemePath(info: IUILoadInfo): string {
        if (info && info.themePath) {
            return info.themePath;
        } else {
            return null;
        }
    }
    private getGroupName(info: IUILoadInfo): string {
        if (info && info.groupName) {
            return info.groupName;
        } else {
            return null;
        }
    }
    private getSkinSetter(info: IUILoadInfo): any {
        if (info && info.skin) {
            return info.skin;
        } else {
            return null;
        }
    }

    protected createLoadInfo(): IUILoadInfo {
        return {}
    }

    protected onAddToStage(e: egret.Event): void {
        this.setEvent();
        this.touchEnabled = false;

        if (this.isAwake == false) {
            this.isAwake = true;
            this.awake();
        }
        this.start();
    }

    private loadThemeAsync(thmPath: string): Promise<void> {
        if (thmPath !== null) {
            return Resource.ThemeLoad(thmPath);
        } else {
            return Promise.resolve();
        }
    }
    private loadGroupAsync(groupName: string): Promise<void> {
        if (groupName !== null) {
            return Resource.Loader.create(Resource.ResPath.DEFAULT).load(groupName);
        } else {
            return Promise.resolve();
        }
    }

    public async ready(data?: Object): Promise<void> {
        this.cacheLoadInfo();

        await this.loadGroupAsync(this.getGroupName(this._loadInfo));
        await this.loadThemeAsync(this.getThemePath(this._loadInfo));
        await this.setSkinAsync(this._loadInfo.skin);

        this.injectViewManager();
        this.injectData(data);

    }

    private cacheLoadInfo() {
        if (this._loadInfo === null) {
            this._loadInfo = this.createLoadInfo();
            if (this._loadInfo === null) {
                throw new Error('ui loadinfo is null');
            }
        }
    }

    public injectData<T>(data?: T): void {
        this.cacheLoadInfo();
        if (!Object.isEmpty(data) && this._loadInfo.dataSetter) {
            this._loadInfo.dataSetter(data);
        }
    }

    protected injectViewManager(): void {
        this.cacheLoadInfo();
        if (this._loadInfo.viewSetter) {
            this._loadInfo.viewSetter(Container.resolve(ViewManager));
        }
    }

    protected onRemoveFromStage(e: egret.Event): void {
        this.clearEvent();
        this.disposables.dispose();
    }

    protected setEvent(): void {
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }
    protected clearEvent(): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    protected playTweenGroup(ani: egret.tween.TweenGroup, time: number = 1): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ani.once('complete', () => {
                resolve();
            }, this);
            ani.play(time);
        });
    }

    // public dispose(): void {
    //     RES.destroyRes(this.getGroupName());
    // }
}