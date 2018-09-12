namespace FBMessenger {

    export namespace Context {

        const Language = {
            ko_kr: 'ko_KR',//한국
            de_de: 'de_DE',//독일
            en_us: 'en_US',//영어
            es_es: 'es_ES',//스페인
            fr_fr: 'fr_FR',//프랑스
            id_id: 'id_ID',//인도네시아
            it_it: 'it_IT',//이탈리아
            ja_jp: 'ja_JP',//일본
            pt_br: 'pt_BR',//포르투갈
            ru_ru: 'ru_RU',//러시아
            zh_cn: 'zh_CN',//간체
            zh_tw: 'zh_TW'//번체
        }

        export namespace Strategy {
            export const IMMEDIATE: string = 'IMMEDIATE';
            export const LAST: string = 'LAST';
            export const IMMEDIATE_CLEAR: string = 'IMMEDIATE_CLEAR';
        }
        export namespace Notification {
            export const PUSH: string = 'PUSH';
            export const NO_PUSH: string = 'NO_PUSH';
        }


        interface IUpdateOption {
            template: string;
            text?: string;
            cta?: string;
            strategy: 'IMMEDIATE' | 'LAST' | 'IMMEDIATE_CLEAR';
            notification: 'PUSH' | 'NO_PUSH';
            data: Object;
        }
        const LOCALIZE_CONTENTS: { text: LocalizableContent, button: LocalizableContent } = {
            text: null,
            button: null
        };
        let cachedBase64Image: string = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAEAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpgA//Z';

        class LocalizableContentBuilder {
            private content: LocalizableContent = null;

            public constructor(defaultStr: string) {
                this.content = {
                    default: defaultStr,
                    localizations: {}
                }
            }

            public addLanguage(lang: eLanguage, text: string): LocalizableContentBuilder {
                let fbLang = Language[eLanguage[lang]];
                if (fbLang !== undefined) {
                    this.content.localizations[fbLang] = text;
                }
                return this;
            }

            public getContent(): LocalizableContent {
                return this.content;
            }
        }

        export function generateLocalizableContent(defaultStr: string): LocalizableContentBuilder {
            return new LocalizableContentBuilder(defaultStr);
        }

        export function usingLocalize(text: LocalizableContent, button: LocalizableContent) {
            LOCALIZE_CONTENTS.text = text;
            LOCALIZE_CONTENTS.button = button;
        }
        export function changeImage(base64Image: string): void {
            cachedBase64Image = base64Image;
        }

        export function updateLeaderboard(leaderboardName: string, message: string): Promise<void> {
            return FBInstant.updateAsync({
                action: "LEADERBOARD",
                name: leaderboardName,
                text: message,
            } as LeaderboardUpdatePayload);
        }

        /**
         * image:base64
         */
        export function updateMessage(base64Image?: string, option: IUpdateOption = {
            text: '',
            cta: '',
            template: '',
            strategy: 'IMMEDIATE',
            notification: 'PUSH',
            data: {}
        }): Promise<void> {

            let image = String.isEmpty(base64Image) ? cachedBase64Image : base64Image;
            let sendText: string | LocalizableContent = String.isEmpty(option.text) ? LOCALIZE_CONTENTS.text : option.text;
            let sendButton: string | LocalizableContent = String.isEmpty(option.cta) ? LOCALIZE_CONTENTS.button : option.cta;

            return FBInstant.updateAsync({
                action: 'CUSTOM',
                image: base64Image,
                cta: sendButton,
                text: sendText,
                template: option.template,
                strategy: option.strategy,
                notification: option.notification,
                data: option.data
            } as CustomUpdatePayload);
        }

        export function chooseWithUpdate(base64Image?: string): Promise<void> {

            let image = String.isEmpty(base64Image) ? cachedBase64Image : base64Image;

            return FBInstant.context.chooseAsync().then(() => {
                debug.log('chenged context');
                return Context.updateMessage(image).catch((e) => {
                    debug.log('fail update sync', e);
                });
            }).catch((e) => {
                debug.log('not change context', e);
            });
        }
    }


    export namespace Webhook {

        interface IEventData {
            eventType: string;
            lang: string;
            title_message?: string;
            subtitle_message?: string;
            button_title_message?: string;
            image_url?: string;
            time?: number;
            deleteEnterYn?: "Y" | "N";
            deleteEndYn?: "Y" | "N";
        }

        interface ISessionData {
            sessionData: Array<IEventData>;
        }

        export interface IEventTemplete {
            [key: string]: IEventData;
        }

        let templete: IEventTemplete = null;
        let sendEventTempleteKeys: string[] = [];

        export function initialize(appId: string, eventTemplete: IEventTemplete): void {
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            let uri = `https://push-facebook.emonggames.com:8200/api/v1/facebook/enterGame?gameId=${appId}&playerId=${FBInstant.player.getID()}`;
            request.open(uri);
            request.send();

            templete = eventTemplete;
        }

        export function addEvent(templeteKey: string): void {
            if (sendEventTempleteKeys.indexOf(templeteKey) === -1) {
                sendEventTempleteKeys.push(templeteKey);
            }
            setSessionData(sendEventTempleteKeys);
        }
        export function removeEvent(templeteKey: string): void {
            let index = sendEventTempleteKeys.indexOf(templeteKey);
            if (index !== -1) {
                sendEventTempleteKeys.splice(index, 1);
            }
            setSessionData(sendEventTempleteKeys);
        }

        export function modifiedEvent(templeteKey: string, modifier: ((event: IEventData) => IEventData)): void {
            if (templete[templeteKey] !== undefined) {
                templete[templeteKey] = modifier(templete[templeteKey]);
            }
        }

        export function updateSessionData(): void {
            setSessionData(sendEventTempleteKeys);
        }

        function setSessionData(templeteKeys: string[]): void {
            let data: ISessionData = {
                sessionData: []
            };

            for (let key of sendEventTempleteKeys) {
                if (templete[key] !== undefined) {
                    data.sessionData.push(templete[key]);
                }
            }

            let json = JSON.stringify(data);
            debug.log(json, String.getByteLength(json));
            FBInstant.setSessionData(data);
        }


    }

}
