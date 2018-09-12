declare namespace LZString {
    export function compress(str: string): string;
    export function decompress(compressedStr: string): string;
    export function compressToEncodedURIComponent(input:string): string;
    export function decompressFromEncodedURIComponent(input:string): string;
}