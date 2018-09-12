
// enum SceneDrawingType {

//     Canvas,
//     Dom
// }

// namespace ebox.manager {

//     export class ModuleManager {

//         private static _instance: ModuleManager;

//         public static getInstance(): ModuleManager {

//             if (this._instance == null)

//                 this._instance = new ModuleManager();

//             return this._instance;
//         }



//         public sceneLayer: eui.UILayer;
//         public transitionLayer: eui.UILayer;
//         public loadLayer: eui.UILayer;
//         public panelLayer: eui.UILayer;
//         public guideLayer: eui.UILayer;

//         private loadingModule: string;

//         public sceneKeyArray: Array<string>;

//         private sceneDrawingType_value: SceneDrawingType;


//         public activateModule: ebox.ui.EuiComponent;

//         public get sceneDrawingType(): SceneDrawingType {

//             return this.sceneDrawingType_value;
//         }




//         /**
//          * @param data
//          */
//         public initialize(data: any): void {

//             this.sceneKeyArray = [];

//             var game_stage: egret.DisplayObjectContainer = data.game_stage;

//             this.loadingModule = data.loadingModule;


//             // this.sceneLayer = new eui.UILayer();
//             // this.sceneLayer.touchChildren = true;
//             // this.sceneLayer.touchEnabled = false;
//             // game_stage.addChild(this.sceneLayer);




//             // this.panelLayer = new eui.UILayer();
//             // this.panelLayer.touchChildren = true;
//             // this.panelLayer.touchEnabled = false;
//             // game_stage.addChild(this.panelLayer);


//             // this.guideLayer = new eui.UILayer();
//             // this.guideLayer.touchChildren = true;
//             // this.guideLayer.touchEnabled = false;
//             // game_stage.addChild(this.guideLayer);

//             // this.transitionLayer = new eui.UILayer();
//             // this.transitionLayer.touchChildren = true;
//             // this.transitionLayer.touchEnabled = false;
//             // game_stage.addChild(this.transitionLayer);

//             // this.loadLayer = new eui.UILayer();
//             // this.loadLayer.touchChildren = true;
//             // this.loadLayer.touchEnabled = false;
//             // game_stage.addChild(this.loadLayer);

//             ebox.manager.SceneManager.getInstance().initialize(this.sceneLayer, this.transitionLayer);
//             ebox.manager.PopupManager.getInstance().initialize(this.panelLayer);

//             ebox.event.CommonEventDispatcher.getInstance().addEventListener(ebox.event.CommonEvent.EVENT_LOADING_SHOW, this.event_loading_show, this);
//             ebox.event.CommonEventDispatcher.getInstance().addEventListener(ebox.event.CommonEvent.EVENT_LOADING_CLOSE, this.event_loading_close, this);
//             ebox.event.CommonEventDispatcher.getInstance().addEventListener(ebox.event.CommonEvent.EVENT_SYSTEM_MESSAGE, this.system_message_handler, this);

//         }

//         private event_loading_show(e: ebox.event.CommonEvent): void {

//             var loading: any;
//             loading = ebox.data.ObjectPool.getInstance().getClassImplement(this.loadingModule);
//             this.loadLayer.addChild(loading);

//         }

//         private event_loading_close(e: ebox.event.CommonEvent): void {


//             this.loadLayer.removeChildren();
//         }

//         private system_message_handler(e: ebox.event.CommonEvent): void {

            

//         }

//         public get previousScene(): string {

//             var key: string = "";

//             if (this.sceneKeyArray.length >= 2) {

//                 key = this.sceneKeyArray[this.sceneKeyArray.length - 2];
//             }

//             return key.toString();
//         }

//         private currentScene_value: string = "";

//         public get currentScene(): string {

//             return this.currentScene_value;
//         }

//         private addScene(scene_name: string): void {

//             if (scene_name == null) {

//                 return;
//             }

//             this.sceneKeyArray.push(scene_name);

//             if (this.sceneKeyArray.length > 30) {

//                 this.sceneKeyArray.splice(0, 1);
//             }
//         }

//         private loadmodule: ebox.ui.EuiComponent;


//         public showModule(scene_name: string, value: any = null): void {

//             if (scene_name == null || scene_name == "") {

//                 return;
//             }

//             var model: ebox.ui.EuiComponent = ebox.data.ObjectPool.getInstance().getClassImplement(scene_name);
//             model.setdata(value);
//             model.module_name = scene_name;

//             if (ebox.manager.LoadAssetsManager.getInstance().resourceLoaded(model.groupResArray) && ebox.manager.ResourceManager.getInstance().resourceLoaded(model.urlResArray)) {

//                 if (model instanceof ebox.ui.DomPanel) {

