namespace Assert {
    export function isTrue(is: boolean, message?: string): void {
        if (is !== true) {
            throw new Error(message || 'is not true exception');
        }
    }

    export function notNull(object: any, message?: string): void {
        if (object === undefined || object === null) {
            throw new Error(message || 'is null or undefined object');
        }
    }
}