namespace Type {
    export const FUNCTION: string = 'function';
    export const OBJECT: string = 'object';

    export function is(target: any, type: string): boolean {
        return (typeof target) === type;
    }

    export function className(target: any): string {
        let name: string = '';

        if (target.constructor) {
            name = target.constructor.name;
        }

        return name;
    }
}