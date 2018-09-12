namespace SGAdvertising {

    export enum eAdType {
        googleVideo,
        frontBanner
    }

    export function showAd(type: eAdType): Promise<void> {
        let asyncObject = null;

        switch (type) {
            case eAdType.googleVideo:
                asyncObject = new Promise<void>((resolve, reject) => {
                    SG.Ads.googleFrontAd((status, result) => {
                        if (status === 200) {
                            resolve();
                        } else {
                            reject({
                                status: status,
                                result: result
                            });
                        }
                    }, { isVolume: true });
                });
                break;
            case eAdType.frontBanner:
                asyncObject = new Promise<void>((resolve, reject) => {
                    SG.Ads.ad250x250((status, result) => {
                        if (status === 200) {
                            resolve();
                        } else {
                            reject({
                                status: status,
                                result: result
                            });
                        }
                    });
                });
                break;
            default:
                asyncObject = new Promise<void>((resolve, reject) => {
                    console.log('empty ad instance');
                    resolve();
                });
                break;
        }

        return asyncObject;

    }

}
