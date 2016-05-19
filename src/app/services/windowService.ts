// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import {Notifier, NotificationHandler} from '../util/notifier'
import {Dimension, Size} from '../ui/properties'

export class WindowService {
    private _windowSizeNotifer: Notifier<Dimension>;

    constructor() {
        this._windowSizeNotifer = new Notifier<Dimension>(false, true);
        window.onresize = this.onWindowResizeInternal.bind(this);

        // Do an update to get the initial value
        this.onWindowResizeInternal(null);
    }

    public set onWindowResize(handler: NotificationHandler<Dimension>) {
        this._windowSizeNotifer.onNotification = handler;
    }

    private onWindowResizeInternal(arg: UIEvent): void {
        this._windowSizeNotifer.notifyAll(new Dimension(
            new Size(window.innerWidth),
            new Size(window.innerHeight)
        ));
    }
}