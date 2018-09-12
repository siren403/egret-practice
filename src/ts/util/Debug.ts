namespace debug {

    export enum eLogLevel {
        OFF = 0,
        DEBUG = 1 << 0,
        INFO = 1 << 1,
        WARN = 1 << 2,
        ERROR = 1 << 3,
        ALL = ~(~0 << 3),
    }
    let LOG_LEVEL: eLogLevel = eLogLevel.DEBUG;

    export function setLevel(...level: eLogLevel[]): void {
        let logLevel;
        level.forEach((value) => {
            logLevel |= value;
        });
        LOG_LEVEL = logLevel;
    }

    export function log(message?: any, ...optionalParams: any[]): void {
        if (compareLogLevel(LOG_LEVEL, eLogLevel.DEBUG)) {
            console.log(message, ...optionalParams);
        }
    }
    export function egretLog(message?: any, ...optionalParams: any[]): void {
        if (compareLogLevel(LOG_LEVEL, eLogLevel.DEBUG)) {
            egret.log(message, ...optionalParams);
        }
    }

    export function info(message?: any, ...optionalParams: any[]): void {
        if (compareLogLevel(LOG_LEVEL, eLogLevel.INFO)) {
            console.info(message, ...optionalParams);
        }
    }
    export function warn(message?: any, ...optionalParams: any[]): void {
        if (compareLogLevel(LOG_LEVEL, eLogLevel.WARN)) {
            console.warn(message, ...optionalParams);
        }
    }
    export function error(message?: any, ...optionalParams: any[]): void {
        if (compareLogLevel(LOG_LEVEL, eLogLevel.ERROR)) {
            console.error(message, ...optionalParams);
        }
    }

    function compareLogLevel(currentLevel: eLogLevel, targetLevel: eLogLevel): boolean {
        if (LOG_LEVEL !== undefined && (currentLevel & targetLevel) === targetLevel) {
            return true;
        } else {
            return false;
        }
    }

}