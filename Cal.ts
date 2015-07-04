module Calendar {
	export class Cell {
		private _date: Date;
		private _isActiveMonth: boolean;
		private _isToday: boolean;

		constructor(date: Date, active: boolean = false, today: boolean = false) {
			this._date = new Date(date.getTime());
			this._isActiveMonth = active;
			this._isToday = today;
		}

		toDate(): Date {
			return new Date(this._date.getTime());
		}

		isActiveMonth(): boolean {
			return this._isActiveMonth;
		}

		isToday(): boolean {
			return this._isToday;
		}

		getYear(): number {
			return this._date.getFullYear();
		}

		getMonth(): number {
			return this._date.getMonth() + 1;
		}

		getDate(): number {
			return this._date.getDate();
		}

		isFirstDateOfMonth(): boolean {
			return this._date.getDate() === 1;
		}

		getLastDateOfMonth(): number {
			var d = this._date;

			return (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getDate();
		}

		isLastDateOfMonth(): boolean {
			var current = this.getDate();
			var last = this.getLastDateOfMonth();

			return current === last;
		}

		isFirstWeekOfMonth(): boolean {
			var current = this.getDate();

			return (current % 7) === 0;
		}

		isLastWeekOfMonth(): boolean {
			var current = this.getDate();
			var last = this.getLastDateOfMonth();

			return (current % 7) == (last % 7);
		}

		toString(): any {
            var y = this.getYear();
            var m = this.getMonth();
            var d = this.getDate();

			return [y, m, d].join('/');
		}
	}

	export class Sheet {
		static DAYS_IN_WEEK: number = 7;
		static WEEKS_IN_SHEET: number = 6;

		private _pivotDate: Date;
		private _todayDate: Date;

		constructor(date: Date = new Date(), today: Date = new Date()) {
			this._pivotDate = new Date(date.getTime());
			this._todayDate = new Date(today.getTime());
		}

		setMonth(month: Date): Sheet {
			this._pivotDate = new Date(month.getTime());

			return this;
		}

		today(): Sheet {
			this._pivotDate.setMonth(this._todayDate.getMonth());

			return this;
		}

		next(): Sheet {
			this._pivotDate.setMonth(this._pivotDate.getMonth() + 1);

			return this;
		}

		prev(): Sheet {
			this._pivotDate.setMonth(this._pivotDate.getMonth() - 1);

			return this;
		}

		toArray(format: Function = (c: string) => { return c; }): Array<Array<Cell>> {
			var date: Date = new Date(this._pivotDate.getTime());

			// 対象の月の、最初の日を取得
			var normalized: Date = this.normalizeDate(date);
			normalized.setDate(1);
			// 対象の月の、最初の日の、その日の週初めの日を設定
			normalized.setDate(normalized.getDate() - normalized.getDay());

			var weeks: Array<Array<Cell>> = [];
			var week: number = 0;
			var isActiveMonth: boolean;
			var isToday: boolean;

			while (true) {
				if (!weeks[week]) {
					weeks[week] = [];
				}

				if (weeks[week].length !== Sheet.DAYS_IN_WEEK) {
					isActiveMonth = this.isActiveMonth(normalized, date);
					isToday = this.isSame(normalized, this._todayDate);

					weeks[week].push(format(new Cell(normalized, isActiveMonth, isToday)));
					normalized.setDate(normalized.getDate() + 1);
				}

				if (weeks.length === Sheet.WEEKS_IN_SHEET && weeks[week].length === Sheet.DAYS_IN_WEEK) {
					break;
				}

				if (weeks[week].length === Sheet.DAYS_IN_WEEK) {
					week++;
				}
			}

			return weeks;
		}

		normalizeDate(d: Date): Date {
			var normalized: Date = new Date(d.getTime());
			normalized.setHours(0, 0, 0, 0);

			return normalized;
		}

		isSame(a: Date, b: Date): boolean {
			var aDate: Date = this.normalizeDate(new Date(a.getTime()));
			var bDate: Date = this.normalizeDate(new Date(b.getTime()));

			return ((aDate.getTime() - bDate.getTime()) === 0);
		}

		isActiveMonth(a: Date, b: Date): boolean {
			var aIndex: number = (new Date(a.getTime())).getMonth();
			var bIndex: number = (new Date(b.getTime())).getMonth();

			return ((aIndex - bIndex) == 0);
		}

		getYear(): number {
			return this._pivotDate.getFullYear();
		}

		getMonth(): number {
			return this._pivotDate.getMonth() + 1;
		}

		getDate(): number {
			return this._pivotDate.getDate();
		}
	}
}
