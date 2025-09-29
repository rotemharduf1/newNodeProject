import { describe, it, expect } from 'vitest'
import { formatDateRange, parseDate, enumerateByInterval } from './dates.js'

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

    //טקסט של ה קורה שאני שולחת משהו שלא תאריך
})

// Tests B
describe('parseDate', () => {
    it('should parse date-only string correctly', () => {
        const result = parseDate('2025-01-15')
        expect(result.getFullYear()).toBe(2025)
        expect(result.getMonth()).toBe(0)
        expect(result.getDate()).toBe(15)
    })

    it('should handle Date objects', () => {
        const inputDate = new Date('2025-06-15')
        const result = parseDate(inputDate)
        expect(result.getTime()).toBe(inputDate.getTime())
    })

    it('should handle datetime strings', () => {
        const result = parseDate('2025-01-15T10:30:00')
        expect(result.getFullYear()).toBe(2025)
        expect(result.getMonth()).toBe(0)
        expect(result.getDate()).toBe(15)
    })
})

// Tests C
describe('enumerateByInterval', () => {
    it('should generate monthly intervals', () => {
        const result = enumerateByInterval('2025-01-01', '2025-03-01', 'month')
        expect(result).toHaveLength(3)
        expect(result[0].getMonth()).toBe(0)
        expect(result[1].getMonth()).toBe(1)
        expect(result[2].getMonth()).toBe(2)
    })

    it('should throw error for invalid interval', () => {
        expect(() => {
        enumerateByInterval('2025-01-01', '2025-01-02', 'invalid')
        }).toThrow('Unsupported interval "invalid"')
    })

    it('should handle hourly intervals', () => {
        const result = enumerateByInterval('2025-01-01T00:00:00', '2025-01-01T02:00:00', 'hour')
        expect(result).toHaveLength(3)
        expect(result[0].getHours()).toBe(0)
        expect(result[1].getHours()).toBe(1)
        expect(result[2].getHours()).toBe(2)
    })
    //להוסיף את הטקסט המלא 
})