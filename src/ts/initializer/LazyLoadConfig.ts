interface ILoadConfigOption {
    resourceRoot?: string;
    loadGroups?: string[];
    reporter?: ICombineGroupReporter;
}
class LazyLoadConfig implements ILazyAsync {

    protected _filePath: string = null;
    protected _resourceRoot: string = null
    protected _loadGroups: string[] = null;
    protected _reporter: ICombineGroupReporter = null;

    public constructor(
        filePath: string,
        option: ILoadConfigOption = { resourceRoot: "resource/" }
    ) {
        this._filePath = filePath;
        this._resourceRoot = option.resourceRoot;
        this._loadGroups = option.loadGroups !== undefined ? option.loadGroups : null;
        this._reporter = option.reporter !== undefined ? option.reporter : null;
    }

    public injectCombineReporter(reporter: ICombineGroupReporter): void {
        this._reporter = reporter;
    }

    public async do(): Promise<any> {
        await RES.loadConfig(this._filePath, this._resourceRoot);

        if (this._loadGroups) {
            this._loadGroups.forEach((key) => {
                let groups: Array<string> = RES.config.config.groups[key];
                if (groups && this._reporter) {
                    this._reporter.addGroupInfo({
                        groupName: key,
                        totalCount: groups.length
                    });
                }
            });
        }
    }
}

class LazyLoadLocalizeConfig extends LazyLoadConfig {

    public constructor(
        configPathFormat: string,
        language: eLanguage,
        option: ILoadConfigOption = { resourceRoot: "resource/" }
    ) {
        // super(`resource/localize.${eLanguage[language]}.res.json`, option);
        super(configPathFormat.format(eLanguage[language]), option);
    }

    public do(): Promise<any> {
        return new LazyLoadConfig(this._filePath, {
            resourceRoot: this._resourceRoot,
            loadGroups: this._loadGroups,
            reporter: this._reporter
        }).do();
    }
}

class LazyLoadPlatformConfig extends LazyLoadConfig {

    public constructor(
        platform: "kakao" | "facebook",
        option: ILoadConfigOption = { resourceRoot: "resource/" }
    ) {
        super(`resource/${platform}.res.json`, option);
    }

    public do(): Promise<any> {
        return new LazyLoadConfig(this._filePath, {
            resourceRoot: this._resourceRoot,
            loadGroups: this._loadGroups,
            reporter: this._reporter
        }).do();
    }
}