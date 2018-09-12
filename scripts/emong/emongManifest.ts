import * as fs from 'fs';
import * as path from 'path';
export class EmongManifest implements plugins.Command {
    private modifyInitial: Array<string> = []; //保存修改过的库文件 js 文件名字
    private modifyGame: Array<string> = []; //保存修改过的 main 文件 js 文件名字
    private manifestPath: string; //保存 manifest 路径

    constructor() {
    }
    async onFile(file: plugins.File) {
        const origin = file.origin;
        if (file.extname == '.js') {
            if(origin == 'libs/modules/gameUtil/gameUtil.min.js' || origin == 'libs/modules/platform/platform.min.js' || origin.indexOf('platform/') == 0) {
                file.path = file.path.substr(0,file.path.lastIndexOf(file.relative))+origin;
                this.modifyInitial.push(file.relative);
            }         

            if(origin.indexOf("index.min") >= 0 || origin.indexOf("default.min") >= 0 || origin.indexOf("game.min") >= 0 || origin.indexOf("main.min") >= 0) {
                this.modifyGame.push(file.relative);
            } else {
                this.modifyInitial.push(file.relative);
            }
        }
        if (origin.indexOf("manifest.json") >= 0) {
                this.manifestPath = file.relative;
            }
        return file;
    }
    async onFinish(pluginContext) {
        let obj = {
            initial: this.modifyInitial,
            game: this.modifyGame
        };
        const serialize = JSON.stringify(obj);
        pluginContext.createFile(this.manifestPath, new Buffer(serialize));
    }
}