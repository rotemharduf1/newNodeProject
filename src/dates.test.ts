import { describe, it, expect } from 'vitest'
import {
    formatDateRange,
    getDateTimeInfo,
    enumerateByInterval,
} from './dates.js'
import type { FormatKey, SimpleInterval, DateTimeInfo } from './dates.js'

const SHORT: FormatKey = 'shortDate'
const MONTH_YEAR: FormatKey = 'monthYear'
const FULL: FormatKey = 'fullDate'
const HOUR: SimpleInterval = 'hour'
const MONTH: SimpleInterval = 'month'

// Tests A
describe('formatDateRange', () => {
    it('should format date range with shortDate format', () => {
        const result: string = formatDateRange('2025-01-01', '2025-01-31', SHORT)
        expect(result).toBe('01/01/25 - 31/01/25')
    })

    it('should format date range with monthYear format', () => {
        const result: string = formatDateRange('2025-01-15', '2025-03-15', MONTH_YEAR)
        expect(result).toBe('01/2025 - 03/2025')
    })

    it('should format date range with fullDate format', () => {
        const result: string = formatDateRange('2025-01-01', '2025-12-31', FULL)
        expect(result).toBe('01 Jan 2025 - 31 Dec 2025')
    })

    it('throws when endDate is not a valid date', () => {
        expect(() => formatDateRange(new Date(), '2025-13-99', SHORT)).toThrow(/Invalid/)
    })
})

// Tests B
describe('getDateTimeInfo (ESM/TS)', () => {
    it('returns info for an ISO string and proper weekend flag', () => {
        const info: DateTimeInfo = getDateTimeInfo('2025-01-06T10:00:00')
        expect(info.year).toBe(2025)
        expect(info.month).toBe(1)
        expect(info.day).toBe(6)
        expect(info.isWeekend).toBe(false)
    })

    it('honors timezone parameter', () => {
        const infoUTC: DateTimeInfo = getDateTimeInfo('2025-01-01T00:00:00', 'UTC')
        expect(infoUTC.timeZone).toBe('UTC')
        expect(typeof infoUTC.iso).toBe('string')
    })

    it('throws on invalid date input (validity)', () => {
        expect(() => getDateTimeInfo('not-a-date')).toThrow('Invalid date input')
    })
})

// Tests C
describe('enumerateByInterval (ESM/TS)', () => {
    it('enumerates hourly steps inclusive of endpoints', () => {
        const result: Date[] = enumerateByInterval('2025-01-01T00:00:00','2025-01-01T02:00:00',HOUR)
        expect(result).toHaveLength(3)
        expect(result[0].getHours()).toBe(0)
        expect(result[1].getHours()).toBe(1)
        expect(result[2].getHours()).toBe(2)
    })

    it('enumerates month starts between start and end', () => {
        const result: Date[] = enumerateByInterval('2025-01-01', '2025-03-01', MONTH)
        expect(result).toHaveLength(3)
        expect(result[0].getMonth()).toBe(0)
        expect(result[1].getMonth()).toBe(1)
        expect(result[2].getMonth()).toBe(2)
    })

    it('throws on unsupported interval (validity)', () => {
        expect(() => enumerateByInterval('2025-01-01', '2025-01-02', 'invalid' as unknown as SimpleInterval))
        .toThrow('Unsupported interval "invalid"')
    })
})
