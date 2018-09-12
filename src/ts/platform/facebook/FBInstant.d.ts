//for fbinstant.6.2.js
declare class FBInstant {
    static player: FBPlayer;
    static context: Context;
    static payments: Payments;
    /**
     * zh_CN en_US ko_KR
     */
    static getLocale(): string;
    /**
     * IOS | ANDROID | WEB | MOBILE_WEB
     */
    static getPlatform(): Platform;
    static getSDKVersion(): string;
    static initializeAsync(): Promise<void>;
    /**
     * @param percentage 0-100
     */
    static setLoadingProgress(percentage: number): void;
    static getSupportedAPIs(): Array<string>;
    static getEntryPointData(): Object;
    static getEntryPointAsync(): Promise<string>;
    static setSessionData(sessionData: Object): void;
    static startGameAsync(): Promise<void>;
    static shareAsync(payload: SharePayload): Promise<void>;
    static updateAsync(payload: CustomUpdatePayload | LeaderboardUpdatePayload): Promise<void>;
    static quit(): void;
    /**
     * 使用 Facebook 的分析功能来分析应用。
     * @param eventName 要分析的事件名称
     * @param valueToSum 可选，FB分析可以计算它。
     * @param parameters 可选，它可以包含多达25个 key-value，以记录事件。key 必须是2-40个字符，只能包含'_', '-', ' '和字母数字的字符。 Value 必须少于100个字符。
     */
    static logEvent(eventName: string, valueToSum?: number, parameters?: Object): APIError;
    static onPause(func: Function): void;

    static getInterstitialAdAsync(placementID: string): Promise<AdInstance | APIError>;
    static getRewardedVideoAsync(placementID: string): Promise<AdInstance | APIError>;
    static matchPlayerAsync(matchTag: string | undefined, switchContextWhenMatched: boolean): Promise<void>; // 추가 , mock 추가완료
    static checkCanPlayerMatchAsync(): Promise<boolean>;
    static getLeaderboardAsync(name: string): Promise<Leaderboard>;
    static switchGameAsync(appID: string, data?: string): Promise<void>;
    static canCreateShortcutAsync(): Promise<boolean>; // 추가 , mock 추가
    static createShortcutAsync(): Promise<void>; // 추가, mock 추가완료
}
interface APIError {
    code: string;
    message: string;
}
interface AdInstance {
    getPlacementID(): string;
    loadAsync(): Promise<void>;
    showAsync(): Promise<void>;
}
interface Leaderboard {
    getName(): string;
    getContextID(): string | null;
    getEntryCountAsync(): Promise<number>;
    /**
     * @param extraData jsonformat ex:'{race: "elf", level: 3}'
     */
    setScoreAsync(score: number, extraData?: string): Promise<LeaderboardEntry>;
    getPlayerEntryAsync(): Promise<LeaderboardEntry | null>;
    /**
     * @param count default:10
     */
    getEntriesAsync(count?: number, offset?: number): Promise<Array<LeaderboardEntry>>; // 파라미터 ?
    /**
     * @param count default:10
     */
    getConnectedPlayerEntriesAsync(count: number, offset: number): Promise<Array<LeaderboardEntry>>; // 추가 , mock 추가 완료

}
interface LeaderboardEntry {
    getScore(): number;
    getFormattedScore(): string;
    getTimestamp(): number;
    getRank(): number;
    getExtraData(): string | null;
    getPlayer(): LeaderboardPlayer;
}
interface LeaderboardPlayer {
    getName(): string;
    getPhoto(): string;
    getID(): string;
}

interface FBPlayer {
    getID(): string;
    getSignedPlayerInfoAsync(): Promise<SignedPlayerInfo>;
    canSubscribeBotAsync(): Promise<boolean>; // 추가 , mock 추가 완료
    subscribeBotAsync(): Promise<void>; // 추가 , mock 추가 완료
    getName(): string;
    getPhoto(): string;
    getDataAsync(keys: Array<string>): Promise<Object>;
    /**
     * @description serializable object maximum 1MB
     */
    setDataAsync(data: Object): Promise<void>;
    flushDataAsync(): Promise<void>;
    getStatsAsync(keys: Array<string>): Promise<Object>;
    setStatsAsync(stats: Object): Promise<void>;
    incrementStatsAsync(increments: Object): Promise<Object>;
    getConnectedPlayersAsync(): Promise<Array<ConnectedPlayer>>;
}
interface Context {
    //솔로플레이시에는 null
    getID(): string;
    /**
     * Returns : "POST" | "THREAD" | "GROUP" | "SOLO"
     */
    getType(): string;
    /**
     * 현재 게임 컨텍스트의 참가자 수가 지정된 최소값과 최대 값 사이에 있는지 여부를 결정합니다.
     * @return ContextSizeResponse
     */
    isSizeBetween(minSize: number, maxSize: number): { answer: boolean, minSize: number, maxSize: number };
    switchAsync(id: string): Promise<void>;
    /**
     * "NEW_CONTEXT_ONLY" | "INCLUDE_EXISTING_CHALLENGES" | "NEW_PLAYERS_ONLY";
     */
    chooseAsync(options?: { filters?: Array<ContextFilter>, maxSize?: number, minSize?: number }): Promise<void>;
    createAsync(playerID: string): Promise<void>;
    getPlayersAsync(): Promise<Array<ContextPlayer>>;
}
/**
 * v5.1 Beta service
 */
