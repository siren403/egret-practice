/** abstract */
class BaseComponent extends eui.Component {
    protected className: string;

    public constructor() {
        super();
        this.className = this['__class__'];
    }

    protected setSkinAsync(skin: any): Promise<void> {
        if (!this.skin && skin) {
            return new Promise<void>((resolve, reject) => {
                this.once(eui.UIEvent.COMPLETE, () => {
                    resolve();
                }, this);
                this.skinName = skin;
            });
        } else {
            return Promise.resolve();
        }
    }

}