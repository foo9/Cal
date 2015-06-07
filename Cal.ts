
module Calendar {
    export enum MonthType {
        Unknown = 0,
        Previous = 1,
        Current = 2,
        Next = 3
    }

    export class DateModel {
        private date: Date;
        private monthType: MonthType;
        private _isToday: boolean;

        constructor(date: Date, monthType: MonthType = MonthType.Unknown, isToday: boolean = false) {
            this.date = new Date(date.getTime());
            this.monthType = monthType;
            this._isToday = isToday;
        }

        getMonth(): Date {
            return new Date(this.date.getTime());
        }

        getMonthString(): string {
            return '' + this.date.getMonth() + 1;
        }

        getDateString(): string {
            return '' + this.date.getDate();
        }

        getMonthType(): MonthType {
            return this.monthType;
        }

        isToday(): boolean {
            return this._isToday;
        }

        toString(): string {
            return Util.pad(this.date.getMonth() + 1) + '/' + Util.pad(this.date.getDate());
        }
    }

    export class Util {
        public static DAYS_IN_WEEK: number = 7;
        public static WEEKS_IN_SHEET: number = 6;

        constructor() { }

        public static pad(text: any, char: string = ' ', count: number = 1): string {
            var padding: string = (new Array(count + 1)).join(char);

            return (padding + text).substr(- (count + 1));
        }

        public static normalizeDate(d: Date): Date {
            var normalized: Date = new Date(d.getTime());
            normalized.setHours(0, 0, 0, 0);

            return normalized;
        }

        public static isToday(a: Date, b: Date = new Date()): boolean {
            var aDate: Date = Util.normalizeDate(new Date(a.getTime()));
            var bDate: Date = Util.normalizeDate(new Date(b.getTime()));

            return ((aDate.getTime() - bDate.getTime()) === 0);
        }

        public static computeMonthType(a: Date, b: Date): MonthType {
            var aIndex: number = (new Date(a.getTime())).getMonth();
            var bIndex: number = (new Date(b.getTime())).getMonth();
            var index: number = (aIndex - bIndex) + 2;

            return MonthType[MonthType[index]] || MonthType.Unknown;
        }

        public static getSheet(d: Date, today: Date = new Date()): Array<Array<DateModel>> {
            var date: Date = new Date(d.getTime());

            // 対象の月の、最初の日を取得
            var normalized: Date = Util.normalizeDate(date);
            normalized.setDate(1);
            // 対象の月の、最初の日の、その日の週初めの日を設定
            normalized.setDate(normalized.getDate() - normalized.getDay());

            var weeks: Array<Array<DateModel>> = [];
            var week: number = 0;
            var monthType: MonthType;
            var isToday: boolean;

            while (true) {
                if (!weeks[week]) {
                    weeks[week] = [];
                }

                if (weeks[week].length !== Util.DAYS_IN_WEEK) {
                    monthType = Util.computeMonthType(normalized, date);
                    isToday = Util.isToday(normalized, today);
                    weeks[week].push(new DateModel(normalized, monthType, isToday));
                    normalized.setDate(normalized.getDate() + 1);
                }

                if (weeks.length === Util.WEEKS_IN_SHEET && weeks[week].length === Util.DAYS_IN_WEEK) {
                    break;
                }

                if (weeks[week].length === Util.DAYS_IN_WEEK) {
                    week++;
                }
            }

            return weeks;
        }
    }
}
