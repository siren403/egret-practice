interface ILanguageProvider {
    language: eLanguage;
    getSupportLanguage(): eLanguage[];
}

class PureLanguageProvider implements ILanguageProvider {

    public constructor(
        private _language:eLanguage
    ){ }

    public get language(): eLanguage{
        return this._language;
    }
    public getSupportLanguage(): eLanguage[] {
        return [];
    }
}

class LocalLanguageProvider implements ILanguageProvider {

    private static readonly KEY_LOCAL_SAVED_LANGUAGE: string = 'KEY_LOCAL_SAVED_LANGUAGE';
    private savedLanguage: LocalProperty<eLanguage> = null;

    public constructor(
        private supportLanguage: eLanguage[],
        private testLanguage?: eLanguage
    ) {
        if (this.supportLanguage.length === 0) {
            throw new Error('support language is zero');
        }
    }

    public get language(): eLanguage {
        if (this.testLanguage !== undefined) {
            return this.testLanguage;
        }
        let localLanguage = this.getLocalLanguage();
        this.savedLanguage = new LocalProperty<eLanguage>(LocalLanguageProvider.KEY_LOCAL_SAVED_LANGUAGE, localLanguage);
        return this.savedLanguage.get();
    }

    public set language(lang: eLanguage) {
        this.savedLanguage.set(lang);
    }

    private getLocalLanguage(): eLanguage {
        let lang: eLanguage;
        let languageData: string;
        try {
            languageData = egret.Capabilities.language;
        } catch (error) {
            if (languageData == undefined) {
                languageData = navigator.language;
            }
        }

        // 지원하는 언어의 리스트 데이터를 기준으로 처리 가능하도록
        switch (languageData.toLowerCase()) {
            case "ko-kr": case "ko": case "kr":
                lang = eLanguage.ko_kr;
                break;
            case "en-us": case "en": case "us":
                lang = eLanguage.en_us;
                break;
            case "zh-cn": case "cn": case "zh":
                lang = eLanguage.zh_cn;
                break;
            case "zh-tw": case "tw":
                lang = eLanguage.zh_tw;
                break;
            case "ja-jp": case "ja": case "jp":
                lang = eLanguage.ja_jp;
                break;
            case "fr-fr": case "fr":
                lang = eLanguage.fr_fr;
                break;
            case "de-de": case "de":
                lang = eLanguage.de_de;
                break;
            case "it-it": case "it":
                lang = eLanguage.it_it;
                break;
            case "ru-ru": case "ru":
                lang = eLanguage.ru_ru;
                break;
            case "es-es": case "es":
                lang = eLanguage.es_es;
                break;
            case "pt-pt": case "pt":
                lang = eLanguage.pt_br;
                break;
            case "id-in": case "id":
                lang = eLanguage.es_es;
                break;
            default:
                console.log("nothing case language :", languageData.toLowerCase());
                lang = eLanguage.en_us;
                break;
        }
        if (this.supportLanguage.indexOf(lang) === -1) {
            lang = this.supportLanguage[0];
        }
        return lang;
    }

    public getSupportLanguage(): eLanguage[] {
        return this.supportLanguage;
    }

}

class AgeDataStoreLanguageProvider extends LocalLanguageProvider {

}

class AgeLanguageProvider extends LocalLanguageProvider {

    public constructor() {
        super([
            eLanguage.en_us,
            eLanguage.ko_kr,
            eLanguage.fr_fr,
            eLanguage.zh_cn,
            eLanguage.zh_tw,
            eLanguage.ja_jp,
            eLanguage.de_de,
            eLanguage.es_es,
            eLanguage.ru_ru,
            eLanguage.it_it,
            eLanguage.pt_br
        ]);
    }
}