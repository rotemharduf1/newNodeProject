import { format } from 'date-fns';
import { DateTime } from 'luxon';

// ---------- Types ----------
export const FORMATS = {
    shortDate: 'dd/MM/yy',
    monthYear: 'MM/yyyy',
    fullDate: 'dd MMM yyyy',
} as const
export type FormatKey = keyof typeof FORMATS

export type DateInput = string | number | Date

// --------------------
export function formatDateRange(startDate: DateInput, endDate: DateInput, formatType: FormatKey): string {
    const pattern = FORMATS[formatType]
    if (!pattern) throw new Error(`Format type "${formatType}" isn't found`)

    const s = new Date(startDate)
    const e = new Date(endDate)
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
        throw new Error('Invalid date input')
    }

    return `${format(s, pattern)} - ${format(e, pattern)}`
}

// --------------------
//Defining the types for the function output
export interface DateTimeInfo {
    year: number
    month: number
    monthText: string | null
    day: number
    weekdayText: string | null
    hour: number
    minute: number
    second: number
    millisecond: number
    iso: string | null
    weekOfYear: number
    dayOfYear: number
    quarter: number
    isWeekend: boolean
    daysInMonth: number | undefined
    timestamp: number
    timeZone: string | null
}

export function getDateTimeInfo(date: DateInput, timezone?: string): DateTimeInfo {
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

// --------------------
export const intervals = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    'half-day': 12 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
} as const

export type SimpleInterval = keyof typeof intervals | 'week' | 'month' | 'year'

export function enumerateByInterval(startDate: DateInput, endDate: DateInput, interval: SimpleInterval = 'day'): Date[] {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('Invalid date input')
    }
    if (end < start) throw new Error('End date must be >= start date')

    const dates: Date[] = []
    const current = new Date(start)

    if (interval === 'week') {
        const weekStart = new Date(current)
        weekStart.setDate(current.getDate() - weekStart.getDay())
        weekStart.setHours(0, 0, 0, 0)

        for (const d = new Date(weekStart); d <= end; d.setDate(d.getDate() + 7)) {
        if (d >= start) dates.push(new Date(d))
        }
        return dates
    }

    if (interval === 'month') {
        while (current <= end) {
        dates.push(new Date(current))
        current.setMonth(current.getMonth() + 1)
        }
        return dates
    }

    if (interval === 'year') {
        while (current <= end) {
        dates.push(new Date(current))
        current.setFullYear(current.getFullYear() + 1)
        }
        return dates
    }

    const intervalMs = (interval in intervals) ? intervals[interval as keyof typeof intervals] : undefined
    if (!intervalMs) throw new Error(`Unsupported interval "${interval}"`)

    while (current <= end) {
        dates.push(new Date(current))
        current.setTime(current.getTime() + intervalMs)
    }

    return dates
}
