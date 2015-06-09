module Calendar {
    export class DateEntity {
        private _date: Date;
        private _isFocusMonth: boolean;
        private _isToday: boolean;

        constructor(date: Date, focus: boolean = false, today: boolean = false) {
            this._date = new Date(date.getTime());
            this._isFocusMonth = focus;
            this._isToday = today;
        }

        public toDate(): Date {
            return new Date(this._date.getTime());
        }

        public isFocusMonth(): boolean {
            return this._isFocusMonth;
        }

        public isToday(): boolean {
            return this._isToday;
        }

        public toString(): any {
            return (this._date.getMonth() + 1) + '/' + this._date.getDate();
        }
    }

    export class Sheet {
        public static DAYS_IN_WEEK: number = 7;
        public static WEEKS_IN_SHEET: number = 6;

        private _pivotDate: Date;
        private _todayDate: Date;

        constructor(date: Date = new Date(), today: Date = new Date()) {
            this._pivotDate = new Date(date.getTime());
            this._todayDate = new Date(today.getTime());
        }

        public next(): Sheet {
            this._pivotDate.setMonth(this._pivotDate.getMonth() + 1);

            return this;
        }

        public prev(): Sheet {
            this._pivotDate.setMonth(this._pivotDate.getMonth() - 1);

            return this;
        }

        public toArray(): Array<Array<DateEntity>> {
            var date: Date = new Date(this._pivotDate.getTime());

            // 対象の月の、最初の日を取得
            var normalized: Date = this.normalizeDate(date);
            normalized.setDate(1);
            // 対象の月の、最初の日の、その日の週初めの日を設定
            normalized.setDate(normalized.getDate() - normalized.getDay());

            var weeks: Array<Array<DateEntity>> = [];
            var week: number = 0;
            var isFocusMonth: boolean;
            var isToday: boolean;

            while (true) {
                if (!weeks[week]) {
                    weeks[week] = [];
                }

                if (weeks[week].length !== Sheet.DAYS_IN_WEEK) {
                    isFocusMonth = this.computeFocusMonth(normalized, date);
                    isToday = this.isSame(normalized, this._todayDate);

                    weeks[week].push(new DateEntity(normalized, isFocusMonth, isToday));
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

        public normalizeDate(d: Date): Date {
            var normalized: Date = new Date(d.getTime());
            normalized.setHours(0, 0, 0, 0);

            return normalized;
        }

        public isSame(a: Date, b: Date): boolean {
            var aDate: Date = this.normalizeDate(new Date(a.getTime()));
            var bDate: Date = this.normalizeDate(new Date(b.getTime()));

            return ((aDate.getTime() - bDate.getTime()) === 0);
        }

        public computeFocusMonth(a: Date, b: Date): boolean {
            var aIndex: number = (new Date(a.getTime())).getMonth();
            var bIndex: number = (new Date(b.getTime())).getMonth();

            return ((aIndex - bIndex) == 0);
        }
        /*
        public debug(): void {
            var out: Array<string> = [];
            var line: Array<string>;

            this.toArray().forEach((r) => {
                line = [];
                r.forEach((e) => {
                    var f: string = e.isFocusMonth() ? '' : '-';
                    var t: string = e.isToday() ? '+' : '';
                    line.push(e.toString() + f + t);
                });
                out.push(line.join('\t'));
            });

            console.log(out.join('\n'));
            console.log('----------------------------------------------------');
        }
        */
    }
}
/*
var sheet: Calendar.Sheet = new Calendar.Sheet();
sheet.debug();

sheet.next();
sheet.debug();

sheet.prev();
sheet.prev();
sheet.debug();

sheet.next();
sheet.debug();
*/
