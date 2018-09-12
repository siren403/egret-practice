/** abstract */
class BaseScene extends BaseUI implements IScene {


    protected onAddToStage(e: egret.Event): void {
        this.percentWidth = 100;//this.parent.width;
        this.percentHeight = 100;//this.parent.height;
        super.onAddToStage(e);
    }

    // protected frameJob(interval: number, repeat: number): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         quya.TimerManager.getInstance().addFrameJob(interval, repeat, () => {
    //             resolve();
    //         }, this);
    //     });
    // }

    protected onRemoveFromStage(e: egret.Event): void {
        super.onRemoveFromStage(e);
    }

}