interface IResourceLoadComponents {
    config(path: string, root?: string): void;
    theme(path: string);
    group(name: string);
}
class Preloader implements RES.PromiseTaskReporter, IResourceLoadComponents {

    private _configs: { path: string, root: string }[] = [];
    private _themes: string[] = [];
    private _groups: string[] = [];
    private _reporter: RES.PromiseTaskReporter = null;

    private _totalCount: number = 0;
    private _currentCount: number = 0;
    private _isLoading: boolean = false;

    public get progress(): number {
        return this._currentCount / this._totalCount;
    }

    public config(path: string, root: string = 'resource/'): void {
        this._configs.push({ path: path, root: root });
    }
    public theme(path: string): void {
        this._themes.push(path);
    }
    public group(name: string): void {
        this._groups.push(name);
    }
    public async load(reporter?: RES.PromiseTaskReporter): Promise<void> {

        if (this._isLoading) {
            return Promise.reject('is loading');
        }

        this._reporter = reporter;
        this._isLoading = true;
        await Promise.all(this._configs.map((config) => {
            return RES.loadConfig(config.path, config.root) as Promise<void>;
        }));
        this._totalCount = this._groups.reduce((prev, curt, index, array) => {
            return prev + RES.getGroupByName(array[index]).length;
        }, 0);

        await Promise.all(this._themes.map((path) => {
            return new Promise<void>((resolve, reject) => {
                let theme = new eui.Theme(path);
                theme.once(eui.UIEvent.COMPLETE, () => {
                    resolve();
                }, this);
            })
        }));

        await Promise.all(this._groups.map((name) => {
            return RES.loadGroup(name, 0, this);
        }));


        this._isLoading = false;
        this.clear();
    }

    public onProgress(current: number, total: number, resItem: RES.ResourceInfo | undefined): void {
        this._currentCount++;
        if (this._reporter) {
            this._reporter.onProgress(this._currentCount, this._totalCount, resItem);
        }
    }

    public clear(): void {
        this._totalCount = 0;
        this._currentCount = 0;
        this._configs.splice(0);
        this._themes.splice(0);
        this._groups.splice(0);
    }
}