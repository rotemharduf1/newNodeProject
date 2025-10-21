import schedule from "node-schedule";

export type ScheduleOptions = {
  date?: Date | string | number; 
  delay?: number;
};

type Callback = any;

export function scheduler(callback: Callback, options: ScheduleOptions) {
    const { date, delay } = options || {};

    let runAt: Date;
    if (date) {
        runAt = new Date(date as any);
    } else if (typeof delay === "number") {
        runAt = new Date(Date.now() + delay);
    } else {
        runAt = new Date();
    }

    const job = schedule.scheduleJob(runAt, () => {
        if (typeof callback === "function") {
        callback();
        } else if (callback && typeof (callback as PromiseLike<any>).then === "function") {
        (callback as PromiseLike<any>).then(() => void 0);
        }
    });

    const cancel = () => job.cancel();

    return { cancel, scheduledAt: runAt };
}

export default scheduler;
