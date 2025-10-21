import { scheduler } from "./scheduler.js";

function addNumbers(a: number, b: number) {
    const result = a + b;
    console.log(`Test Result: addNumbers(${a}, ${b}) = ${result}`);
    return result;
}

scheduler(() => {
    console.log("Test Result: Callback ran after 2 seconds");
}, { delay: 2000 });

scheduler(() => addNumbers(5, 7), { delay: 3000 });

scheduler(() => {
    console.log("Test Result: Callback ran immediately (no options)");
}, {});

const { cancel, scheduledAt } = scheduler(() => {
    console.log("Test FAILED: This should never run");
}, { delay: 5000 });

setTimeout(() => {
    const cancelled = cancel();
    console.log(`Test Result: Job cancelled before execution (scheduled for ${scheduledAt.toISOString()})`, cancelled);
}, 1000);

setTimeout(() => {
    console.log("Test Result: All tests finished.");
    process.exit(0);
}, 7000);
