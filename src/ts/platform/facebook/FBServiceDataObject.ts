interface IFBAppInfo {
    appId: string;
    icon: string;
    name: string;
}

interface IFBAudiences {
    interstitial: IFBAudienceInfo[];
    reward: IFBAudienceInfo[];
}
interface IFBAudienceInfo {
    id: string;
}

interface IFBServiceInfo {
    appId: string;
    apps: IFBAppInfo[];
    adid: IFBAudiences;
    message: Object;
}
class FBServiceDataObject extends JsonDataObject<IFBServiceInfo>{ }