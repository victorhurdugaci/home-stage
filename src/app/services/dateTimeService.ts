import {TimerNotifier} from './notifier'

export class DateTimeService extends TimerNotifier<Date> {
    constructor() {
        super(1000);
    }

    protected getUpdate(): Date {
        return new Date();
    }
}