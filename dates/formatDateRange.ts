import { format } from 'date-fns';

enum FORMATS {
    shortDate = 'dd/MM/yy',
    monthYear = 'MM/yyyy',
    fullDate = 'dd MMM yyyy',
}

export type DateInput = string | number | Date

export function formatDateRange(startDate: DateInput, endDate: DateInput, formatType: FORMATS): string {
    if (!formatType) throw new Error(`Format type "${formatType}" isn't found`)

    const s = new Date(startDate)
    const e = new Date(endDate)
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
        throw new Error('Invalid date input')
    }

    return `${format(s, formatType)} - ${format(e, formatType)}`
}

