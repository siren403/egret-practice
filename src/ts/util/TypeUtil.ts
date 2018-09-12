const ignoreFields = [
    "__proto__",
    "__class__",
    "__types__"
];
interface ObjectConstructor {
    isNull(obj: Object): boolean;
    toList<T>(obj: Object, isIncludeKey?: boolean): Array<{ key: string, value: T }> | Array<T>;
    isEmpty(obj: Object): boolean;
    assign<T>(target: Object, ...sources: Object[]): T;
    has(target: Object, prop: string): boolean;
}
interface IDefineAttribute {
    __proto__?: any;
    value?: any;
    enumerable?: boolean;
    writable?: boolean;
    configurable?: boolean;
}

interface Object {
    hasOwnProperty(prop: string): boolean;
}
if (!Object.isNull) {
    Object.isNull = function (obj: Object) {
        return (obj === undefined || obj === null);
    }
}

if (!Object.toList) {
    Object.toList = function (obj: Object, isIncludeKey: boolean = true) {
        let array = [];
        for (let key in obj) {
            if (ignoreFields.indexOf(key) !== -1) {
                continue;
            }
            if (isIncludeKey === true) {
                let copyObj = Object.assign({}, { value: obj[key] });
                copyObj["key"] = key;
                array.push(copyObj);
            } else {
                array.push(obj[key]);
            }
        }
        return array;
    }
}

if (!Object.isEmpty) {
    Object.isEmpty = function (obj: Object) {
        return (obj === undefined || obj === null || Object.toList(obj).length === 0);
    }
}

if (!Object.assign) {
    Object.assign = function assign<T>(target: Object, ...sources: Object[]): T {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var output: T = Object(target);
        for (var index = 0; index < sources.length; index++) {
            var source = sources[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    }
}

if (!Object.prototype.hasOwnProperty) {
    Object.prototype.hasOwnProperty || (Object.prototype.hasOwnProperty = function (x) { var o, e = this, p = String(x); return p in e && (o = e.__proto__ || e.constructor.prototype, (p in o === false) || e[p] !== o[p]) });
}

if (!Object.has) {
    Object.has = function (target: Object, prop: string) {
        return target.hasOwnProperty(prop);
    };
}



namespace ObjectUtil {
    export function forceValidate<T>(target: any, schema: T): T {
        let result: T = target;
        for (let key in schema) {
            if (ignoreFields.indexOf(key) !== -1) {
                continue;
            }
            if (target[key] === undefined) {
                if (result === target) {
                    result = Object.assign<T>({}, target);
                }
                result[key] = schema[key];
            }
        }
        return result;
    }

}


//전역 스코프에서 선언했기 때문에 Main객체 생성 후에 실행되는 코드 시점에서 사용가능하다.

/**
 * @description define is String.isEmpty
 */
interface StringConstructor {
    isEmpty(str: string): boolean;
    getByteLength(str: string): number;
    getRankFormatText(rank: number, totalCount: number, numberingRank?: number, percentFormat?: string): string;
}
interface String {
    format(...args: any[]): string;
}

if (!String.isEmpty) {
    String.isEmpty = function (str: string) {
        return (str === undefined || str === null || str === '');
    };
}
if (!String.getByteLength) {
    String.getByteLength = function (str: string) {
        let b, i, c;
        for (b = i = 0; c = str.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
        return b;
    }
}
if (!String.getRankFormatText) {
    String.getRankFormatText = function (rank: number, totalCount: number, numberingRank: number = 100, percentFormat: string = '{0}%'): string {
        let str = '';
        if (rank > numberingRank) {
            let percent = (rank / totalCount) * 100;
            let rankPercentage = percent > 99 ? Math.floor(percent) : Math.ceil(percent);
            str = percentFormat.format(rankPercentage);
        } else {

            str = rank !== 0 ? rank.toString() : '';
        }
        return str;
    }
}

if (!String.prototype.format) {
    String.prototype.format = function (...args) {
        let str = this;
        for (var i = 0; i < args.length; i++) {
            var regExp = new RegExp('\\{' + i + '\\}', 'gm');
            str = str.replace(regExp, args[i]);
        }
        return str;
    };
}

interface NumberConstructor {
    isEmpty(value: number): boolean;
}
if (!Number.isEmpty) {
    Number.isEmpty = function (value: number) {
        return (value === undefined || value === null);
    }
}



interface ArrayConstructor {
    equals<T>(a: Array<T>, b: Array<T>): boolean;
    isEmpty<T>(array: Array<T>): boolean;
    seq(count: number, start?: number): number[];
}
interface Array<T> {
    has(element: T): boolean;
    shuffle(): Array<T>;
}
if (!Array.equals) {
    Array.equals = function (a: Array<any>, b: Array<any>) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }
}
if (!Array.isEmpty) {
    Array.isEmpty = function (array: Array<any>) {
        return array === undefined || array === null || array.length === 0;
    }
}
if (!Array.seq) {
    Array.seq = function (count: number, start: number = 0): number[] {
        let arr = [];
        for (let s = start; arr.length < count; arr.push(s), s++);
        return arr;
    }
}

if (!Array.prototype.has) {
    Array.prototype.has = function (element) {
        return this.indexOf(element) !== -1;
    }
}
if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
        let counter = this.length;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = this[counter];
            this[counter] = this[index];
            this[index] = temp;
        }

        return this;
    }
}