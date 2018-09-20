class GameObject extends egret.DisplayObjectContainer implements IDisposable {

    protected _children: GameObject[] = [];

    public get className(): string {
        return Type.className(this);
    }

    public add(object: GameObject): void {
        this._children.push(object);
        this.addChild(object);
    }
    public remove(child: GameObject): void {
        this.removeChild(child);
        this._children.splice(this._children.indexOf(child), 1);
    }

    public getChildren(): GameObject[] {
        return this._children;
    }

    public dispose(): void {
        for (let child of this._children) {
            child.dispose();
            this.remove(child);
        }
        this._children.splice(0);
    }

}
class EgretObject extends GameObject {

    public static create<T extends GameObject>(constructor?: IConstructor<T>, parent?: GameObject): T {

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
        super.dispose();
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onAwake(): void { }

}