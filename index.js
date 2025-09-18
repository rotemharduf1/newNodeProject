import { FORMATS, formatDateRange, getDateTimeInfo, enumerateByInterval } from "./dates.js";
import { format } from "date-fns";


// console.log(formatDateRange("2025-05-22", "2025-10-23", formats.shortDate));

// console.log(formatDateRange("2025-01-01", "2025-10-23", "monthYear"));


// console.log('Current time:');
// console.log(getDateTimeInfo(new Date()));

// console.log('Specific date with timezone:');
// console.log(getDateTimeInfo('2024-12-25T15:30:45.123', 'Europe/London'));

// console.log("\nWeekend test (Thu–Sat):");
// ["2024-01-01", "2024-01-04", "2024-01-06"].forEach((date) => {
//   const info = getDateTimeInfo(date);
//   console.log(`${info.weekdayText}: ${info.isWeekend ? "Weekend" : "Weekday"}`);
// });;

console.log(
  enumerateByInterval("2025-01-01", "2025-01-25", "week")
    .map(d => format(d, "dd/MM/yyyy"))
);