//                     ebox.manager.PopupManager.getInstance().showPanel(scene_name);

//                 } else if (model instanceof ebox.ui.EuiScene || model instanceof ebox.ui.DomScene) {


//                     ebox.event.CommonEventDispatcher.getInstance().dispatchEvent(new ebox.event.CommonEvent(ebox.event.CommonEvent.EVENT_CHANGE_SCENE));

//                     this.activateModule = model;

//                     this.sceneDrawingType_value = SceneDrawingType.Canvas
//                     if (model instanceof ebox.ui.DomScene) {

//                         this.sceneDrawingType_value = SceneDrawingType.Dom;
//                     }

//                     ebox.manager.SceneManager.getInstance().addScene(scene_name);
//                     this.currentScene_value = scene_name;
//                     this.addScene(scene_name);


//                 } else if (model instanceof ebox.ui.EuiPanel) {

//                     ebox.manager.PopupManager.getInstance().showPanel(scene_name);

//                 } else {

//                     egret.warn(scene_name + "不是场景或窗口");
//                 }

//             } else {

//                 if (ebox.manager.LoadAssetsManager.getInstance().resourceLoaded(model.groupResArray) == false) {

//                     ebox.event.CommonEventDispatcher.getInstance().dispatchEvent(new ebox.event.CommonEvent(ebox.event.CommonEvent.EVENT_LOADING_SHOW));
//                     this.loadmodule = model;
//                     ebox.manager.LoadAssetsManager.getInstance().addEventListener(ebox.manager.LoadAssetsManager.EVENT_LOAD_COMPLETE, this.module_load_complete, this, false);
//                     ebox.manager.LoadAssetsManager.getInstance().addload(model.groupResArray);

//                 } else if (ebox.manager.ResourceManager.getInstance().resourceLoaded(model.urlResArray) == false) {

//                     ebox.event.CommonEventDispatcher.getInstance().dispatchEvent(new ebox.event.CommonEvent(ebox.event.CommonEvent.EVENT_LOADING_SHOW));
//                     this.loadmodule = model;
//                     ebox.manager.ResourceManager.getInstance().addEventListener(ebox.manager.ResourceManager.EVENT_LOAD_DETECTION, this.res_load_detection, this, false);
//                     ebox.manager.ResourceManager.getInstance().addload(model.urlResArray);
//                 }



//             }

//         }

//         private res_load_detection(e: egret.Event): void {

//             if (this.loadmodule && ebox.manager.ResourceManager.getInstance().resourceLoaded(this.loadmodule.urlResArray)) {

//                 ebox.manager.ResourceManager.getInstance().removeEventListener(ebox.manager.ResourceManager.EVENT_LOAD_DETECTION, this.res_load_detection, this, false);
//                 ebox.event.CommonEventDispatcher.getInstance().dispatchEvent(new ebox.event.CommonEvent(ebox.event.CommonEvent.EVENT_LOADING_CLOSE));

//                 var model: ebox.ui.EuiComponent = this.loadmodule;
//                 this.loadmodule = null;
//                 ebox.manager.ModuleManager.getInstance().showModule(model.module_name, model.data);

//             }


//         }

//         private module_load_complete(e: ebox.event.CommonEvent): void {


//             ebox.manager.LoadAssetsManager.getInstance().removeEventListener(ebox.manager.LoadAssetsManager.EVENT_LOAD_COMPLETE, this.module_load_complete, this, false);

//             if (this.loadmodule) {

//                 ebox.event.CommonEventDispatcher.getInstance().dispatchEvent(new ebox.event.CommonEvent(ebox.event.CommonEvent.EVENT_LOADING_CLOSE));
//                 var model: ebox.ui.EuiComponent = this.loadmodule;
//                 this.loadmodule = null;
//                 ebox.manager.ModuleManager.getInstance().showModule(model.module_name, model.data);

//             }

//         }



//         public addGuide(model: ebox.ui.EuiComponent): void {

//             if (model.parent == null) {

//                 this.guideLayer.addChild(model);
//             }

//         }

//         public removeGuide(): void {

//             this.guideLayer.removeChildren();
//         }

//         // public addModuleToScene(scene_name:string,value:any=null):void{

//         //     var component: ebox.ui.EuiComponent = ebox.data.ObjectPool.getInstance().getClassImplement(scene_name);

//         //     if(component instanceof ebox.ui.EuiScene || component instanceof ebox.ui.EuiPanel){

//         //         egret.warn(scene_name+"是场景或窗口,使用showModule方法");
//         //         return;
//         //      }


//         //     component.data=value;
//         //     this.sceneLayer.addChild(component);
//         // }





//     }

// }

