interface IGroupInfo {
    groupName: string;
    totalCount: number;
}
interface ICombineGroupReporter extends RES.PromiseTaskReporter {
    addGroupInfo(info: IGroupInfo): void;
    totalCount: number;
    groups: string[];
}

class LazyLoadGroup implements ILazyAsync {

    public constructor(
        private _name: string,
        private _priority?: number,
        private _reporter?: RES.PromiseTaskReporter
    ) {

    }

    public do(): Promise<any> {
        return RES.loadGroup(this._name, this._priority, this._reporter);
    }
}


class CombineGroupReporter implements ICombineGroupReporter {

    private _groups: string[] = null;
    private _totalCount: number = 0;
    private _current: number = 0;

    public get totalCount(): number {
        return this._totalCount;
    }
    public get groups(): string[] {
        return this._groups;
    }

    public constructor(
        private _reporter: RES.PromiseTaskReporter
    ) {
        this._groups = [];
    }

    public addGroupInfo(info: IGroupInfo): void {
        this._groups.push(info.groupName);
        this._totalCount += info.totalCount;
    }

    public onProgress(current: number, total: number): void {
        this._reporter.onProgress(++this._current, this._totalCount);
    }
}

class LazyLoadCombineGroup implements ILazyAsync {

    public constructor(
        private _combineGroupReporter: ICombineGroupReporter
    ) { }

    public async do(): Promise<any> {
        let groups = this._combineGroupReporter.groups;
        for (let i = 0; i < groups.length; i++) {
            await RES.loadGroup(groups[i], 0, this._combineGroupReporter)
        }
    }
}