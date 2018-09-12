class Sound {

    private soundInstance: egret.Sound = null;
    private key: string = null;

    public constructor(key: string) {
        this.soundInstance = new egret.Sound();
        this.key = key;
    }

    public load(): Promise<void> {
        return RES.getResAsync(this.key).then((sound) => {
            this.soundInstance = sound;
        }).catch((e) => {

        });
    }

    public play(startTime?: number, loops?: number): egret.SoundChannel {
        return this.soundInstance.play(startTime, loops);
    }
}

namespace SoundManager {

    interface IOption {
        isBgm: boolean;
        isEffect: boolean;
        bgmVolume: number;
        effectVolume: number;
    }


    const soundCache: IMap<Sound> = {};
    const channelCache: IMap<egret.SoundChannel> = {};
    const pausePosition: IMap<number> = {};
    const isLoading: IMap<boolean> = {};

    let latestBgm: string = '';

    let isBgm: boolean = true;
    let isEffect: boolean = true;
    let bgmVolume: number = 1;
    let effectVolume: number = 1;

    export function enableBgm(isEnable: boolean): void {
        if (isBgm !== isEnable) {
            isBgm = isEnable;
            if (isBgm === false) {
                stopAll();
            } else {
                if (String.isEmpty(latestBgm) === false) {
                    play(latestBgm);
                }
            }
        }
    }
    export function enableEffect(isEnable: boolean): void {
        isEffect = isEnable;
    }
    /**
     * 0 ~ 1
     */
    export function setBgmVolume(value: number): void {
        bgmVolume = value;
        for (let key in channelCache) {
            channelCache[key].volume = bgmVolume;
        }
    }
    /**
     * 0 ~ 1
     */
    export function setEffectVolume(value: number): void {
        effectVolume = value;
    }

    export function initialize(option: IOption): void {
        isBgm = option.isBgm;
        isEffect = option.isEffect;
        bgmVolume = option.bgmVolume;
        effectVolume = option.effectVolume;
    }

    function getChannel(key: string, startTime: number = 0, loops: number = 0): Promise<egret.SoundChannel> {
        return new Promise<egret.SoundChannel>((resolve, reject) => {
            let sound: Sound = null;
            if (soundCache[key] === undefined) {
                sound = new Sound(key);
                soundCache[key] = sound;
            } else {
                sound = soundCache[key];
            }
            sound.load().then(() => {
                let channel: egret.SoundChannel = null;
                if (channelCache[key] === undefined) {
                    channel = sound.play(startTime, loops);
                    if (loops === 0) {
                        channelCache[key] = channel;
                    }
                } else {
                    channel = channelCache[key];
                }
                resolve(channel);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    export function playEffect(key: string, startTime: number = 0, loops: number = 1): Promise<egret.SoundChannel> {
        if (isEffect === false) {
            return;
        }

        if (isLoading[key] !== undefined) {
            return;
        }
        return getChannel(key, startTime, loops).then((channel) => {
            channel.volume = effectVolume;
            delete isLoading[key];
            return channel;
        });
    }

    export function play(key?: string, startTime: number = 0, loops: number = 0, currentStop: boolean = true): void {
        /**@description #1727 off상태에서 bgm을 바꿔 재생 후 on시 정상적인 bgm이 나오게 하기 위해 수정 */
        latestBgm = key || latestBgm;

        if (isBgm === false) {
            return;
        }

        if (isLoading[key] !== undefined) {
            return;
        }

        if (currentStop === true) {
            stopAll();
        }
        if (key === undefined) {
            key = latestBgm;
        }

        if (String.isEmpty(key)) {
            return;
        }
        getChannel(key, startTime, loops).then((channel) => {
            channel.volume = bgmVolume;
            delete isLoading[key];
        }).catch(e => {
            debug.log(e);
        });
    }

    export function stop(key: string): void {
        let channel: egret.SoundChannel = channelCache[key];
        if (channel !== undefined) {
            channel.stop();
            delete channelCache[key];
        }
    }

    export function stopAll(): void {
        for (let key in channelCache) {
            stop(key);
        }
    }

    /** [deprecated] */
    export function pause(key: string): void {
        let channel: egret.SoundChannel = channelCache[key];
        if (channel !== undefined) {
            pausePosition[key] = channel.position;
            channel.stop();
            delete channelCache[key];
        }
    }

    /** [deprecated] */
    export function pauseAll(): void {
        for (let key in channelCache) {
            pause(key);
        }
    }
    /** [deprecated] */
    export function resume(key: string): void {
        let position = pausePosition[key];
        delete pausePosition[key];
        play(key, position);
    }
    /** [deprecated] */
    export function resumeAll(): void {
        for (let key in pausePosition) {
            resume(key);
        }
    }

    export function isPlaying(key: string): boolean {
        let channel: egret.SoundChannel = channelCache[key];
        let position = pausePosition[key];
        if (channel !== undefined && position === undefined) {
            return true;
        }
        return false;
    }
}