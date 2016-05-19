// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'

export type NotificationHandler<T> = (arg: T) => void;

export class Notifier<T> {
    private _subscribers: NotificationHandler<T>[] = [];
    private _latestValue: T;

    private _notifyOnSameValue: boolean;
    private _notifyOnSubscribe: boolean;

    constructor(notifyOnSameValue: boolean = false, notifyOnSubscribe = false) {
        this._notifyOnSameValue = notifyOnSameValue;
        this._notifyOnSubscribe = notifyOnSubscribe;
    }

    public set onNotification(handler: NotificationHandler<T>) {
        this.subscribe(handler);
    }

    private subscribe(handler: NotificationHandler<T>): void {
        assert(handler != null);

        if (this._notifyOnSubscribe) {
            handler(this._latestValue);
        }

        this._subscribers.push(handler);
    }

    public notifyAll(arg: T) {
        if (this._notifyOnSameValue || this._latestValue != arg) {
            this._latestValue = arg;
            this._subscribers.forEach(subscriber => {
                subscriber(arg);
            });
        }
    }
}