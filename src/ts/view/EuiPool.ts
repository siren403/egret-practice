class EuiPool<T extends BaseEuiPoolItem<UData>, UData> {

    private itemCreator: (new () => T);
    private initialSize: number;

    private inactiveitems: Array<T>;
    private itemGroup: eui.Group;
    private isInitialize: boolean = false;


    get count(): number {
        return this.inactiveitems.length;
    }

    public constructor(itemType: (new () => T), itemGroup?: eui.Group, initialSize: number = 1) {

        this.itemCreator = itemType;
        this.initialSize = initialSize;

        if (itemGroup) {
            this.itemGroup = itemGroup;
        } else {
            this.itemGroup = new eui.Group();
        }

        this.inactiveitems = new Array<T>();
    }

    public getItemGroup(): eui.Group {
        return this.itemGroup;
    }

    public async initializeAsync(): Promise<void> {

        if (this.isInitialize === true) {
            return Promise.resolve();
        }

        this.isInitialize = true;

        let size = this.initialSize;

        let item: T;
        for (let i = 0; i < size; i++) {
            item = this.createItem();
            await item.ready();
            item.onCreate();
            this.inactiveitems.push(item);
        }

    }

    private createItem(): T {
        let item = new this.itemCreator();
        this.itemGroup.addChild(item);
        return item;
    }

    public async spawn(data?: UData): Promise<T> {

        let spawnItem: T;

        if (this.inactiveitems.length > 0) {
            spawnItem = this.inactiveitems.pop();
        } else {
            spawnItem = this.createItem();
            await spawnItem.ready();
            spawnItem.onCreate();
        }
        spawnItem.injectData(data);
        spawnItem.onEnable();

        if (spawnItem.parent) {
            spawnItem.parent.removeChild(spawnItem);
        }

        return spawnItem;
    }

    public despawn(item: T): void {
        this.inactiveitems.push(item);
        this.itemGroup.addChild(item);
        item.onDisable();
    }

    public clear(): void {
        let item: T;
        for (let i = 0; i < this.inactiveitems.length; i++) {
            item = this.inactiveitems[i];
            if (item.parent) {
                item.parent.removeChild(item);
            }
        }
        this.inactiveitems.splice(0, this.inactiveitems.length);
    }
}

abstract class BaseEuiPoolItem<TData> extends BaseUI {

    public get isEuiComplete(): boolean {
        return this.isEuiComplete;
    }

    //[pooling call back start]
    public onCreate(): void {
        this.visible = false;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    }
    // 활성화 시 마다 pool에서 호출함
    public onEnable(): void {
        this.visible = true;
    }
    // 비활성화 시 마다 pool에서 호출함
    public onDisable(): void {
        this.visible = false;
    }
    //[pooling call back end]

    protected onEuiComplete(): void {
        super.onEuiComplete();
    }

    public injectData<TData>(data: TData): void {
        super.injectData(data);
    }
}

