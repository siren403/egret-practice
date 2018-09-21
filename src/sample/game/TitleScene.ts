namespace DI {

    // const map = Type.createMap();

    // export function bind<T>(_info: IContractInfo<T>): IConstructorBinder<T> {
    //     let binder = new Binder(_info);
    //     map.set(_info, binder);
    //     return binder;
    // }

    // export function resolve<T>(_info: IContractInfo<T>): T {
    //     var instance: T = null;
    //     if (map.has(_info)) {
    //         instance = (map.get(_info) as IResolvable<T>).resolve();
    //     }
    //     return instance;
    // }

    export enum eContractType {
        NONE,
        CLASS,
        INTERFACE,
        ABSTRACT
    }
    export interface IContractInfo<T> {
        type: eContractType;
        classConstructor?: IConstructor<T>;
    }

    export interface IBinder<T>
        extends
        IScopeBinder<T>,
        IConstructorBinder<T> { }

    class BindInfo<T> {
        public isLazy: boolean = true;
        public scope: eScopeType = eScopeType.NONE;
        public bindedConstructor: IConstructor<T> = null;
    }
    enum eScopeType {
        NONE,
        SINGLETON,
        TRANSIENT
    }
    interface IConstructorBinder<T> {
        to(constructor: IConstructor<T>): IScopeBinder<T>;
    }
    interface IScopeBinder<T> {
        asSingle(): IOptionalBinder<T>;
        asTransient(): IOptionalBinder<T>;
    }

    interface IOptionalBinder<T> { }
    interface INonLazyBinder<T> extends IOptionalBinder<T> {
        nonLazy(): IOptionalBinder<T>;
    }
    // abstract class BaseBinder<T>{
    //     public constructor(
    //         protected _origin: Binder<T>
    //     ) { }
    // }
    // class ScopeBinder<T> extends BaseBinder<T> implements IScopeBinder<T>{
    //     public asSingle(): IBinder<T> {
    //         this._origin.info.scope = eScopeType.SINGLETON;
    //         return this._origin;
    //     }
    //     public asTransient(): IBinder<T> {
    //         this._origin.info.scope = eScopeType.TRANSIENT;
    //         return this._origin;
    //     }
    // }
    // class NonLazyBinder<T> extends BaseBinder<T> implements INonLazyBinder<T>{
    //     public nonLazy(): IBinder<T> {
    //         this._origin.info.isLazy = false;
    //         return this._origin;
    //     }
    // }
    // class ConstructorBinder<T> extends BaseBinder<T> implements IConstructorBinder<T>{
    //     public to(constructor: IConstructor<T>): IBinder<T> {
    //         this._origin.info.bindedConstructor = constructor;
    //         return this._origin;
    //     }
    // }


    interface IResolvable<T> {
        resolve(): T;
    }

    class Binder<T> implements IBinder<T>, IResolvable<T>, IDisposable {

        private _contractInfo: IContractInfo<T> = null;
        private _bindInfo: BindInfo<T> = null;

        private _instance: T = null;

        public get info(): BindInfo<T> {
            return this._bindInfo;
        }

        public constructor(
            contractInfo: IContractInfo<T>
        ) {
            this._contractInfo = contractInfo;
            this._bindInfo = new BindInfo<T>();
        }

        public resolve(): T {

            this.throwException();

            let instance = null;
            switch (this._bindInfo.scope) {
                case eScopeType.SINGLETON:
                    if (this._instance === null) {
                        this._instance = new this._bindInfo.bindedConstructor();
                    }
                    instance = this._instance;
                    break;
                case eScopeType.TRANSIENT:
                    instance = new this._bindInfo.bindedConstructor();
                    break;
            }
            return instance;
        }

        private throwException(): void {
            if (this._bindInfo.bindedConstructor === null) {
                throw new Error('not bind constructor');
            }
            if (this._bindInfo.scope === eScopeType.NONE) {
                throw new Error('scope is non');
            }
        }


        public to(constructor: IConstructor<T>): IScopeBinder<T> {
            // return new ConstructorBinder(this).to(constructor);
            this._bindInfo.bindedConstructor = constructor;
            return this;
        }
        public asSingle(): IOptionalBinder<T> {
            // return new ScopeBinder(this).asSingle();
            this._bindInfo.scope = eScopeType.SINGLETON;
            return this;
        }
        public asTransient(): IOptionalBinder<T> {
            // return new ScopeBinder(this).asTransient();
            this._bindInfo.scope = eScopeType.TRANSIENT;
            return this;
        }

        public dispose(): void {
            this._instance = null;
            this._bindInfo.bindedConstructor = null;
        }
    }

    export interface IContainter extends IDisposable {
        bind<T>(_info: IContractInfo<T>): IConstructorBinder<T>;
        bindClass<T>(_info: IContractInfo<T>): IScopeBinder<T>;
        resolve<T>(_info: IContractInfo<T>): T;
        install(parent: IContainter): void;
    }
    class DIContainer implements IContainter {

        protected cachedBinders = Type.createMap();
        protected parent: IContainter = null;

        public bind<T>(_info: IContractInfo<T>): IConstructorBinder<T> {
            let binder = new Binder(_info);
            this.cachedBinders.set(_info, binder);
            return binder;
        }
        public bindClass<T>(_info: IContractInfo<T>): IScopeBinder<T> {
            return this.bind(_info).to(_info.classConstructor);
        }

        public resolve<T>(_info: IContractInfo<T>): T {
            var instance: T = null;
            if (this.cachedBinders.has(_info)) {
                instance = (this.cachedBinders.get(_info) as Binder<T>).resolve();
            }
            if (instance === null && this.parent !== null) {
                instance = this.parent.resolve(_info);
            }
            return instance;
        }

        public install(parent: IContainter): void {
            this.parent = parent;
        }

        public dispose(): void {
            this.cachedBinders.forEach((value: Binder<any>) => {
                value.dispose();
            });
            this.cachedBinders.clear();
            this.parent = null;
        }

    }
    export function create(): IContainter {
        return new DIContainer();
    }
}
namespace VM {
    export interface ICommand {
        execute: (() => void);
        canExecute: (() => boolean);
        canExecuteChanged: Observer.IObservable<boolean>;
    }
    export abstract class BaseCommand implements ICommand {

