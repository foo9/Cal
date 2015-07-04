var Calendar;
(function (Calendar) {
    var Cell = (function () {
        function Cell(date, active, today) {
            if (active === void 0) { active = false; }
            if (today === void 0) { today = false; }
            this._date = new Date(date.getTime());
            this._isActiveMonth = active;
            this._isToday = today;
        }
        Cell.prototype.toDate = function () {
            return new Date(this._date.getTime());
        };
        Cell.prototype.isActiveMonth = function () {
            return this._isActiveMonth;
        };
        Cell.prototype.isToday = function () {
            return this._isToday;
        };
        Cell.prototype.getYear = function () {
            return this._date.getFullYear();
        };
        Cell.prototype.getMonth = function () {
            return this._date.getMonth() + 1;
        };
        Cell.prototype.getDate = function () {
            return this._date.getDate();
        };
        Cell.prototype.isFirstDateOfMonth = function () {
            return this._date.getDate() === 1;
        };
        Cell.prototype.getLastDateOfMonth = function () {
            var d = this._date;
            return (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getDate();
        };
        Cell.prototype.isLastDateOfMonth = function () {
            var current = this.getDate();
            var last = this.getLastDateOfMonth();
            return current === last;
        };
        Cell.prototype.isFirstWeekOfMonth = function () {
            var current = this.getDate();
            return (current % 7) === 0;
        };
        Cell.prototype.isLastWeekOfMonth = function () {
            var current = this.getDate();
            var last = this.getLastDateOfMonth();
            return (current % 7) == (last % 7);
        };
        Cell.prototype.toString = function () {
            var y = this.getYear();
            var m = this.getMonth();
            var d = this.getDate();
            return [y, m, d].join('/');
        };
        return Cell;
    })();
    Calendar.Cell = Cell;
    var Sheet = (function () {
        function Sheet(date, today) {
            if (date === void 0) { date = new Date(); }
            if (today === void 0) { today = new Date(); }
            this._pivotDate = new Date(date.getTime());
            this._todayDate = new Date(today.getTime());
        }
        Sheet.prototype.setMonth = function (month) {
            this._pivotDate = new Date(month.getTime());
            return this;
        };
        Sheet.prototype.today = function () {
            this._pivotDate.setMonth(this._todayDate.getMonth());
            return this;
        };
        Sheet.prototype.next = function () {
            this._pivotDate.setMonth(this._pivotDate.getMonth() + 1);
            return this;
        };
        Sheet.prototype.prev = function () {
            this._pivotDate.setMonth(this._pivotDate.getMonth() - 1);
            return this;
        };
        Sheet.prototype.toArray = function (format) {
            if (format === void 0) { format = function (c) { return c; }; }
            var date = new Date(this._pivotDate.getTime());
            var normalized = this.normalizeDate(date);
            normalized.setDate(1);
            normalized.setDate(normalized.getDate() - normalized.getDay());
            var weeks = [];
            var week = 0;
            var isActiveMonth;
            var isToday;
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
        };
        Sheet.prototype.normalizeDate = function (d) {
            var normalized = new Date(d.getTime());
            normalized.setHours(0, 0, 0, 0);
            return normalized;
        };
        Sheet.prototype.isSame = function (a, b) {
            var aDate = this.normalizeDate(new Date(a.getTime()));
            var bDate = this.normalizeDate(new Date(b.getTime()));
            return ((aDate.getTime() - bDate.getTime()) === 0);
        };
        Sheet.prototype.isActiveMonth = function (a, b) {
            var aIndex = (new Date(a.getTime())).getMonth();
            var bIndex = (new Date(b.getTime())).getMonth();
            return ((aIndex - bIndex) == 0);
        };
        Sheet.prototype.getYear = function () {
            return this._pivotDate.getFullYear();
        };
        Sheet.prototype.getMonth = function () {
            return this._pivotDate.getMonth() + 1;
        };
        Sheet.prototype.getDate = function () {
            return this._pivotDate.getDate();
        };
        Sheet.DAYS_IN_WEEK = 7;
        Sheet.WEEKS_IN_SHEET = 6;
        return Sheet;
    })();
    Calendar.Sheet = Sheet;
})(Calendar || (Calendar = {}));
