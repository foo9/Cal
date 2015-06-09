var Calendar;
(function (Calendar) {
    var DateEntity = (function () {
        function DateEntity(date, focus, today) {
            if (focus === void 0) { focus = false; }
            if (today === void 0) { today = false; }
            this._date = new Date(date.getTime());
            this._isFocusMonth = focus;
            this._isToday = today;
        }
        DateEntity.prototype.toDate = function () {
            return new Date(this._date.getTime());
        };
        DateEntity.prototype.isFocusMonth = function () {
            return this._isFocusMonth;
        };
        DateEntity.prototype.isToday = function () {
            return this._isToday;
        };
        DateEntity.prototype.toString = function () {
            return (this._date.getMonth() + 1) + '/' + this._date.getDate();
        };
        return DateEntity;
    })();
    Calendar.DateEntity = DateEntity;
    var Sheet = (function () {
        function Sheet(date, today) {
            if (date === void 0) { date = new Date(); }
            if (today === void 0) { today = new Date(); }
            this._pivotDate = new Date(date.getTime());
            this._todayDate = new Date(today.getTime());
        }
        Sheet.prototype.next = function () {
            this._pivotDate.setMonth(this._pivotDate.getMonth() + 1);
            return this;
        };
        Sheet.prototype.prev = function () {
            this._pivotDate.setMonth(this._pivotDate.getMonth() - 1);
            return this;
        };
        Sheet.prototype.toArray = function () {
            var date = new Date(this._pivotDate.getTime());
            var normalized = this.normalizeDate(date);
            normalized.setDate(1);
            normalized.setDate(normalized.getDate() - normalized.getDay());
            var weeks = [];
            var week = 0;
            var isFocusMonth;
            var isToday;
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
        Sheet.prototype.computeFocusMonth = function (a, b) {
            var aIndex = (new Date(a.getTime())).getMonth();
            var bIndex = (new Date(b.getTime())).getMonth();
            return ((aIndex - bIndex) == 0);
        };
        Sheet.DAYS_IN_WEEK = 7;
        Sheet.WEEKS_IN_SHEET = 6;
        return Sheet;
    })();
    Calendar.Sheet = Sheet;
})(Calendar || (Calendar = {}));
