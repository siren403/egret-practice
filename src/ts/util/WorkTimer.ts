class workTimer {

    private startTime: number = 0;
    private endTime: number = 0;


    public start(): void {
        this.startTime = new Date().getTime();
    }

    public end(): void {
        this.endTime = new Date().getTime();
    }

    public elapsed(): number {
        return this.endTime - this.startTime;
    }
}