        private _prevCanExecute: boolean = false;
        private _canExecuteChanged: Observer.Subject<boolean> = null;

        public execute(): void {
            if (this._canExecute()) {
                this._execute();
            }
        }
        public canExecute(): boolean {
            let can = this._canExecute();
            if (this._prevCanExecute !== can) {
                this._canExecuteChanged.onNext(can);
                this._prevCanExecute = can;
            }
            return can;
        }

        public get canExecuteChanged(): Observer.IObservable<boolean> {
            return this._canExecuteChanged.asObservable();
        }

        public constructor(
            private _execute: (() => void),
            private _canExecute: (() => boolean)
        ) {
            this._prevCanExecute = this._canExecute();
            this._canExecuteChanged = new Observer.Subject<boolean>();
        }

    }
    export interface IViewModel {
        do(command: ICommand): void;
    }
    export abstract class BaseViewModel implements IViewModel {
        public do(command: ICommand): void { }
    }
}
namespace VM {

    export interface ITestManyObject {
        updateCommand: ICommand;
    }
    export const iTestManyObject: DI.IContractInfo<ITestManyObject> = {
        type: DI.eContractType.INTERFACE
    }

    export class TestManyObject extends BaseViewModel {
        private _updateCommand: ICommand = null;

        public get updateCommand(): ICommand {
            return this._updateCommand;
        }
        public constructor() {
            super();
            this._updateCommand = new UpdateCommand(this.update.bind(this), () => true);
        }

        protected update(): void {

        }
    }

    class UpdateCommand extends BaseCommand { }
}





class TitleScene extends Scene {

    private display: TestManyObjectByDisplayView = new TestManyObjectByDisplayView();
    private eui: TestManyObjectByEuiView = new TestManyObjectByEuiView();

    private currentView: BaseTestManyObjectView = null;

    public create(): void {
        super.create();

        let container = this.container.scene;
        container.bind(VM.iTestManyObject).to(VM.TestManyObject).asSingle();

        this.setEnableUpdate(false);
        this.currentView = this.display;

        
    }

    public toggle(): void {
        if (this.currentView === this.display) {
            this.currentView = this.eui;
        } else {
            this.currentView = this.display;
        }
    }

    protected onUpdate(deltaTime: number): void {
        super.onUpdate(deltaTime);

    }
}

class BaseTestManyObjectView extends EgretObject {

    protected testManyObject: VM.ITestManyObject = null;

    protected onAwake(): void {
        super.onAwake();
        let container = SceneManager.currentScene.container.scene;
        this.testManyObject = container.resolve(VM.iTestManyObject);
    }

    public onUpdate(deltaTime: number): void {

    }
}
class TestManyObjectByDisplayView extends BaseTestManyObjectView {


    protected onAwake(): void {
        super.onAwake();

    }
}
class TestManyObjectByEuiView extends BaseTestManyObjectView {


}