enum eStandardTime {
	NONE,	// NONE
	UTC,	// 협정세계시
	PST		// 태평양 표준시
}

interface IDailyChecker {
	check();
}

interface IStandardTime {
	before: number;
	current: number;
}

interface ITakeTimeHandler {
	get(): number;
	set(time: number): void;
}

class DailyChecker implements IDailyChecker {

	private timeType: eStandardTime = eStandardTime.NONE;
	private standardHour: number = 0;
	private standardMinutes: number = 0;
	private handler: ITakeTimeHandler = null;


	private _onDaily: Observer.Subject<Observer.Unit> = new Observer.Subject<Observer.Unit>();
	public get onDaily(): Observer.IObservable<Observer.Unit> {
		return this._onDaily.asObservable();
	}

	public constructor(timeType: eStandardTime, standardHour: number, standardMinutes: number, handler: ITakeTimeHandler) {
		this.timeType = timeType;
		this.standardHour = standardHour;
		this.standardMinutes = standardMinutes;
		this.handler = handler;
	}

	public setTakeTimeHandler(handler: ITakeTimeHandler): void {
		this.handler = handler;
	}

	public check(): boolean {
		let latestTakeTime = this.handler.get();
		let lastTime = this.changeTime(latestTakeTime);
		let standardTime = this.changeStandardTime();

		if (lastTime > standardTime.before && lastTime < standardTime.current) {
			return false;
		}

		this._onDaily.onNext(Observer.Unit);
		this.handler.set(Date.now());
		return true;
	}

	private changeTime(time: number): number {
		let gmt = 0;

		if (this.timeType === eStandardTime.UTC) {
			gmt = 0;
		} else if (this.timeType === eStandardTime.PST) {
			gmt = -8;
		}
		return time + DateUtil.hourToMillisecond(gmt);
	}

	private changeStandardTime(): IStandardTime {

		let beforeTime = 0;
		let currentTime = 0;

		let dateNow = Date.now();

		let time = this.changeTime(dateNow);
		let standardTime = new Date(time).setUTCHours(this.standardHour, this.standardMinutes, 0, 0);

		if (time < standardTime) {
			beforeTime = standardTime + DateUtil.hourToMillisecond(-24);
			currentTime = standardTime;
		} else if (time > standardTime) {
			beforeTime = standardTime;
			currentTime = standardTime + DateUtil.hourToMillisecond(24);
		}
		return {
			before: beforeTime,
			current: currentTime
		};
	}

	/**
 	* @author Isaac
 	* @description 다음 보상시간까지의 남은 시간 , 반환값 : ms
 	*/
	public nextRewardTimeByMs(): number {
		let time = this.changeTime(Date.now());
		let standardTime = this.changeStandardTime();
		return standardTime.current - time;
	}

	/**
 	* @author Isaac
 	* @description 다음 보상시간까지의 남은 시간 , 반환값 : second
 	*/
	public nextRewardTimeBySecond(): number {
		return Math.floor(this.nextRewardTimeByMs() / 1000);
	}


}