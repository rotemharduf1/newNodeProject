import { format } from 'date-fns';
import { DateTime } from 'luxon';

enum INTERVALS {
    second,
    minute,
    hour,
    'half-day',
    day,
    week,
    month,
    year
}

const intervalAdders: Record<INTERVALS, (date: Date) => Date> = {
    [INTERVALS.second]: (date: Date) => { const d = new Date(date); d.setSeconds(d.getSeconds() + 1); return d; },
    [INTERVALS.minute]: (date: Date) => { const d = new Date(date); d.setMinutes(d.getMinutes() + 1); return d; },
    [INTERVALS.hour]: (date: Date) => { const d = new Date(date); d.setHours(d.getHours() + 1); return d; },
    [INTERVALS['half-day']]: (date: Date) => { const d = new Date(date); d.setHours(d.getHours() + 12); return d; },
    [INTERVALS.day]: (date: Date) => { const d = new Date(date); d.setDate(d.getDate() + 1); return d; },
    [INTERVALS.week]: (date: Date) => { const d = new Date(date); d.setDate(d.getDate() + 7); return d; },
    [INTERVALS.month]: (date: Date) => { const d = new Date(date); d.setMonth(d.getMonth() + 1); return d; },
    [INTERVALS.year]: (date: Date) => { const d = new Date(date); d.setFullYear(d.getFullYear() + 1); return d; },
};

export type DateInput = string | number | Date

export function enumerateByInterval(startDate: DateInput, endDate: DateInput, interval: INTERVALS = INTERVALS.day): Date[] {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('Invalid date input')
    }
    if (end < start) throw new Error('End date must be >= start date')

    const dates: Date[] = []
    const current = new Date(start)

    let currentDate = new Date(start);
    while (current <= end) {
        dates.push(new Date(current));
        currentDate = intervalAdders[interval](currentDate);
    }

    return dates;
}