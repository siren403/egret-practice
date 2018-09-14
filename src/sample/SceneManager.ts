class SceneManager {

    public static loadScene(scene: IConstructor<Scene>): void {
        let instance = new scene();
        Assert.isTrue(instance instanceof Scene);
        Game.stage.addChild(instance);
    }
}