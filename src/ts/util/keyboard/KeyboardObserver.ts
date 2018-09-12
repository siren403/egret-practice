namespace Observer {


    export function onKeyDownObservable(target: KeyBoard, key?: string): IObservable<string[]> {
        return new keyboardSubject(target, key).asObservable();
    }

    class keyboardSubject extends Subject<string[]>{
        public constructor(
            private _target: KeyBoard,
            private _key?: string
        ) {
            super();
            this._target.addEventListener(KeyBoard.onkeydown, this.innerOnNext, this);
        }

        private innerOnNext(e: egret.Event): void {
            if (e.data && e.data.length > 0) {
                if (this._key === undefined) {
                    this.onNext(e.data);
                } else if (this._key === e.data[0]) {
                    this.onNext(e.data);
                }
            }
        }

        protected onUnsubscribed(): void {
            super.onUnsubscribed();
            this._target.removeEventListener(this._key, this.innerOnNext, this);
            this._target = null;
        }
    }
}

