namespace ArrayUtil {

    export interface IForEachInfo {
        start: number;
        condition: (index: number) => boolean;
        after: (index: number) => number;
    }

    //TODO: callback리턴값으로 break제어를 reject객체의 방식으로 수정
    export function forEach(param: IForEachInfo, callback: (current: number) => any): void {
        for (let i = param.start; param.condition(i); i = param.after(i)) {
            let isBreak = callback(i);
            if (isBreak !== undefined && isBreak === true) {
                break;
            }
        }
    }

}