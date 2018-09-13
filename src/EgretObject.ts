class EgretObject extends egret.DisplayObjectContainer implements IDisposable {

    public static create<T extends EgretObject>(constructor?: IConstructor<T>, parent?: EgretObject): T {

        let instance = null;
        if (constructor) {
            instance = new constructor();
            Assert.isTrue(instance instanceof EgretObject);
        } else {
            instance = new EgretObject();
        }
        if (parent) {
            parent.add(instance);
        }
        instance.onAwake();
        return instance;
    }

    private _children: EgretObject[] = [];

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.width = this.height = 0;
    }

    protected onAddToStage(e: egret.Event): void {
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        this.anchorOffsetX = this.width * .5;
        this.anchorOffsetY = this.height * .5;
    }

    protected onRemoveFromStage(e: egret.Event): void {
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
    }

    public dispose(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        for (let child of this._children) {
            child.dispose();
            this.remove(child);
        }
        this._children.splice(0);
    }

    protected onAwake(): void { }

    public add(object: EgretObject): void {
        this._children.push(object);
        this.addChild(object);
    }
    public remove(child: EgretObject): void {
        this.removeChild(child);
        this._children.splice(this._children.indexOf(child), 1);

    }

    public getChildren(): EgretObject[] {
        return this._children;
    }

}