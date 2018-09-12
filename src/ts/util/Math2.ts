namespace Math2 {
    export const Deg2Rad: number = 0.0174532925;
    export const Rad2Deg: number = 57.2957914331;

    export function random(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }

    export function randomInt(min: number, max: number): number {
        return Math.floor(Math2.random(min, max));
    }

    export function clamp(value: number, min: number, max: number): number {
        return value < min ? min : value > max ? max : value;
    }

    export function lerp(from: number, to: number, t: number): number {
        return (1 - t) * from + t * to;
    }

    export function dot(x1: number, y1: number, x2: number, y2: number): number {
        return x1 * x2 + y1 * y2;
    }

    export function between(value: number, min: number, max: number): boolean {
        return (value >= min && value <= max);
    }

    export function subtract(point1: egret.Point, point2: egret.Point, result: egret.Point): void {
        if (result) {
            result.x = point1.x - point2.x;
            result.y = point1.y - point2.y;
        }
    }

    export function max(a: number, b: number): number {
        return a > b ? a : b;
    }
    export function min(a: number, b: number): number {
        return a < b ? a : b;
    }

    export function repeat(value: number, length: number, min?: number): number {
        let m = min || 0;
        let result = value % (length + m);
        return value < m ? m : result === 0? min : result;
    }
}
