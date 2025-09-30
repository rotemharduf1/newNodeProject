    import { format } from 'date-fns'
    import {
    FORMATS,
    formatDateRange,
    getDateTimeInfo,
    enumerateByInterval,
    } from './dates.js'

    if (import.meta.main) {
    console.log('=== formatDateRange ===')
    console.log(formatDateRange('2025-05-22', '2025-10-23', 'shortDate'))
    console.log(formatDateRange('2025-01-01', '2025-10-23', 'monthYear'))
    console.log(formatDateRange('2025-01-01', '2025-12-31', 'fullDate'))

    console.log('\n=== getDateTimeInfo (now) ===')
    console.log(getDateTimeInfo(new Date()))

    console.log('\n=== getDateTimeInfo (with timezone) ===')
    console.log(getDateTimeInfo('2024-12-25T15:30:45.123', 'Europe/London'))

    console.log('\n=== enumerateByInterval: week ===')
    const weeks = enumerateByInterval('2025-01-01', '2025-01-25', 'week')
        .map(d => format(d, 'dd/MM/yyyy'))
    console.log(weeks)

    console.log('\n=== enumerateByInterval: hour ===')
    const hours = enumerateByInterval('2025-01-01T00:00:00', '2025-01-01T02:00:00', 'hour')
        .map(d => d.toISOString())
    console.log(hours)
    }
