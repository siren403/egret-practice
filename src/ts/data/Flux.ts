namespace Flux {

    interface IState {

    }

    export interface IDispather {
        dispatch(action: IAction);
    }
    export interface IStore<T extends IState> extends IDispather {
        getState(): T;
        subscribe(param: Observer.ISubscribeParameter<T>): Observer.IDisposable;
    }
    export interface IAction {
        type: string;
    }

    export type Reducer<T extends IState, U extends IAction> = (state: T, action: U) => T;

    export interface IChangedListener {
        [key: string]: ((key: string, state: any) => any);
    }

    interface IStateInfo<T> {
        key: string;
        state: T;
    }

    export class Store<T extends IState> implements IStore<T>, IInitialize {

        private currentState: T = null;
        private reducer: Reducer<T, IAction> = null;
        private changedListener: IChangedListener = null;
        private onChangedState: Observer.Subject<T> = null;
        private onChangedStates: IMap<Observer.Subject<Object>> = null;

        public initialize(reducer: Reducer<T, IAction>, initializeState: T, changedListener: IChangedListener): void {
            this.reducer = reducer;
            this.currentState = initializeState;
            this.changedListener = changedListener;

            this.onChangedState = new Observer.Subject<T>();

            this.onChangedStates = {};
            let statekeys = Object.keys(this.currentState);
            for (let key of statekeys) {
                if (this.onChangedStates[key] === undefined) {
                    this.onChangedStates[key] = new Observer.Subject<Object>();
                }
            }

            this.currentState = this.validate(this.currentState);
            this.dispatch({ type: '' });
        }

        protected validate(state: T): T {
            return state;
        }

        public getState(): T {
            return this.currentState;
        }

        public dispatch(action: IAction) {
            let state = this.reducer(this.currentState, action);

            let isChanged: boolean = false;
            for (let key in this.currentState) {
                if (this.currentState[key] !== state[key]) {
                    this.currentState[key] = this.changedListener[key](key, state[key]);

                    if (this.onChangedStates[key] !== undefined) {
                        // this.onChangedStates[key].onNext({
                        //     key: key,
                        //     state: this.currentState[key]
                        // });
                        this.onChangedStates[key].onNext(Object.assign({}, this.currentState[key] as any));
                    }

                    isChanged = true;
                }
            }
            if (isChanged) {

                this.onChangedState.onNext(this.currentState);
            }
        }

        public subscribe(param: Observer.ISubscribeParameter<T>): Observer.IDisposable {
            param.onNext(this.currentState);
            return this.onChangedState.asObservable().subscribe(param);
        }

        /** subscribe 시 한번은 바로 호출됨 */
        public subscribeAsKey<U>(key: string, param: Observer.ISubscribeParameter<U>): Observer.IDisposable {
            if (this.onChangedStates[key] !== undefined) {
                // param.onNext({ key:key, state:this.currentState[key]);
                param.onNext(Object.assign<U>({}, this.currentState[key]));
                return this.onChangedStates[key].asObservable().subscribe(param);
            }
            // return new Observer.Subject<IStateInfo<U>>().asObservable().subscribe(param);
            return new Observer.Subject<U>().asObservable().subscribe(param);
        }

    }

}
