namespace type {
    export const FUNCTION: string = 'function';
    export const OBJECT: string = 'object';

    export function compare(target: any, type: string): boolean {
        return (typeof target) === type;
    }

    export function className(target: any): string {
        let name: string = '';

        if (target.constructor) {
            name = target.constructor.name;
        }

        return name;
    }

    declare class Map<TKey, TValue> {
        readonly size: number;
        has: (key: TKey) => boolean;
        get: (key: TKey) => TValue;
        set: (key: TKey, value: TValue) => void;
        delete: (key: TKey) => void;
        forEach(callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void, thisArg?: any): void;
        clear(): void;
    }

    export function createMap<TKey, TValue>(): Map<TKey, TValue> {
        var map: Map<TKey, TValue>;

        if (typeof Map === "undefined") {
            map = (function () {
                var _keys = [];
                var _values = [];
                var _size = 0;

                var instance = {
                    size: 0,
                    has: function (key) { return _keys.indexOf(key) > -1; },
                    get: function (key) { return _values[_keys.indexOf(key)]; },
                    set: function (key, value) {
                        var i = _keys.indexOf(key);
                        if (i === -1) {
                            _keys.push(key);
                            _values.push(value);
                            _size++;
                        } else _values[i] = value;
                    },
                    "delete": function (key) {
                        var i = _keys.indexOf(key);
                        if (i > -1) {
                            _keys.splice(i, 1);
                            _values.splice(i, 1);
                            _size--;
                        }
                    },
                    forEach: function (callback/*, thisObj*/) {
                        for (var i = 0; i < _keys.length; i++)
                            callback.call(arguments[1], _values[i], _keys[i], this);
                    },
                    clear: function () {
                        _keys.splice(0);
                        _values.splice(0);
                        _size = 0;
                    }
                }
                Object.defineProperty(instance, "size", {
                    get: function () {
                        return _size;
                    }
                });
                return instance;
            })();
        } else {
            map = new Map<TKey, TValue>();
        }
        return map;
    }

    /** require egret */
    export function is(instance: any, type: string): boolean {
        return (instance['__types__'] as Array<string>).indexOf(type) !== -1;
    }
}