import schedule from "node-schedule";

export type DateLike = number | Date | string;

export interface ScheduledTask<T = unknown> {
    promise: Promise<T>;
    cancel: () => boolean;
    scheduledAt: Date;
}

export function scheduler<T = unknown>(callback: () => T | Promise<T>, time: DateLike): ScheduledTask<T> {
    const executionDate =
        typeof time === "number" ? new Date(Date.now() + time * 1000) // seconds to ms
        : time instanceof Date ? time : new Date(time); // ISO

    let job: schedule.Job | null = null;

    const promise = new Promise<T>((resolve, reject) => {
        job = schedule.scheduleJob(executionDate, async () => {
        try {
            const result = await callback();
            resolve(result as T);
        } catch (err) {
            reject(err);
        } finally {
            job = null;
        }
        });

        if (!job) {
        reject(new Error("Failed to schedule job"));
        }
    });

    const cancel = () => (job ? job.cancel() : false);

    return { promise, cancel, scheduledAt: executionDate };
}
