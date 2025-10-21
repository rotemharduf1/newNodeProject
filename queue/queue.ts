export class Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    peek(): T | undefined {
        return this.items[0];
    }

    size(): number {
        return this.items.length;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    toArray(): T[] {
        return [...this.items];
    }

    clear(): void {
        this.items = [];
    }
}

export default Queue;


//for section C: we could change the generic type to:
// export class Queue<T = number | string>
