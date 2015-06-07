var Calendar;
(function (Calendar) {
    (function (MonthType) {
        MonthType[MonthType["Unknown"] = 0] = "Unknown";
        MonthType[MonthType["Previous"] = 1] = "Previous";
        MonthType[MonthType["Current"] = 2] = "Current";
        MonthType[MonthType["Next"] = 3] = "Next";
    })(Calendar.MonthType || (Calendar.MonthType = {}));
    var MonthType = Calendar.MonthType;
    var DateModel = (function () {
        function DateModel(date, monthType, isToday) {
            if (monthType === void 0) { monthType = MonthType.Unknown; }
            if (isToday === void 0) { isToday = false; }
            this.date = new Date(date.getTime());
            this.monthType = monthType;
            this._isToday = isToday;
        }
        DateModel.prototype.getMonth = function () {
            return new Date(this.date.getTime());
        };
        DateModel.prototype.getMonthString = function () {
            return '' + this.date.getMonth() + 1;
        };
        DateModel.prototype.getDateString = function () {
            return '' + this.date.getDate();
        };
        DateModel.prototype.getMonthType = function () {
            return this.monthType;
        };
        DateModel.prototype.isToday = function () {
            return this._isToday;
        };
        DateModel.prototype.toString = function () {
            return Util.pad(this.date.getMonth() + 1) + '/' + Util.pad(this.date.getDate());
        };
        return DateModel;
    })();
    Calendar.DateModel = DateModel;
    var Util = (function () {
        function Util() {
        }
        Util.pad = function (text, char, count) {
            if (char === void 0) { char = ' '; }
            if (count === void 0) { count = 1; }
            var padding = (new Array(count + 1)).join(char);
            return (padding + text).substr(-(count + 1));
        };
        Util.normalizeDate = function (d) {
            var normalized = new Date(d.getTime());
            normalized.setHours(0, 0, 0, 0);
            return normalized;
        };
        Util.isToday = function (a, b) {
            if (b === void 0) { b = new Date(); }
            var aDate = Util.normalizeDate(new Date(a.getTime()));
            var bDate = Util.normalizeDate(new Date(b.getTime()));
            return ((aDate.getTime() - bDate.getTime()) === 0);
        };
        Util.computeMonthType = function (a, b) {
            var aIndex = (new Date(a.getTime())).getMonth();
            var bIndex = (new Date(b.getTime())).getMonth();
            var index = (aIndex - bIndex) + 2;
            return MonthType[MonthType[index]] || MonthType.Unknown;
        };
        Util.getSheet = function (d, today) {
            if (today === void 0) { today = new Date(); }
            var date = new Date(d.getTime());
            var normalized = Util.normalizeDate(date);
            normalized.setDate(1);
            normalized.setDate(normalized.getDate() - normalized.getDay());
            var weeks = [];
            var week = 0;
            var monthType;
            var isToday;
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
        };
        Util.DAYS_IN_WEEK = 7;
        Util.WEEKS_IN_SHEET = 6;
        return Util;
    })();
    Calendar.Util = Util;
})(Calendar || (Calendar = {}));
