interface IPlatformProvider {
    getUserId(): string;
    setData<T>(key: string, value: T): Promise<void>;
    setDatas(data: Object): Promise<void>;
    getData<T>(key: string, defaultValue: T): Promise<T>;
    getDatas(keys: string[], defaultValues: Object): Promise<Object>;
    removeData(key: string): Promise<void>;
    removeDatas(keys: string[]): Promise<void>;

    setLocalData<T>(key: string, value: T): void;
    getLocalData<T>(key: string, defaultValue: T): T;
    removeLocalData(key: string): void;

    getLeaderboard(filter?: eEntriesFilter, from?: number, to?: number): Promise<ILeaderboard>;


    showAd(type: ePlatformAdType): Promise<void>;
}

enum ePlatformAdType {
    reward,
    insert
}

enum eEntriesFilter {
    ALL,
    FRIEND,
    GROUP
}
interface ILeaderboard {
    getEntries(): ILeaderboardEntry[];
    getTotalCount(): number;
    getPlayerScore(): number;
    getPlayerRank(): number;
    getPlayerName(): string;
    getPlayerProfileUrl(): string;
}

interface ILeaderboardEntry {
    getRank(): number;
    getName(): string;
    getScore(): number;
    getProfileUrl(): string;
    getData<T>(): T;
}

class PlatformProvider implements IPlatformProvider {
    protected static t: string = '1qazxsw2#EDCVFR$';

    public getUserId(): string { throw new Error('not override function'); }
    public setData<T>(key: string, value: T): Promise<void> { throw new Error('not override function'); }
    public setDatas(data: Object): Promise<void> { throw new Error('not override function'); }
    public getData<T>(key: string, defaultValue: T): Promise<T> { throw new Error('not override function'); }
    public getDatas(keys: string[], defaultValues: Object): Promise<Object> { throw new Error('not override function'); }
    public removeData(keys: string): Promise<void> { throw new Error('not override function'); }
    public removeDatas(keys: string[]): Promise<void> { throw new Error('not override function'); }
    public showAd(type: ePlatformAdType): Promise<void> { throw new Error('not override function'); }
    public getLeaderboard(filter?: eEntriesFilter, from?: number, to?: number): Promise<ILeaderboard> { throw new Error('not override function'); };

    public setLocalData<T>(key: string, value: T): void {

        let addtiveKey = this.getKey(key);
        let valueString = JSON.stringify(value);
        // if (DEFINE.isDebug === false) {
        if (RELEASE) {
            valueString = this.encrypt(valueString, PlatformProvider.t);
        }
        debug.log(addtiveKey, String.getByteLength(valueString), "byte");
        window.localStorage.setItem(addtiveKey, valueString);
    }
    public getLocalData<T>(key: string, defaultValue: T): T {
        let returnValue: T;

        let addtiveKey = this.getKey(key);
        let local: string = window.localStorage.getItem(addtiveKey);
        try {
            if (String.isEmpty(local)) {
                local = JSON.stringify(defaultValue);
                if (RELEASE) {
                    local = this.encrypt(local, PlatformProvider.t);
                }
            }
            if (RELEASE) {
                let bytes = CryptoJS.AES.decrypt(local, PlatformProvider.t);
                local = bytes.toString(CryptoJS.enc.Utf8);
            }
            returnValue = JSON.parse(local);
        } catch (e) {
            debug.log('local data format error ', e);
            returnValue = defaultValue;
        }
        return returnValue;
    }
    public removeLocalData(key: string): void {
        let addtiveKey = this.getKey(key);
        window.localStorage.removeItem(key);
        debug.log('removed local data : ', key, window.localStorage.getItem(key));
    }

    protected encrypt(message: string, secretPassphrase: string): string {
        let cipherText = CryptoJS.AES.encrypt(message, secretPassphrase);
        return cipherText.toString();
    }
    protected decrypt(message: string, secretPassphrase: string): string {
        return CryptoJS.AES.decrypt(message, secretPassphrase).toString(CryptoJS.enc.Utf8);
    }
    protected getKey(key: string): string {
        return key + '_' + this.getUserId();
    }



}


abstract class AbstractPlatformProvider extends PlatformProvider {
    public abstract getUserId(): string;
    public abstract setData<T>(key: string, value: T): Promise<void>;
    public abstract setDatas(data: Object): Promise<void>;
    public abstract getData<T>(key: string, defaultValue: T): Promise<T>;
    public abstract getDatas(keys: string[], defaultValues: Object): Promise<Object>;
    public abstract removeData(keys: string): Promise<void>;
    public abstract removeDatas(keys: string[]): Promise<void>;
    public abstract showAd(type: ePlatformAdType): Promise<void>;
    public abstract getLeaderboard(filter?: eEntriesFilter, from?: number, to?: number): Promise<ILeaderboard>;
}


