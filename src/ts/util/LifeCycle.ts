namespace LifeCycle {

    const _onPause: Observer.Subject<Observer.Unit> = new Observer.Subject<Observer.Unit>();
    const _onResume: Observer.Subject<Observer.Unit> = new Observer.Subject<Observer.Unit>();

    export function onPause():Observer.IObservable<Observer.Unit>{
        return _onPause.asObservable();
    }
    export function onResume():Observer.IObservable<Observer.Unit>{
        return _onResume.asObservable();
    }
    
    egret.lifecycle.onPause = () => {
        // egret.ticker.pause();
        // SoundManager.pauseAll();
        _onPause.onNext(Observer.Unit.default);
    }
    egret.lifecycle.onResume = () => {
        // egret.ticker.resume();
        // SoundManager.resumeAll();
        _onResume.onNext(Observer.Unit.default);
    }

}