// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'
import {Notifier} from './notifier'

export class Timer {
    private _refreshTimer: NodeJS.Timer;
    private _refreshInterval: number;

    private _notifier: Notifier<boolean>;

    constructor(onTime: () => void, refreshInterval: number) {
        assert(refreshInterval > 0);
        assert(onTime != null);

        this._refreshInterval = refreshInterval;

        this._notifier = new Notifier<boolean>(true, false);
        this._notifier.onNotification = _ => {
            onTime();
        };
    }

    public start(triggerNow: boolean = false): void {
        if (this._refreshTimer != null) {
            // Already running
            return;
        }

        if (triggerNow) {
            this._notifier.notifyAll(false);
        }

        this.createTimeout();
    }

    public stop(): void {
        if (this._refreshTimer == null) {
            // Already stopped
            return;
        }

        clearInterval(this._refreshTimer);
        this._refreshTimer = null;
    }

    private createTimeout() {
        this._refreshTimer = setTimeout(
            () => {
                this._notifier.notifyAll(false);
                // recreate the timer
                this.createTimeout();
            },
            this._refreshInterval
        );
    }
}