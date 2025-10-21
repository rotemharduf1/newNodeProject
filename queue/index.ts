import { Queue } from "./queue.js";

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

