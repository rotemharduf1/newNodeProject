import { describe, it, expect } from 'vitest'
import { formatDateRange, getDateTimeInfo, enumerateByInterval } from './dates.js'

// Tests A
describe('formatDateRange', () => {
    it('should format date range with shortDate format', () => {
        const result = formatDateRange('2025-01-01', '2025-01-31', 'shortDate')
        expect(result).toBe('01/01/25 - 31/01/25')
    })

    it('should format date range with monthYear format', () => {
        const result = formatDateRange('2025-01-15', '2025-03-15', 'monthYear')
        expect(result).toBe('01/2025 - 03/2025')
    })

    it('should format date range with fullDate format', () => {
        const result = formatDateRange('2025-01-01', '2025-12-31', 'fullDate')
        expect(result).toBe('01 Jan 2025 - 31 Dec 2025')
    })

    it('throws when endDate is not a valid date', () => {
    expect(() => formatDateRange(new Date(), '2025-13-99', 'shortDate')).toThrow(/Invalid/);
    });
})

// Tests B
// describe('parseDate', () => {
//     it('should parse date-only string correctly', () => {
//         const result = parseDate('2025-01-15')
//         expect(result.getFullYear()).toBe(2025)
//         expect(result.getMonth()).toBe(0)
//         expect(result.getDate()).toBe(15)
//     })

//     it('should handle Date objects', () => {
//         const inputDate = new Date('2025-06-15')
//         const result = parseDate(inputDate)
//         expect(result.getTime()).toBe(inputDate.getTime())
//     })

//     it('should handle datetime strings', () => {
//         const result = parseDate('2025-01-15T10:30:00')
//         expect(result.getFullYear()).toBe(2025)
//         expect(result.getMonth()).toBe(0)
//         expect(result.getDate()).toBe(15)
//     })
// })

describe('getDateTimeInfo (CJS)', () => {
    it('returns info for an ISO string and proper weekend flag', () => {
        const info = getDateTimeInfo('2025-01-06T10:00:00')
        expect(info.year).toBe(2025)
        expect(info.month).toBe(1)
        expect(info.day).toBe(6)
        expect(info.isWeekend).toBe(false)
        expect(info.weekendStatus).toBe('Weekday')
    })

    it('honors timezone parameter', () => {
        const infoUTC = getDateTimeInfo('2025-01-01T00:00:00', 'UTC')
        expect(infoUTC.timeZone).toBe('UTC')
        expect(typeof infoUTC.iso).toBe('string')
    })

    it('throws on invalid date input (validity)', () => {
        expect(() => getDateTimeInfo({ not: 'a date' }))
        .toThrow('Invalid date input')
    })
})

// Tests C
// describe('enumerateByInterval', () => {
//     it('should generate monthly intervals', () => {
//         const result = enumerateByInterval('2025-01-01', '2025-03-01', 'month')
//         expect(result).toHaveLength(3)
//         expect(result[0].getMonth()).toBe(0)
//         expect(result[1].getMonth()).toBe(1)
//         expect(result[2].getMonth()).toBe(2)
//     })

//     it('should throw error for invalid interval', () => {
//         expect(() => {
//         enumerateByInterval('2025-01-01', '2025-01-02', 'invalid')
//         }).toThrow('Unsupported interval "invalid"')
//     })

//     it('should handle hourly intervals', () => {
//         const result = enumerateByInterval('2025-01-01T00:00:00', '2025-01-01T02:00:00', 'hour')
//         expect(result).toHaveLength(3)
//         expect(result[0].getHours()).toBe(0)
//         expect(result[1].getHours()).toBe(1)
//         expect(result[2].getHours()).toBe(2)
//     })
//     //להוסיף את הטקסט המלא 
// })

describe('enumerateByInterval (CJS)', () => {
    it('enumerates hourly steps inclusive of endpoints', () => {
        const result = enumerateByInterval('2025-01-01T00:00:00', '2025-01-01T02:00:00', 'hour')
        expect(result).toHaveLength(3)
        expect(result[0].getHours()).toBe(0)
        expect(result[1].getHours()).toBe(1)
        expect(result[2].getHours()).toBe(2)
    })

    it('enumerates month starts between start and end', () => {
        const result = enumerateByInterval('2025-01-01', '2025-03-01', 'month')
        expect(result).toHaveLength(3)
        expect(result[0].getMonth()).toBe(0)
        expect(result[1].getMonth()).toBe(1)
        expect(result[2].getMonth()).toBe(2)
    })

    it('throws on unsupported interval (validity)', () => {
        expect(() => enumerateByInterval('2025-01-01', '2025-01-02', 'invalid'))
        .toThrow('Unsupported interval "invalid"')
    })
})