interface PromiseConstructor {
    wait(ms: number): Promise<void>;
    complete(ani: egret.tween.TweenGroup): Promise<void>;
    animationPlay(ani: egret.tween.TweenGroup, time?: number): Promise<void>;
}
if (!Promise.wait) {
    Promise.wait = function (ms: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    };
}
if (!Promise.complete) {
    Promise.complete = function (dispatcher: egret.EventDispatcher) {
        return new Promise<void>((resolve, reject) => {
            dispatcher.once(egret.Event.COMPLETE, () => {
                resolve();
            }, this);
        });
    }
}
if (!Promise.animationPlay) {
    Promise.animationPlay = function (ani: egret.tween.TweenGroup, time?: number) {
        let asyncObject = Promise.complete(ani);
        ani.play(time);
        return asyncObject;
    }
}