import { format } from 'date-fns';
import { DateTime } from 'luxon';

//Defining the types for the function output
//return type

export type DateInput = string | number | Date

export type DateTimeInfo1 = ReturnType<typeof getDateTimeInfo>

export function getDateTimeInfo(date: DateInput, timezone?: string) {
    let dt: DateTime

    if (typeof date === 'string') dt = DateTime.fromISO(date)
    else if (date instanceof Date) dt = DateTime.fromJSDate(date)
    else if (typeof date === 'number') dt = DateTime.fromMillis(date)
    else throw new Error('Invalid date input')

    if (timezone) dt = dt.setZone(timezone)
    if (!dt.isValid) throw new Error('Invalid date input')
    const isWeekend = dt.weekday >= 6

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
        isWeekend,
        daysInMonth: dt.daysInMonth,
        timestamp: dt.toMillis(),
        timeZone: dt.zoneName,
    }
}