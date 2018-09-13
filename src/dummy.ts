namespace egret {
    export interface DisplayObject {
        setPivot(x: number, y: number);
    }
}
if (!egret.DisplayObject.prototype.setPivot) {
    egret.DisplayObject.prototype.setPivot = function (x: number, y: number) {
        let _this: egret.DisplayObject = this;
        _this.anchorOffsetX = _this.width * x;
        _this.anchorOffsetY = _this.height * y;
    }
}
namespace loop {
    //underscore range
    export function range(end: number, func: ((index: number) => void), start: number = 0): void {
        for (let i = start; i < end; i++) {
            func(i);
        }
    }
}

class SceneManager {

    private static stage: egret.Stage = null;

    public static initialize(stage: egret.Stage): void {
        this.stage = stage;
    }

    public static loadScene(scene: IConstructor<Scene>): void {
        let instance = new scene();
        Assert.isTrue(instance instanceof Scene);
        this.stage.addChild(instance);
        instance.initialize(this.stage);
    }
}

abstract class ShapeDisplay extends EgretObject {
    protected _shape: egret.Shape = null;
    public constructor() {
        super();
        this._shape = new egret.Shape();
        this.addChild(this._shape);
    }

    public abstract draw(...args: any[]): void;

    public dispose(): void {
        this.removeChild(this._shape);
    }

    public clear(): void {
        this._shape.graphics.clear();
    }
}
class RectDisplay extends ShapeDisplay {

    public draw(width: number, height: number, color: number = 0xffffff): void {
        let graphics = this._shape.graphics;
        graphics.beginFill(color);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        this._shape.x = -(width * .5);
        this._shape.y = -(height * .5);
    }

}
class LineDisplay extends ShapeDisplay {

    public draw(x1: number, y1: number, x2: number, y2: number,
        style?: ((setter: (thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, lineDash?: number[]) => void) => void)
    ): void {

        let graphics = this._shape.graphics;
        if (style !== undefined) {
            style(graphics.lineStyle.bind(graphics));
        }
        graphics.moveTo(0, 0);
        graphics.lineTo(x2, y2);
        this._shape.x = x1;
        this._shape.y = y1;
    }
}

abstract class Scene extends EgretObject {

    private resizeScreenDisposer: IDisposable = null;
    private latestTime: number = 0;
    private currentTime: number = 0;

    private deltaTime: number = 0;
    private deltaTimeMs: number = 0;

    public initialize(stage: egret.Stage): void {
        this.$stage = stage;
        this.resizeScreenDisposer = Observer.onEgretEventAsObservable(this.stage, egret.Event.RESIZE).subscribe(this.onResizeScreen.bind(this));
        this.onResizeScreen();

        this.onAwake();
    }

    private onResizeScreen(): void {
        this.x = this.stage.stageWidth * .5;
        this.y = this.stage.stageHeight * .5;
    }

    public dispose(): void {
        this.resizeScreenDisposer.dispose();
        this.resizeScreenDisposer = null;
    }

    protected setEnableOnUpdate(isEnable: boolean): void {
        if (isEnable === true) {
            this.latestTime = egret.getTimer();
            this.currentTime = egret.getTimer();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        } else {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.deltaTime = 0;
            this.deltaTimeMs = 0;
        }
    }

    private onEnterFrame(): void {
        this.currentTime = egret.getTimer();
        this.deltaTimeMs = this.currentTime - this.latestTime;
        this.deltaTime = this.deltaTimeMs / 1000;
        this.latestTime = this.currentTime;
        this.onUpdate(this.deltaTime);
    }

    protected onUpdate(deltaTime: number): void {

    }

}


class IntroScene extends Scene {

    private eui: EuiTest = null;
    private missileContaner: EgretObject = null;

    private missileCount: number = 500;

    private isEui: boolean = false;

    public onAwake(): void {
        super.onAwake();

        let width = this.stage.stageWidth;
        let height = this.stage.stageHeight;

        let background: RectDisplay = EgretObject.create(RectDisplay, this);
        background.draw(width, height);


        let halfWidth = width * .5;
        let halfHeight = height * .5;
        let hor: LineDisplay = EgretObject.create(LineDisplay, background);
        hor.draw(-halfWidth, 0, width, 0, (setter) => setter(6, 0xff0000));

        let vert: LineDisplay = EgretObject.create(LineDisplay, background);
        vert.draw(0, -halfHeight, 0, height, (setter) => setter(2, 0xff0000));

        this.missileContaner = EgretObject.create();
        loop.range(this.missileCount, () => {
            this.missileContaner.add(EgretObject.create(DisplayMissile));
        });


        this.eui = new EuiTest();
        loop.range(this.missileCount, () => {
            this.eui.addMissile(new EuiMissile());
        });

        this.add(this.missileContaner);
        this.setEnableOnUpdate(true);

        Observer.onTouchEndObservable(this.stage).subscribe(() => {
            this.toggle();
        });
    }

