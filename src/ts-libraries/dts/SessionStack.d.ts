declare namespace SessionStack {
    export function log(str: string, options?: {
        level: "info" | "warn" | "debug" | "error"
    }): void;
}