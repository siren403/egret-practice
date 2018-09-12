namespace FluxChangedListener {
    export const serverSave: ((key, state) => any) = (key, state) => {
        let platform = Container.resolve(PlatformProvider);
        platform.setData(key, state);
        return state;
    }
    export const localSave: ((key, state) => any) = (key, state) => {
        let platform = Container.resolve(PlatformProvider);
        platform.setLocalData(key, state);
        return state;
    }
}