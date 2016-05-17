type NotificationHandler<T> = (arg: T) => void;

export interface INotifier<T> {
    subscribe(handler: NotificationHandler<T>): void;
    getLatestValue(): T;
}

export abstract class Notifier<T> implements INotifier<T> {
    private _subscribers: Array<NotificationHandler<T>> = [];

    public subscribe(handler: NotificationHandler<T>): void {
        this._subscribers.push(handler);

        // Give this subscriber the latest available data
        var val = this.getLatestValue();
        handler(val);
    }

    public abstract getLatestValue(): T;

    protected notifyAll(arg: T) {
        this._subscribers.forEach(subscriber => {
            subscriber(arg);
        })
    }
}

export abstract class TimerNotifier<T> extends Notifier<T> {
    private _refreshTimer: NodeJS.Timer;
    private _refreshInterval: number;

    private _lastValue: T;

    constructor(refreshInterval: number) {
        super();
        this._refreshInterval = refreshInterval;
    }

     public getLatestValue(): T {
        return this._lastValue;
     }

    public start(): void {
        if (this._refreshTimer != null) {
            return;
        }

        this.onTimer();
        this._refreshTimer = setInterval(
            () => { this.onTimer(); },
            this._refreshInterval
        );
    }

    protected abstract getUpdate(): T;

    private onTimer(): void {
        this._lastValue = this.getUpdate();
        this.notifyAll(this._lastValue);
    }

    public stop(): void {
        if (this._refreshTimer == null) {
            return;
        }

        clearInterval(this._refreshTimer);
        this._refreshTimer = null;
    }
}