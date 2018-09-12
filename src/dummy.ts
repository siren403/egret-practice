
class SceneManager {

    private static stage: egret.Stage = null;

    public static initialize(stage: egret.Stage): void {
        this.stage = stage;
    }

    public static loadScene(scene: IConstructor<Scene>): void {
        let instance = new scene();
        Assert.isTrue(instance instanceof Scene);

        instance.initialize(this.stage);

        this.stage.addChild(instance);
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

}


class IntroScene extends Scene {

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


        let eui = new EuiTest();
        this.addChild(eui);
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
    public constructor() {
        super();
        this.once(eui.UIEvent.COMPLETE, this.onEuiComplete, this);
        this.skinName = EuiTestSkin;
    }

    private onEuiComplete(): void {

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