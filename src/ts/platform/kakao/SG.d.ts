declare namespace SG {

    type CallBack<T> = (status, result: T) => void;

    export interface ISG {
        appId: string;
        snackId: string;
        snackVer: string;
        appKey: string;
        useGoogleAds?: boolean;
    }
    export interface IProfileData {
        playerId: string;
        nickname: string;
        profileImageUrl: string;
        bestScore: number;
    }
    export interface IProfileSaveData {
        appId: string,
        playerId: string,
        saveData: any,
        snackId: string
    }
    export interface IFriend {
        nickname: string;
        profileImageUrl: string;
        uuId: string;
        playerId: string;
    }
    export interface IProperty {
        nickname: string;
        profileImageUrl: string;
    }
    export interface ILeaderboardRank {
        playerId: string;
        rank: number;
        score: number;
        cardinality: number;
        highscore: number;
        property: IProperty;
        seasonSeq: number;
        nextResetTime: number;
        lastRank: number;
        lastScore: number;
        lastCardinality: number;
    }
    export interface IScore {
        rank: number;
        playerId: string;
        score: number;
        property: IProperty;
    }
    export interface ILeaderboardRankScore {
        seasonSeq: number;
        cardinality: number;
        scores: IScore[];
        myRank: number;
        
        /** all, link */
        myProperty?: IProperty;
        /** all, friend */
        nextResetTime?: number;
        /** all, link */
        myScore?: number;
    }

    // 5 카카오톡 메세지
    // ${messageTemplateId } : 고정 값 사용 (4724)
    // ${description } : 메세지에 표기되는 설명 설정 
    // ${buttonName } : 메세지에 표기되는 버튼 이름 설정
    // ${gameUrlParam } : 메세지에 포함해서 보낼 URL 파라미터 설정
    export interface IMessage {
        receiverUuid: string;
        messageTemplateId: string;
        description: string;
        buttonName: string;
        gameUrlParam: Object;
    }
    // image: 공유 / 자랑하기 시 전달되는 이미지 (없을 경우 게임센터에 등록된 해당 게임 공유용 이미지 사용)
    // label: 공유 / 자랑하기 시 전달되는 메세지 (없을 경우 게임센터에 등록된 해당 게임 공유용 메세지 사용)
    // button_text: 버튼에 노출되는 텍스트 (없을 경우 공통으로 적용됨)
    export interface IShareMessage {
        image?: IImage;
        label?: string;
        button_text?: string;
    }
    export interface IImage {
        src: string;
        width: number;
        height: number;
    }
    // resultTp	게임에서 전달 받은 결과 코드 설정	승리 : 21 / 패배 : 22 / 포기 : 23 / 무승부 : 24
    // resultAmt	게임 스코어	
    export interface IGameFinish {
        resultTp: string;
        resultAmt: number;
    }
    // category	String	Y	카테고리	아래 내용 참고
    // action	String	Y	액션	아래 내용 참고
    // valueNo	Long	N	액션에서 정의한 Long 값	아래 내용 참고    

    // category / action / valueNo
    // 게임 시작	start	click	진입 후 방문 횟수 (최초 값 1, 다시하기로 start 클릭 시 + 1)
    // 플레이 시작	gameStart	click	
    // start 이후 광고 노출(=다시뽑기) 횟수 ex)줄다리기와 같이 캐릭터를 뽑은 후 실제 게임에 진입하는 순간       
    // 자랑하기	boast	click	 
    // 다시하기	again	click	 
    // 겜톡하기	gtalk	click	 
    // 이어하기	relay	click	 
    // 캐릭터를 뽑아 게임시작	with_start	click	 
    // 초대메세지 전송	with_invite	click	 
    // 친구초대로 게임 실행	with_execute	click	 
    // 톡방랭킹 탭 클릭	rk_talkchat	click	 
    // 친구랭킹 탭 클릭	rk_friend	click	 
    // 전체랭킹 탭 클릭	rk_all	click	 
    // {"category": "gtalk", "action": "click"}
    export interface ILog {
        category: string;
        action: string;
        valueNo: string;
    }
    // 디폴트 x 85%, y 65% / x 2~98% , y 2~98% 사이값
    export interface IFloatingUI {
        xPos: number;
        yPos: number;
        isVisible?: boolean;
    }
    //  receiverPlayerId      메시지를 받는 플레이어의 Id 입니다.
    //  messageBoxId  메시지가 전달되는 우편함의 Id 입니다.
    //  우편함 코드 앞에 [스낵아이디_] 값이 없으면 SDK 에서 체크하고 자동으로 붙여줍니다.
    //  messageTitle  메시지의 제목 입니다.
    //  messageBody   메시지의 본문 입니다.    
    //  itemCode  아이템 코드 입니다.
    //  아이템 코드 앞에 [스낵아이디_] 값이 없으면 SDK 에서 체크하고 자동으로 붙여줍니다.
    //  itemQuantity  아이템의 수량 입니다.
    export interface IDelivery {
        receiverPlayerId: number;
        messageBoxId: string;
        itemCode: string;
        itemQuantity: number;
        messageTitle?: string;
        messageBody?: string;
    }

    var IN_GAMETAB: boolean;
    var VERSION: string;
    export function init(data: ISG, callBack: CallBack<IProfileData>): void;
    export function login(callBack: CallBack<any>): void;
    export function isLoggedIn(callBack: CallBack<any>): void;
    export function getUrlParameter(urlKey: string): string;
    export function getUrlParameters(): string;

    export namespace Profile {
        export function getSaveData(callBack: CallBack<IProfileSaveData>): void;
        export function setSaveData(data: any, callBack: CallBack<any>): void;
        export function removeSaveData(callBack: CallBack<any>): void;
        export var getMyProfile: IProfileData;
    }

    export namespace Friend {
        export function loadRegisteredFriends(callBack: CallBack<void>): void;
        var REGISTERED_FRIENDS: IFriend[];
        var INVITABLE_FRIENDS: IFriend[];
    }

    interface IGetRankedScoresData {
        leaderboardId: string;
        fromRank: number;
        toRank: number;
    }
    export namespace Leaderboard {
        export const ALL: string;
        export const FRIEND: string;
        export const LINK: string;

        // 6 리더보드, 7 톡방랭킹
        export function loadRank(data: any, callBack: CallBack<any>): void;
        export function reportScores(data: any, callBack: CallBack<any>): void;
        export function getRankedScores(data: IGetRankedScoresData, callBack: CallBack<ILeaderboardRankScore>): void;
        export function getRank(callBack: CallBack<ILeaderboardRank>): void;
        export function makeLink(callBack: CallBack<any>): void;
        var getLinkId: string;
        export function hasLinkId(): boolean;
    }

    export namespace Message {
        export function sendGameTalkMessage(data: IMessage, callBack: CallBack<any>): void;
        export function sendInvitationTalkMessage(data: IMessage, callBack: CallBack<any>): void;
        export function talkShare(data: IShareMessage, callBack: CallBack<any>): void;
    }

    export namespace Game {
        // 2 게임 시작
        // 8 판 종료
        export function roundStart(callBack: CallBack<any>): void;
        export function gameStart(callBack: CallBack<any>): void;
        export function roundFinish(data: IGameFinish, callBack: CallBack<any>): void;
    }

    export namespace Log {
        // 9 지표
        export function actionLog(data: ILog, callBack: CallBack<any>): void;
    }

    export namespace Ads {
        // 10 광고
        export function showFrontBanner(callBack: CallBack<any>): void;
        export function showEndingBanner(callBack: CallBack<any>): void;
        export function removeEndingBanner(callBack: CallBack<any>): void;
        export function ad250x250(callBack: CallBack<any>): void;
        export function ad320x100(callBack: CallBack<any>): void;
        export function removeAd320x100(callBack: CallBack<any>): void;
        export function googleFrontAd(callBack: CallBack<any>, data: any): void;
        export function google320x50(callBack: CallBack<any>): void;
        export function removeGoogle320x50(callBack: CallBack<any>): void;
    }

    export namespace UI {
        // 15 별 브라우저
        // 11 플로팅 UI
        export function setOrientation(screen: string, callBack: CallBack<any>): void;
        export function removeOrientation(): void;
        export function setFloatingPos(data: IFloatingUI, callBack: CallBack<any>): void;
        export function setFloatingVisible(callBack: CallBack<any>): void;
    }

    export namespace Delivery {
        // 14 우편함
        export function sendMessage(data: IDelivery, callBack: CallBack<any>): void;
        export function getMessages(messageBoxId: string, callBack: CallBack<any>): void;
        export function claimMessageItems(messageIds: string[], callBack: CallBack<any>): void;
        export function finishMessage(messageIds: string[], callBack: CallBack<any>): void;
    }

    export namespace Util {

        export function createShortcut(): void;
        export function openInAppBrowser(url: string): void;
        export function openExternalBrowser(url: string): void;
        export function getSharedLinks(): any;
    }


}   