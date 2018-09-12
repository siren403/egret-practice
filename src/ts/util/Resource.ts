namespace Resource {

    export class ResPath {
        public static readonly DEFAULT: string = 'resource/default.res.json';
    }

    type Data = {
        groupName: string,
        progressFunc: Function
    };

    export let stage: egret.Stage = null;
    export let loaders: IMap<Loader> = {};
    export let isThemeLoaded: IMap<boolean> = {};


    export function init(stage: egret.Stage): void {
        this.stage = stage;
    }

    export function getRes<T>(key: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            RES.getResAsync(key, (res) => {
                resolve(res as T);
            }, this);
        });
    }

    export class Loader {

        private _url: string;
        private _resourceRoot: string;
        private _loadingGorups: Object = {};

        private constructor(url: string, resourceRoot: string = 'resource/') {
            this._url = url;
            this._resourceRoot = resourceRoot;
        }
        public static create(url: string, resourceRoot: string = 'resource/'): Loader {
            let path = url + '.' + resourceRoot;
            let loader: Loader = Resource.loaders[path];
            if (!loader) {
                loader = new Loader(url, resourceRoot);
                Resource.loaders[path] = loader;
            }
            return loader;
        }

        public load(groupName: string, progressFunc: Function = null): Promise<void> {

            if (RES.isGroupLoaded(groupName) == false &&
                (!this._loadingGorups[groupName] || this._loadingGorups[groupName] == false)) {

                this._loadingGorups[groupName] = true;

                let data: Data = { groupName: groupName, progressFunc: progressFunc };
                return new Promise<void>((resolve, reject) => {
                    RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onLoadConfigComplete.bind(this, data, resolve, reject), this);
                    RES.loadConfig(this._url, this._resourceRoot);
                });
            } else {
                // console.log('loaded group : ', groupName);
                return Promise.resolve();
            }
        }

        private onLoadConfigComplete(data: Data, resolve, reject): void {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onLoadConfigComplete.bind(this, resolve, reject), this);

            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete.bind(this, data, resolve, reject), this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress.bind(this, data), this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError.bind(this, data, reject), this);
            // RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup(data.groupName);
        }

        private onResourceLoadComplete(data: Data, resolve, reject): void {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete.bind(this, resolve, reject), this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress.bind(this, data), this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError.bind(this, data, reject), this);

            this.relaseLoadData(data);
            resolve();
        }

        private onResourceProgress(data: Data, event: RES.ResourceEvent): void {
            if (data.progressFunc && data.groupName == event.groupName) {
                data.progressFunc(event.itemsLoaded, event.itemsTotal);
            }
        }

        private onResourceLoadError(data: Data, reject, event: RES.ResourceEvent): void {
            reject("Group:" + event.groupName + " has failed to load");
            this.relaseLoadData(data);
        }

        private relaseLoadData(data: Data): void {
            this._loadingGorups[data.groupName] = false;
            data.groupName = null;
            data.progressFunc = null;
        }

    }

    export function ThemeLoad(path: string): Promise<void> {
        if (!Resource.stage) {
            return Promise.reject('resource manager not initialize');
        }
        if (Resource.isThemeLoaded[path] == undefined) {
            Resource.isThemeLoaded[path] = false;
            return new Promise<void>((resolve, reject) => {
                let theme = new eui.Theme(path, Resource.stage);
                theme.once(eui.UIEvent.COMPLETE, () => {
                    Resource.isThemeLoaded[path] = true;
                    resolve();
                }, this);
            });
        } else if (Resource.isThemeLoaded[path] == false) {
            // console.log('theme loading...');
            return Promise.reject('theme loading : ' + path);
        } else if (Resource.isThemeLoaded[path] == true) {
            // console.log('loaded theme :', path);
            return Promise.resolve();
        }
    }


    export function rootLocation(): string {
        let location: string = '';

        location = window.location.protocol + '//' + window.location.hostname + window.location.pathname.replace('/index.html', '');

        return location;
    }
}