namespace DateUtil {

	export function hourToMillisecond(hour: number): number {
		return 1000 * 60 * 60 * hour;
	}

	export function secondToMillisecond(second: number): number {
		return 1000 * 60 * second;
	}

	export interface ITimeFormat {
		hh?: string;
		mm?: string;
		ss?: string;
		ms?: string;
	}
	export function msToTimeFormat(time: number, out: ITimeFormat, zeroFormat?: string): void {

		if (time <= 0) {
			let keys = Object.keys(out);
			for (let key of keys) {
				out[key] = zeroFormat || '00';
			}
		} else {
			let ms = time % 1000;
			time = (time - ms) / 1000;
			let secs = time % 60;
			time = (time - secs) / 60;
			let mins = time % 60;
			let hrs = (time - mins) / 60;

			if (out) {
				out.hh !== undefined && (out.hh = pad(hrs));
				out.mm !== undefined && (out.mm = pad(mins));
				out.ss !== undefined && (out.ss = pad(secs));
				out.ms !== undefined && (out.ms = pad(ms, 3).slice(0, 2));
			}
		}
		// return { mm: pad(mins), ss: pad(secs), ms: pad(ms, 3).slice(0, 2) }
		// return format.format(pad(mins), pad(secs), pad(ms, 2));
		// return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 2);
	}


	// Pad to 2 or 3 digits, default is 2
	function pad(n: number, z?: number) {
		z = z || 2;
		return ('00' + n).slice(-z);
	}

}

interface Date {
	getFromFormat(format: string): string;
}
if (!Date.prototype.getFromFormat) {
	Date.prototype.getFromFormat = function (format) {
		let yyyy = this.getFullYear().toString();
		format = format.replace(/yyyy/g, yyyy)
		let mm = (this.getMonth() + 1).toString();
		format = format.replace(/mm/g, (mm[1] ? mm : "0" + mm[0]));
		let dd = this.getDate().toString();
		format = format.replace(/dd/g, (dd[1] ? dd : "0" + dd[0]));
		let hh = this.getHours().toString();
		format = format.replace(/hh/g, (hh[1] ? hh : "0" + hh[0]));
		let ii = this.getMinutes().toString();
		format = format.replace(/ii/g, (ii[1] ? ii : "0" + ii[0]));
		let ss = this.getSeconds().toString();
		format = format.replace(/ss/g, (ss[1] ? ss : "0" + ss[0]));
		return format;
	};

}