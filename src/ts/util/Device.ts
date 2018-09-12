enum eDevice {
    NONE,
    ANDROID,
    IOS,
    OTHER,
}

namespace Device {

    export function currentDevice(): eDevice {
        let type = eDevice.NONE;

        let varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
        if (varUA.match('android') != null) {
            //안드로이드 일때 처리
            type = eDevice.ANDROID;
        } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
            //IOS 일때 처리
            type = eDevice.IOS;
        } else {
            type = eDevice.OTHER;
            //아이폰, 안드로이드 외 처리
        }

        return type;
    }
}