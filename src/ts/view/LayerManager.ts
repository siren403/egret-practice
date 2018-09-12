interface ILayerOptions {
    childIndex?: number;
    clearLayer?: boolean;
}
interface ILayerManager {
    addChild(target: egret.DisplayObject, layerIndex: number, options?: ILayerOptions): void;
    getLayer(layerIndex: number): eui.UILayer;
    removeChild(target: egret.DisplayObject, layerIndex: eLayerType | number): void;
}

enum eLayerType {
    BACKGROUND = 0,
    SCENE,
    PANEL,
    LOADING,
    END
}

interface ILayerInitOption {
    stage: egret.Stage;
    count: number;
}

class LayerManager implements ILayerManager, IInitialize {

    private layers: Array<eui.UILayer> = null;
    private stage: egret.Stage = null;

    public constructor() {
        this.layers = [];
    }

    public initialize(option: ILayerInitOption): void {
        this.stage = option.stage;

        for (let i = 0; i < option.count; i++) {
            let layer: eui.UILayer = new eui.UILayer();

            layer.touchEnabled = false;
            layer.horizontalCenter = 0;
            layer.verticalCenter = 0;

            this.layers[i] = layer;
            this.stage.addChildAt(layer, i);
        }
    }

    public addChild(target: egret.DisplayObject, layerIndex: eLayerType | number, options?: ILayerOptions): void {
        if (layerIndex < this.layers.length) {
            if (options && options.clearLayer !== undefined && options.clearLayer === true) {
                for (let i = 0, len = this.layers[layerIndex].numChildren; i < len; i++) {
                    this.layers[layerIndex].removeChildAt(i);
                }
            }
            if (options && options.childIndex !== undefined) {
                this.layers[layerIndex].addChildAt(target, options.childIndex);
            } else {
                this.layers[layerIndex].addChild(target);
            }
        }
    }

    public removeChild(target: egret.DisplayObject, layerIndex: eLayerType | number): void {
        if (layerIndex < this.layers.length) {
            let layer = this.layers[layerIndex];
            if (layer.getChildIndex(target) !== -1) {
                layer.removeChild(target);
            }
        }
    }

    public getLayer(layerIndex: number): eui.UILayer {
        if (layerIndex < this.layers.length) {
            return this.layers[layerIndex];
        }
        return null;
    }
}