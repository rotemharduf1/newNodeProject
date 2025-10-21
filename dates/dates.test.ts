import { describe, it, expect } from 'vitest'
import { formatDateRange } from './formatDateRange.js'
import { getDateTimeInfo } from './getDateTimeInfo.js'
import { enumerateByInterval } from './enumerateByInterval.js'

// local helpers reflecting the current implementations
// format patterns used by formatDateRange
const FORMAT = {
    shortDate: 'dd/MM/yy',
    monthYear: 'MM/yyyy',
    fullDate: 'dd MMM yyyy',
} as const

// INTERVAL enum shape used internally by enumerateByInterval
const INTERVAL = {
    second: 0,
    minute: 1,
    hour: 2,
    'half-day': 3,
    day: 4,
    week: 5,
    month: 6,
    year: 7,
} as const

// --------------------
// formatDateRange
// --------------------
describe('formatDateRange', () => {
    it('formats a short date range', () => {
        const out = formatDateRange('2025-01-05', '2025-01-10', FORMAT.shortDate as any)
        expect(out).toBe('05/01/25 - 10/01/25')
    })

    it('formats month/year', () => {
        const out = formatDateRange('2025-02-01', '2025-03-01', FORMAT.monthYear as any)
        expect(out).toBe('02/2025 - 03/2025')
    })

    it('formats full date', () => {
        const out = formatDateRange('2025-03-15', '2025-03-16', FORMAT.fullDate as any)
        expect(out).toBe('15 Mar 2025 - 16 Mar 2025')
    })

    it('throws on invalid date input', () => {
        expect(() => formatDateRange('not-a-date', '2025-01-02', FORMAT.shortDate as any)).toThrow('Invalid date input')
    })

    it('throws if format type is missing', () => {
        expect(() => formatDateRange('2025-01-01', '2025-01-02', undefined as any)).toThrow(`Format type "undefined" isn't found`)
    })
})

// --------------------
// getDateTimeInfo
// --------------------
describe('getDateTimeInfo', () => {
    it('parses ISO string and returns key parts', () => {
        const info = getDateTimeInfo('2025-03-15T10:30:45.123Z')
        expect(info.year).toBe(2025)
        expect(info.month).toBe(3)
        expect(info.day).toBe(15)
        expect(typeof info.iso).toBe('string')
        expect(info.timestamp).toBeTypeOf('number')
    })

    it('respects provided timezone', () => {
        const info = getDateTimeInfo('2025-03-15T10:00:00', 'Europe/Berlin')
        expect(info.timeZone).toBe('Europe/Berlin')
    })

    it('detects weekend (Saturday)', () => {
        const info = getDateTimeInfo('2025-03-15') // Saturday
        expect(info.isWeekend).toBe(true)
    })

    it('throws on invalid input', () => {
        expect(() => getDateTimeInfo({} as any)).toThrow('Invalid date input')
    })
})

// --------------------
// enumerateByInterval
// --------------------
describe('enumerateByInterval', () => {
    it('enumerates days by default including start', () => {
        const result = enumerateByInterval('2025-01-01', '2025-01-03')
        expect(result).toHaveLength(3) 
        expect(result[0].toISOString().slice(0,10)).toBe('2025-01-01')
        expect(result[1].toISOString().slice(0,10)).toBe('2025-01-02')
        expect(result[2].toISOString().slice(0,10)).toBe('2025-01-03')
    })

    it('enumerates month starts between start and end', () => {
        const result = enumerateByInterval('2025-01-01', '2025-03-01', INTERVAL.month as any)
        expect(result.length >= 3).toBe(true)
        expect(result[0].getMonth()).toBe(0)
        expect(result[1].getMonth()).toBe(1)
        expect(result[2].getMonth()).toBe(2)
    })

    it('throws on invalid dates', () => {
        expect(() => enumerateByInterval('bad', 'worse')).toThrow('Invalid date input')
    })

    it('throws if end < start', () => {
        expect(() => enumerateByInterval('2025-01-03', '2025-01-01')).toThrow('End date must be >= start date')
    })
})
