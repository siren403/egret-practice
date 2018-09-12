/** abstract */
class BasePanel extends BaseUI {

    private isInit: boolean = false;

    public constructor() {
        super();
        this.visible = false;
    }

    public show(): void {
        this.visible = true;
        if (this.isInit == false) {
            this.isInit = true;
            this.percentWidth = 100;
            this.percentHeight = 100;
            this.init();
        }
        if (this.getRoot() !== null) {
            UIAnimation.popUpEffect(this.getRoot());
        }
    }

    protected init(): void { }

    public hide(): Promise<void> {
        if (this.getRoot() !== null) {
            return UIAnimation.closeEffect(this.getRoot()).then(() => {
                this.visible = false;
            });
        } else {
            this.visible = false;
            return Promise.resolve();
        }
    }

    public get hideDisposables(): Observer.CompositeDisposables {
        return this.disposables;
    }

    public getRoot(): egret.DisplayObject {
        return this;
    }
}