interface Payments {
    getCatalogAsync(): Promise<Array<Product>>;
    purchaseAsync(purchaseConfig: PurchaseConfig): Promise<Purchase>;
    getPurchasesAsync(): Promise<Array<Purchase>>;
    consumePurchaseAsync(purchaseToken: string): Promise<void>;
    onReady(callBack: Function): void;
}

interface ConnectedPlayer {
    getID(): string;
    getName(): string;
    getPhoto(): string;
}


interface ContextPlayer {
    getID(): string;
    getName(): string;
    getPhoto(): string;
}
interface SignedPlayerInfo {
    getPlayerID(): string;
    getSignature(): string;
}
interface SharePayload {
    /**
     * "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE"
     */
    intent: string;
    image: string;
    text: string;
    /**
     * FBInstant.getEntryPointData() 
     */
    data?: Object;
}

interface CustomUpdatePayload {
    /**
     * require "CUSTOM"
     */
    action: UpdateAction;
    /**
     * https://developers.facebook.com/docs/games/instant-games/bundle-config
     * https://developers.facebook.com/docs/games/instant-games/sdk/bundle-config
     */
    template: string;
    /**
     * 自定义更新使用的模板的ID，模板应该在 fbapp-config.json 中预定义。
     * 查看配置文件说明：https://developers.facebook.com/docs/games/instant-games/bundle-config
     * 메세지 버튼 텍스트, click to action
     */
    cta?: string | LocalizableContent;
    /**
     * base64
     */
    image: string;
    text: string | LocalizableContent;
    /**
     * 해당 메세지 터치 시 FBInstant.getEntryPointData() 가져올 수 있게 되는 데이터, 문자열 1000자 이하
     */
    data?: Object;
    /**
     * 'IMMEDIATE' - 즉시 업데이트, default
     * 'LAST' - 게임 세션 종료 후 LAST를 사용하여 보낸 가장 최근의 업데이트를 전송
     * 'IMMEDIATE_CLEAR' - 즉시 게시 및 보류중인 업데이트 제거 (ex: LAST로 전송된 업데이트)
     * 업데이트 전달 방법
     */
    strategy?: 'IMMEDIATE' | 'LAST' | 'IMMEDIATE_CLEAR';
    /**
     * 업데이트에 대한 알림 여부, PUSH | NO_PUSH
     * default: NO_PUSH
     */
    notification?: 'PUSH' | 'NO_PUSH';
}

interface LocalizableContent {
    /**
     * ex: X just invaded Y\'s village!
     */
    default: string;
    /**
     * LocalizationsDict 
     * ex: {
     *      ar_AR: 'X \u0641\u0642\u0637 \u063A\u0632\u062A ' + '\u0642\u0631\u064A\u0629 Y!',
     *      en_US: 'X just invaded Y\'s village!',
     *      es_LA: '\u00A1X acaba de invadir el pueblo de Y!',
     *      }
     */
    localizations: Object;
}
interface Product {
    title: string;
    productID: string;
    description?: string;
    imageURI?: string;
    price: string;
    priceCurrencyCode: string;
}

interface PurchaseConfig {
    productID: string;
    developerPayload?: string;
}
interface Purchase {
    developerPayload?: string;
    paymentID: string;
    productID: string;
    purchaseTime: string;
    purchaseToken: string;
    signedRequest: string;  // SignedPurchaseRequest
}

interface ContextSizeResponse {
    answer: boolean;
    minSize?: number;
    maxSize?: number;
}

interface LeaderboardUpdatePayload {
    /**
     * require "LEADERBOARD"
     */
    action: UpdateAction;
    name: string;
    text?: string;
}

type ContextFilter = "NEW_CONTEXT_ONLY" | "INCLUDE_EXISTING_CHALLENGES" | "NEW_PLAYERS_ONLY";
type Platform = "IOS" | "ANDROID" | "WEB" | "MOBILE_WEB";
type UpdateAction = "CUSTOM" | "LEADERBOARD"
