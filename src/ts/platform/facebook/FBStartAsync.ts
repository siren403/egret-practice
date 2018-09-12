class FBStartAsync implements ILazyAsync {
    public do(): Promise<void> {
        return FBInstant.startGameAsync();
    }
}