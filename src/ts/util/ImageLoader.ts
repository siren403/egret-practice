// namespace ImageLoader {

//     const cachedImages = {};

//     const loaderPool: egret.ImageLoader[] = [];

//     let latestLoadAync:Promise<egret.Texture> = null;

//     export function getLength(): number {
//         return loaderPool.length;
//     }

//     export function load(uri: string): Promise<egret.Texture> {
//         if (cachedImages[uri] !== undefined) {
//             return Promise.resolve(cachedImages[uri]);
//         }

//         return new Promise<any>((resolve, reject) => {
//             let loader = loaderPool.length > 0 ? loaderPool.pop() : new egret.ImageLoader();
//             loader.crossOrigin = 'anonymous';

//             loader.once(egret.Event.COMPLETE, () => {
//                 loaderPool.push(loader);
//                 let texture = new egret.Texture();
//                 texture.bitmapData = loader.data;
//                 cachedImages[uri] = texture;
//                 resolve(texture);
//             }, this);
//             loader.once(egret.IOErrorEvent.IO_ERROR, (e) => {
//                 loaderPool.push(loader);
//                 reject(e);
//             }, this);

//             loader.load(uri);
//         });
//     }
// }