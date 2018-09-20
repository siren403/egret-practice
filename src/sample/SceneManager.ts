class SceneManager {

    private static _currentScene: Scene = null;

    public static get currentScene(): Scene {
        return this._currentScene;
    }

    public static loadScene(scene: IConstructor<Scene>): void {

        if (this._currentScene !== null) {
            this._currentScene.dispose();
        }
        
        let instance = new scene();
        Assert.isTrue(instance instanceof Scene);
        Game.stage.addChild(instance);
        this._currentScene = instance;
    }
}