namespace FBAudience {
    /**@desc 삽입형 광고 아이디 */
    export const ADID_COMMON_INSERT: string = "216096209167009_217484595694837";

    /**@desc 리워드 광고 아이디 */
    export const ADID_COMMON_REWARD: string = "216096209167009_217486389027991";

    interface IADTypes {
        Reward: string[];
        Interstitial: string[];
    }

    export const ADTYPES: IADTypes = {
        Interstitial: [
            ADID_COMMON_INSERT
        ],
        Reward: [
            ADID_COMMON_REWARD
        ]
    };

    let isAdWatching: boolean = false;
    let loadedAdInstance: IMap<AdInstance> = {};

    interface IPreloadParam {
        types?: IADTypes;
        id?: string;
    }

    export function preloadAd(param: IPreloadParam): void {

        let idArray = null;
        if (param.types) {
            idArray = param.types.Interstitial.concat(param.types.Reward);
        } else if (param.id) {
            idArray = [param.id];
        }

        for (let i = 0; i < idArray.length; i++) {
            let id = idArray[i];
            if (!loadedAdInstance[id]) {
                let adInstance: AdInstance = null;
                getAdAsync(id)
                    .then((result: any) => {
                        if (result.code) {
                            //egret.log('preload error', JSON.stringify(result));
                            // 광고 인스턴스 생성 에러
                        } else {
                            adInstance = result;
                            //egret.log('preload loadAsync');
                            return adInstance.loadAsync();
                        }
                    })
                    .then(() => {
                        loadedAdInstance[id] = adInstance;
                    });
            }
        }
    }

    function getAdAsync(id: string): Promise<AdInstance | APIError> {
        if (ADTYPES.Interstitial.indexOf(id) != -1) {
            //egret.log('get ad insert async', id);
            return FBInstant.getInterstitialAdAsync(id);
        } else if (ADTYPES.Reward.indexOf(id) != -1) {
            //egret.log('get ad reward async', id);
            return FBInstant.getRewardedVideoAsync(id);
        }
    }

    function isInterstitialAd(id: string): boolean {
        return ADTYPES.Interstitial.indexOf(id) != -1;
    }
    function isRewardAd(id: string): boolean {
        return ADTYPES.Reward.indexOf(id) != -1;
    }


    function getAdInstance(id: string): AdInstance {
        if (ADTYPES.Interstitial.indexOf(id) != -1) {
            if (loadedAdInstance[id]) {
                let adInstance = loadedAdInstance[id];
                loadedAdInstance[id] = null;
                //egret.log('get preload insert adinstance');
                return adInstance;
            }
        } else if (ADTYPES.Reward.indexOf(id) != -1) {
            if (loadedAdInstance[id]) {
                let adInstance = loadedAdInstance[id];
                loadedAdInstance[id] = null;
                //egret.log('get preload reward adinstance');
                return adInstance;
            }
        }
        return null;
    }

    export function showAd(id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let adInstance = getAdInstance(id);
            if (adInstance) {
                //egret.log('cached show async');
                adInstance.showAsync()
                    .then(() => {
                        //egret.log('cached show complete');
                        preloadAd({ id: id });
                        resolve();
                    })
                    .catch((e) => {
                        //egret.log('cached ad error', JSON.stringify(e));
                        reject(e);
                    });
            } else {
                let adPromise: Promise<any> = getAdAsync(id);
                adPromise
                    .then((ad) => {
                        if (ad.code) {
                            reject(ad);
                        } else {
                            adInstance = ad;
                            //egret.log('load async');
                            return adInstance.loadAsync();
                        }
                    })
                    .then(() => {
                        //egret.log('show async');
                        return adInstance.showAsync();
                    })
                    .then(() => {
                        preloadAd({ id: id });
                        resolve();
                    })
                    .catch((e) => {
                        //egret.log('ad error', JSON.stringify(e));
                        reject(e);
                    });
            }
        });
    }

}

