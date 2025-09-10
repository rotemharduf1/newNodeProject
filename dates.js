import { format } from "date-fns";
import { DateTime } from "luxon";
import {
    addYears, addMonths, addWeeks, addDays,
    addHours, addMinutes, addSeconds, endOfDay,
    startOfYear, startOfMonth, startOfWeek,
    startOfDay, startOfHour, startOfMinute, startOfSecond
} from "date-fns";

export const FORMATS = {
    shortDate: "dd/MM/yy",
    monthYear: "MM/yyyy",
    fullDate: "dd MMM yyyy",
};

export function formatDateRange(startDate, endDate, formatType) {
    const pattern = FORMATS[formatType];
    if (!pattern) {
        throw new Error(`Format type "${formatType}" isn't found`);
    }
    const start = format(new Date(startDate), pattern);
    const end = format(new Date(endDate), pattern);
    return `${start} - ${end}`;
}

//---------------------------------------------------------------------------------
export function getDateTimeInfo(date, timezone = null) {
    let dt;
    if (typeof date === 'string') {
        dt = DateTime.fromISO(date);
    } else if (date instanceof Date) {
        dt = DateTime.fromJSDate(date);
    } else {
        throw new Error('Invalid date input');
    }

    if (timezone) {
        dt = dt.setZone(timezone);
    }

    if (!dt.isValid) {
        throw new Error(`Invalid date: ${dt.invalidReason}`);
    }

    const isWeekend = dt.weekday >= 4 && dt.weekday <= 6;

    return {
        year: dt.year,
        month: dt.month,
        monthText: dt.monthLong,
        day: dt.day,
        weekdayText: dt.weekdayLong,
        hour: dt.hour,
        minute: dt.minute,
        second: dt.second,
        millisecond: dt.millisecond,
        iso: dt.toISO(),
        weekOfYear: dt.weekNumber,
        dayOfYear: dt.ordinal,
        quarter: dt.quarter,
        isWeekend: isWeekend,
        weekendStatus: isWeekend ? 'Weekend' : 'Weekday',
        daysInMonth: dt.daysInMonth,
        timestamp: dt.toMillis(),
        timeZone: dt.zoneName
    };
}

//---------------------------------------------------------------------------------

function toLocalIfDateOnly(input) {
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [y, m, d] = input.split("-").map(Number);
        return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) throw new Error("Invalid date input");
    return d;
    }

    function alignHalfDayLocal(d) {
    const s = startOfDay(d);
    const diffMs = d.getTime() - s.getTime();
    const twelve = 12 * 3600 * 1000;
    if (diffMs <= 0) return s;
    if (diffMs <= twelve) return new Date(s.getTime() + twelve);
    return addDays(s, 1);
    }
    const stepHalfDayLocal = (d) => addHours(d, 12);

    export function enumerateByInterval(startDate, endDate, interval = "day") {
    const fromRaw = toLocalIfDateOnly(startDate);
    const toRaw   = toLocalIfDateOnly(endDate);
    if (toRaw < fromRaw) throw new Error("End date must be >= start date");

    const dateLevel = new Set(["year","month","week","day"]);
    const key = String(interval).toLowerCase();
    const from = dateLevel.has(key) ? startOfDay(fromRaw) : fromRaw;
    const to   = dateLevel.has(key) ? endOfDay(toRaw)   : toRaw;

    const WEEK_START = 0;

    const aligners = {
        "year":     (d) => startOfYear(d),
        "month":    (d) => startOfMonth(d),
        "week":     (d) => startOfWeek(startOfDay(d), { weekStartsOn: WEEK_START }),
        "day":      (d) => startOfDay(d),
        "half-day": (d) => alignHalfDayLocal(d),
        "hour":     (d) => startOfHour(d),
        "minute":   (d) => startOfMinute(d),
        "second":   (d) => startOfSecond(d),
    };

    const steppers = {
        "year":     (d) => addYears(d, 1),
        "month":    (d) => addMonths(d, 1),
        "week":     (d) => addWeeks(d, 1),
        "day":      (d) => addDays(d, 1),
        "half-day": (d) => stepHalfDayLocal(d),
        "hour":     (d) => addHours(d, 1),
        "minute":   (d) => addMinutes(d, 1),
        "second":   (d) => addSeconds(d, 1),
    };

    const align = aligners[key];
    const step  = steppers[key];
    if (!align || !step) throw new Error(`Unsupported interval "${interval}"`);

    let cur = align(from);

    if (key === "week") {
        const out = [];
        while (cur < startOfDay(fromRaw)) cur = step(cur);
        while (cur <= to) {
        out.push(new Date(cur));
        cur = step(cur);
        }
        return out;
    }

    while (cur < from) cur = step(cur);
    const out = [];
    while (cur <= to) {
        out.push(new Date(cur));
        cur = step(cur);
    }

    const last = out[out.length - 1];
    if (!last || last.getTime() !== toRaw.getTime()) {
        out.push(new Date(toRaw));
    }

    return out;
}
