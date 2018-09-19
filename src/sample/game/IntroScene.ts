class IntroScene extends Scene {

    private eui: EuiTest = null;
    private missileContaner: GameObject = null;

    private missileCount: number = 500;

    private isEui: boolean = false;

    protected preload(): void {
        super.preload();

        this.loader.config("resource/default.res.json");
        this.loader.theme("resource/default.thm.json");
        this.loader.group('preload');
    }

    protected onPreloading(progress: number): void {
        console.log(progress);
    }

    public create(): void {
        super.create();

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
        this.setEnableUpdate(true);

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