    private toggle(): void {
        this.isEui = !this.isEui;
        if (this.isEui) {
            this.parent.addChild(this.eui);
            this.remove(this.missileContaner);
        } else {
            this.add(this.missileContaner);
            this.parent.removeChild(this.eui);
        }
    }

    protected onUpdate(deltaTime): void {
        super.onUpdate(deltaTime);

        if (this.isEui) {
            for (let m of this.eui.getChildren()) {
                m.onUpdate(deltaTime);
            }
        } else {
            for (let m of this.missileContaner.getChildren()) {
                (m as DisplayMissile).onUpdate(deltaTime);
            }
        }
    }
}
function random(min: number, max: number): number {
    return (Math.random() * (max - min)) + min;
}
class DisplayMissile extends EgretObject {

    private bitmap: egret.Bitmap;
    private distance: number = random(50, 400);
    private speed: number = random(1, 10);
    private acc: number = 0;

    protected onAwake(): void {
        super.onAwake();

        let texture: egret.Texture = RES.getRes('missile');

        this.bitmap = new egret.Bitmap(texture);
        // this.bitmap.cacheAsBitmap = true;
        this.addChild(this.bitmap);
        this.bitmap.setPivot(.5, .5);

    }

    public onUpdate(deltaTime: number): void {

        this.acc += this.speed * deltaTime;

        if (this.acc > Math.PI * 2) {
            this.acc = 0;
        }

        let x = (Math.cos(this.acc)) * this.distance;
        let y = (Math.sin(this.acc)) * this.distance;

        this.x = x;
        this.y = y;
    }
}


interface IEntryConfig {

}
abstract class Entry extends EgretObject {

    protected onAddToStage(e: egret.Event): void {
        super.onAddToStage(e);
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        SceneManager.initialize(this.stage);

        this.initialize();
        this.parent.removeChild(this);
    }

    protected abstract initialize(): void;
}


namespace Type {
    export const FUNCTION: string = 'function';
    export const OBJECT: string = 'object';

    export function is(target: any, type: string): boolean {
        return (typeof target) === type;
    }
}

class FrameCounter {

    private _count: number = 0;

    public get count(): number {
        return this._count;
    }

    public constructor(stage: egret.Stage) {
        Observer.onEgretEventAsObservable(stage, egret.Event.ENTER_FRAME).subscribe(this.onEnterFrame.bind(this));
    }
    private onEnterFrame(): void {
        this._count++;
    }
}

//////////////////////////

class EuiTest extends eui.Component {

    private groupRoot: eui.Group;
    private missiles: EuiMissile[] = [];

    public constructor() {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onEuiComplete, this);
        this.skinName = EuiTestSkin;
        this.once(egret.Event.ADDED_TO_STAGE, () => {
            this.width = this.parent.width;
            this.height = this.parent.height;
        }, this);
    }

    private onEuiComplete(): void {
    }

    public addMissile(missile: EuiMissile): void {
        this.groupRoot.addChild(missile);
        this.missiles.push(missile);
    }
    public getChildren(): EuiMissile[] {
        return this.missiles;
    }
}
class EuiMissile extends eui.Component {

    private distance: number = random(50, 400);
    private speed: number = random(1, 10);
    private acc: number = 0;


    public constructor() {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onEuiComplete, this);
        this.skinName = EuiMissileSkin;
        this.once(egret.Event.ADDED_TO_STAGE, () => {
            Promise.wait(1).then(() => {
                this.x = this.parent.width * .5;
                this.y = this.parent.height * .5;
            });
        }, this);
    }

    private onEuiComplete(): void {
        this.setPivot(.5, .5);
    }

    public onUpdate(deltaTime: number): void {

        this.acc += this.speed * deltaTime;

        if (this.acc > Math.PI * 2) {
            this.acc = 0;
        }

        let x = (Math.cos(this.acc)) * this.distance;
        let y = (Math.sin(this.acc)) * this.distance;

        this.x = x + this.parent.width * .5;
        this.y = y + this.parent.height * .5;
    }
}
class LazyLoadTheme {

    public constructor(
        private _filePath: string,
        private _stage: egret.Stage
    ) {

    }

    public do(): Promise<any> {
        return new Promise((resolve, reject) => {
            let theme = new eui.Theme(this._filePath, this._stage);
            theme.once(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }
}