namespace Observer {

    export class Unit {
        public static readonly default: Unit = new Unit();
        private constructor() {
        }
    }

    type Action<T> = (value: T) => void;
    export interface IDisposable {
        dispose(): void;
    }


    export interface IObservable<T> {
        subscribe(params: ISubscribeParameter<T>): IDisposable;
        subscribe(onNext: Action<T>);
        subscribe(onNext: Action<T>, onError: Action<Error>);
        subscribe(onNext: Action<T>, onError: Action<Error>, onCompleted: Function);
    }
    export interface ISubscribeParameter<T> {
        onNext: Action<T>,
        onError?: Action<Error>,
        onCompleted?: Function
    }

    export class Subject<T> implements ISubject<T>, IAsObservable<T>{

        private _observeres: IObserver<T>[] = [];

        public onCompleted(): void {
            for (let i = 0; i < this._observeres.length; i++) {
                this._observeres[i].onCompleted();
            }
            this._observeres.splice(0);
        }
        public onError(error: Error): void {
            for (let i = 0; i < this._observeres.length; i++) {
                this._observeres[i].onError(error);
            }
        }
        public onNext(value: T): void {
            for (let i = 0; i < this._observeres.length; i++) {
                this._observeres[i].onNext(value);
            }
        }

        public asObservable(): IObservable<T> {
            return new Observable<T>(this);
        }

        public subscribe(observer: IObserver<T>): void {
            this._observeres.push(observer);
        }

        public unsubscribe(observer: IObserver<T>): void {
            let index = this._observeres.indexOf(observer);
            if (index > -1) {
                this._observeres.splice(index, 1);
                observer.onCompleted();
                this.onUnsubscribed();
            }
        }

        protected onUnsubscribed(): void { }
    }

    interface IObserver<T> {
        onCompleted(): void;
        onError(error: Error): void;
        onNext(value: T): void;
    }

    interface IAsObservable<T> {
        asObservable(): IObservable<T>;
    }

    interface ISubject<T> extends IObserver<T> {

    }

    class Observable<T> implements IObservable<T>, IDisposable {

        private _subject: Subject<T> = null;
        private _isDisposed: boolean = false;
        // private _operators: Operator.IOperator[] = [];

        public constructor(subject: Subject<T>) {
            this._subject = subject;
        }

        // public subscribe(params: ISubscribeParameter<T>): IDisposable {
        //     if (this._isDisposed === true) {
        //         return EmptyDispose.instance;
        //     }
        //     let subscribe = new Subscribe(params.onNext, params.onError, params.onCompleted);
        //     this._subject.subscribe(subscribe);

        //     let disposable = new SubscribeDisposable(this._subject, subscribe);

        //     this.dispose();

        //     return disposable;
        // }
        public subscribe(...args: any[]): IDisposable {
            Assert.notNull(args);
            Assert.isTrue(args.length > 0);
            if (this._isDisposed === true) {
                return EmptyDispose.instance;
            }

            let subscribe: Subscribe<T> = null;
            if (Type.is(args[0], Type.OBJECT)) {
                let params = args[0] as ISubscribeParameter<T>;
                subscribe = new Subscribe(params.onNext, params.onError, params.onCompleted);
            } else {
                subscribe = new Subscribe(args[0], args[1], args[2]);
            }
            this._subject.subscribe(subscribe);


            let disposer: IDisposable = new SubscribeDisposable(this._subject, subscribe);
            this.dispose();
            return disposer;
        }


        public dispose(): void {
            this._subject = null;
            this._isDisposed = true;
        }
    }

    class SubscribeDisposable<T> implements IDisposable {

        private _isDisposed: boolean = false;

        public constructor(
            private _origin: Subject<T>,
            private _observer: IObserver<T>
        ) { }

        public dispose(): void {
            if (this._isDisposed) {
                return;
            }
            this._origin.unsubscribe(this._observer);
            this._origin = null;
            this._observer = null;
            this._isDisposed = true;
        }
    }

    class Subscribe<T> implements IObserver<T>{

        public constructor(
            private _onNext: Action<T>,
            private _onError?: Action<Error>,
            private _onCompleted?: Function
        ) { }

        public onCompleted(): void {
            if (this._onCompleted) {
                this._onCompleted();
                this._onNext = null;
                this._onError = null;
                this._onCompleted = null;
            }
        }
        public onError(error: Error): void {
            if (this._onError) {
                this._onError(error);
            }
        }
        public onNext(value: T): void {
            if (this._onNext) {
                this._onNext(value);
            }
        }

    }

    class EmptyDispose implements IDisposable {

        public static readonly instance: EmptyDispose = new EmptyDispose();

        public dispose(): void {

        }
    }

    export class CompositeDisposables implements IDisposable {

        private _disposables: IDisposable[] = null;

        public constructor() {
            this._disposables = [];
        }

        public dispose(): void {
            for (let i = 0; i < this._disposables.length; i++) {
                this._disposables[i].dispose();
            }
            this._disposables.splice(0);
        }

        public add(disposable: IDisposable): void {
            this._disposables.push(disposable);
        }
    }


    class egretEventSubject<T extends egret.Event> extends Subject<T>{
        public constructor(
            private _target: egret.EventDispatcher,
            private _type: string
        ) {
            super();
            this._target.addEventListener(this._type, this.onNext, this);
        }

        protected onUnsubscribed(): void {
            super.onUnsubscribed();
            this._target.removeEventListener(this._type, this.onNext, this);
            this._target = null;
        }
    }

    export function onEgretEventAsObservable(target: egret.EventDispatcher, type: string): IObservable<egret.Event> {
        return new egretEventSubject(target, type).asObservable();
    }

    class onTouchSubject extends egretEventSubject<egret.TouchEvent>{ }

    export function onTouchTapAsObservable(target: egret.EventDispatcher): IObservable<egret.TouchEvent> {
        return new onTouchSubject(target, egret.TouchEvent.TOUCH_TAP).asObservable();
    }
    export function onTouchBeginObservable(target: egret.EventDispatcher): IObservable<egret.TouchEvent> {
        return new onTouchSubject(target, egret.TouchEvent.TOUCH_BEGIN).asObservable();
    }
    export function onTouchMoveObservable(target: egret.EventDispatcher): IObservable<egret.TouchEvent> {
        return new onTouchSubject(target, egret.TouchEvent.TOUCH_MOVE).asObservable();
    }
    export function onTouchEndObservable(target: egret.EventDispatcher): IObservable<egret.TouchEvent> {
        return new onTouchSubject(target, egret.TouchEvent.TOUCH_END).asObservable();
    }
}


