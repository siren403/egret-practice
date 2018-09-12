class KakaoPlatform extends PlatformProvider {

    private leaderboard: KakaoLeaderboard = new KakaoLeaderboard();

    public getUserId(): string {
        return SG.Profile.getMyProfile.playerId;
    }

    public setData<T>(key: string, value: T): Promise<void> {
        let obj = {};
        obj[key] = value;
        return this.setDatas(obj);
    }
    public setDatas(data: Object): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            for (let key in data) {
                if (data[key] !== null) {
                    data[key] = JSON.stringify(DataConverter.serialize(key, data[key]));
                    debug.log(key, String.getByteLength(data[key]), "byte");
                }
            }
            let sendData = { saveData: data };
            SG.Profile.setSaveData(sendData, (status, result) => {
                if (status === 200) {
                    resolve();
                } else {
                    reject({ status: status, result: result });
                }
            });
        });
    }
    public getData<T>(key: string, defaultValue: T): Promise<T> {
        let obj = {};
        obj[key] = defaultValue;
        return this.getDatas([key], obj).then((result) => {
            return Promise.resolve(result[key]);
        });
    }
    public getDatas(keys: string[], defaultValues: Object): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            SG.Profile.getSaveData((status, result) => {
                if (status === 200) {
                    let keyCount = 0;
                    let returnData = Object.isEmpty(result.saveData) ? {} : result.saveData;
                    for (let key of keys) {
                        try {
                            if (Object.isEmpty(returnData[key]) || DataConverter.isSerializedData(JSON.parse(returnData[key])) === false) {
                                returnData[key] = defaultValues[key];
                                keyCount++;
                            } else {
                                let parseData = JSON.parse(returnData[key]);
                                returnData[key] = DataConverter.deserialize(key, parseData);
                                keyCount++;
                            }
                        } catch (e) {
                            console.log(e);
                            returnData[key] = defaultValues[key];
                            keyCount++;
                        }
                    }
                    if (keyCount === 0) {
                        returnData = defaultValues;
                    }
                    resolve(returnData);
                } else {
                    resolve(defaultValues);
                }
            });
        });
    }
    public removeData(keys: string): Promise<void> {
        return this.removeDatas([]);
    }
    public removeDatas(keys: string[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SG.Profile.removeSaveData(() => {
                resolve();
            });
        });
    }

    public showAd(type: ePlatformAdType): Promise<void> {
        switch (type) {
            case ePlatformAdType.insert:
                return SGAdvertising.showAd(SGAdvertising.eAdType.googleVideo);
            case ePlatformAdType.reward:
                return SGAdvertising.showAd(SGAdvertising.eAdType.frontBanner);
            default:
                return new Promise<void>((resolve, reject) => {
                    debug.log('not match ad type');
                });
        }
    }

    public getLeaderboard(filter?: eEntriesFilter, from: number = 1, to: number = 100): Promise<ILeaderboard> {
        if (filter === undefined) {
            return Promise.resolve(this.leaderboard);
        }
        let type: string = '';
        switch (filter) {
            case eEntriesFilter.ALL:
                type = SG.Leaderboard.ALL;
                break;
            case eEntriesFilter.FRIEND:
                type = SG.Leaderboard.FRIEND;
                break;
            case eEntriesFilter.GROUP:
                type = SG.Leaderboard.LINK;
                break;
            default:
                type = SG.Leaderboard.ALL;
                break;
        }

        return new Promise<ILeaderboard>((resolve, reject) => {
            SG.Leaderboard.getRankedScores({ leaderboardId: type, fromRank: from, toRank: to }, (status, result) => {
                if (status === 200) {
                    this.leaderboard.updateRankScore(result);
                    resolve(this.leaderboard);
                } else {
                    reject({ code: status, message: result });
                }
            });
        });
    }
}
class KakaoLeaderboard implements ILeaderboard {

    private entries: ILeaderboardEntry[] = null;

    private totalCount: number = 0;
    private playerScore: number = 0;
    private playerRank: number = 0;
    private nextResetTime: number = 0;

    public updateRankScore(leaderboard: SG.ILeaderboardRankScore): void {
        this.entries = leaderboard.scores.map(value => {
            return {
                getName: function () { return value.property.nickname; },
                getRank: function () { return value.rank; },
                getScore: function () { return value.score; },
                getProfileUrl: function () { return value.property.profileImageUrl; },
                getData: function () { return null; }
            } as ILeaderboardEntry;
        });

        this.totalCount = leaderboard.cardinality;
        this.playerScore = leaderboard.myScore || this.playerScore;
        this.playerRank = leaderboard.myRank;
        this.nextResetTime = leaderboard.nextResetTime || this.nextResetTime;
    }

    public getEntries(): ILeaderboardEntry[] {
        return this.entries;
    }
    public getTotalCount(): number {
        return this.totalCount;
    }
    public getPlayerScore(): number {
        return this.playerScore;
    }
    public getPlayerRank(): number {
        return this.playerRank;
    }

    public getPlayerName(): string {
        return SG.Profile.getMyProfile.nickname;
    }

    public getNextResetTime(): number {
        return this.nextResetTime;
    }

    public getPlayerProfileUrl(): string {
        return SG.Profile.getMyProfile.profileImageUrl;
    }

}