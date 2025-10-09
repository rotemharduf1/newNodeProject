    import { format } from 'date-fns'
    import {
    FORMATS,
    formatDateRange,
    getDateTimeInfo,
    enumerateByInterval,
    } from './dates.js'
    import { scheduler } from "./scheduler.js";
    import { Queue } from "./queue.js";



    // if (import.meta.main) {
    // console.log('=== formatDateRange ===')
    // console.log(formatDateRange('2025-05-22', '2025-10-23', 'shortDate'))
    // console.log(formatDateRange('2025-01-01', '2025-10-23', 'monthYear'))
    // console.log(formatDateRange('2025-01-01', '2025-12-31', 'fullDate'))

    // console.log('\n=== getDateTimeInfo (now) ===')
    // console.log(getDateTimeInfo(new Date()))

    // console.log('\n=== getDateTimeInfo (with timezone) ===')
    // console.log(getDateTimeInfo('2024-12-25T15:30:45.123', 'Europe/London'))

    // console.log('\n=== enumerateByInterval: week ===')
    // const weeks = enumerateByInterval('2025-01-01', '2025-01-25', 'week')
    //     .map(d => format(d, 'dd/MM/yyyy'))
    // console.log(weeks)

    // console.log('\n=== enumerateByInterval: hour ===')
    // const hours = enumerateByInterval('2025-01-01T00:00:00', '2025-01-01T02:00:00', 'hour')
    //     .map(d => d.toISOString())
    // console.log(hours)
    // }

    // src/index.ts


    // Example usage of the scheduler function
//     const task = scheduler(async () => {
//     return 42;
//     }, 5);

// task.promise
//     .then((res: any) => console.log("done:", res))
//     .catch((err: any) => console.error("failed:", err));

// Example usage of the queue

const q = new Queue<number>();
q.enqueue(10);
q.enqueue(20);
console.log(q.dequeue()); // 10
console.log(q.peek());    // 20
console.log(q.toArray()); // [20]

const mixedQueue = new Queue(); // number | string
mixedQueue.enqueue(7);
mixedQueue.enqueue("hello");
mixedQueue.enqueue("world");
mixedQueue.enqueue(100);
console.log(mixedQueue.toArray()); // [7, "hello", "world", 100]

