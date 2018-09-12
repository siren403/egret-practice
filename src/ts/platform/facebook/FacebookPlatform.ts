class FacebookPlatform extends AbstractPlatformProvider {

    public getUserId(): string {
        return FBInstant.player.getID();
    }
    //flushDataAsync
    public setData<T>(key: string, value: T): Promise<void> {
        let obj = {};
        obj[key] = value;
        return this.setDatas(obj);
    }
    public setDatas(data: Object): Promise<void> {
        for (let key in data) {
            if (data[key] !== null) {
                data[key] = JSON.stringify(DataConverter.serialize(key, data[key]));
                debug.log(key, String.getByteLength(data[key]), "byte");
            }
        }
        return FBInstant.player.setDataAsync(data);
    }
    public getData<T>(key: string, defaultValue: T): Promise<T> {
        let obj = {};
        obj[key] = defaultValue;
        return this.getDatas([key], obj).then((result) => {
            return Promise.resolve(result[key]);
        });
    }
    public getDatas(keys: string[], defaultValues: Object): Promise<Object> {
        return FBInstant.player.getDataAsync(keys).then((data) => {
            let keyCount = 0;
            let returnData = data;
            for (let k of keys) {
                try {
                    if (Object.isEmpty(returnData[k]) || DataConverter.isSerializedData(JSON.parse(returnData[k])) === false) {
                        returnData[k] = defaultValues[k];
                        keyCount++;
                    } else {
                        let parseData = JSON.parse(returnData[k]);
                        returnData[k] = DataConverter.deserialize(k, parseData);
                        keyCount++;
                    }
                } catch (e) {
                    console.log(e);
                    returnData[k] = defaultValues[k];
                    keyCount++;
                }
            }
            if (keyCount === 0) {
                returnData = defaultValues;
            }
            return Promise.resolve(returnData);
        }).catch((e: APIError) => {
            debug.log(e.code, e.message);
            if (e.code === "INVALID_PARAM") {
                return Promise.resolve(defaultValues);
            }
        });
    }

    public removeData(key: string): Promise<void> {
        return this.removeDatas([key]);
    }
    public removeDatas(keys: string[]): Promise<void> {
        let obj = {};
        for (let k of keys) {
            obj[k] = null;
        }
        return this.setDatas(obj);
    }

    public showAd(type: ePlatformAdType): Promise<void> {
        switch (type) {
            case ePlatformAdType.reward:
                return FBAudience.showAd(FBAudience.ADID_COMMON_REWARD);
            case ePlatformAdType.insert:
                return FBAudience.showAd(FBAudience.ADID_COMMON_INSERT);
            default:
                return new Promise<void>((resolve, reject) => {
                    debug.log('not match ad type');
                });
        }
    }

    public getLeaderboard(filter: eEntriesFilter, from?: number, to?: number): Promise<ILeaderboard> {
        return new Promise<ILeaderboard>((resolve, reject) => { });
    }
}