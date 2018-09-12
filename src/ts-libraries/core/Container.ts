class Container {

    public static Constructors = {};
    public static CacheObject = {};

    public static bind<T>(constructor: (new (...args) => T), instance?: T): void {
        let type = constructor.prototype["__class__"];
        if (!this.Constructors[type]) {
            this.Constructors[type] = constructor;
            if (instance) {
                this.CacheObject[type] = instance;
            }
        }
    }

    public static bindInstance<T>(key: string, instance: T): void {
        if (instance) {
            this.CacheObject[key] = instance;
        }
    }
    public static resolve<T>(constructor: (new (...args) => T)): T {
        let type = constructor.prototype["__class__"];
        let instance: T = null;
        if (this.Constructors[type]) {
            if (!this.CacheObject[type]) {
                this.CacheObject[type] = new this.Constructors[type];
            }
            instance = this.CacheObject[type] as T;
        } else {
            // console.log('not bind type : ', type);
        }
        return instance;
    }

    public static resolveInstance<T>(key: string): T {
        if (this.CacheObject[key]) {
            return this.CacheObject[key] as T;
        } else {
            return null;
        }
    }

    public static release(type: string): void {
        if (this.CacheObject[type]) {
            delete this.CacheObject[type];
        }
    }

    public static releaseAll(): void {
        for (let key in this.CacheObject) {
            delete this.CacheObject[key];
        }
    }
}