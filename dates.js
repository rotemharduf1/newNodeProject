import { format } from "date-fns";
import { DateTime } from 'luxon';
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
export function parseDate(input) {
    if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [y, m, d] = input.split("-").map(Number);
        return new Date(y, m - 1, d);
    }
    return new Date(input);
    }

    const intervals = {
    'second': 1000,
    'minute': 60 * 1000,
    'hour': 60 * 60 * 1000,
    'half-day': 12 * 60 * 60 * 1000,
    'day': 24 * 60 * 60 * 1000
    };

export function enumerateByInterval(startDate, endDate, interval = "day") {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date input");
    }
    if (end < start) {
        throw new Error("End date must be >= start date");
    }
    
    const dates = [];
    const current = new Date(start);
    if (interval === 'week') {
        const startOfWeek = new Date(current);
        startOfWeek.setDate(current.getDate() - current.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const currentWeek = new Date(startOfWeek);
        while (currentWeek <= end) {
            if (currentWeek >= start) {
                dates.push(new Date(currentWeek));
        }
        currentWeek.setDate(currentWeek.getDate() + 7);
        }
    return dates;
    }

    if (interval === 'month') {
        while (current <= end) {
            dates.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }
    return dates;
    }

    if (interval === 'year') {
        while (current <= end) {
            dates.push(new Date(current));
            current.setFullYear(current.getFullYear() + 1);
        }
        return dates;
    }
    

    const intervalMs = intervals[interval];
    if (!intervalMs) {
        throw new Error(`Unsupported interval "${interval}"`);
    }
    
    while (current <= end) {
        dates.push(new Date(current));
        current.setTime(current.getTime() + intervalMs);
    }
    
    return dates;
}
