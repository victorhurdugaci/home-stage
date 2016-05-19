// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'
import {List} from 'immutable'
import {ImageInfo, IImageSource} from './imageSource'

export abstract class UpdatableImageSource implements IImageSource {
    private _updateIntervalInMinutes: number;
    private _nextUpdate: Date;

    private _images: List<ImageInfo>;
    private _currentImageIndex: number = 0;
    private _totalImages: number = 0;

    constructor(updateIntervalInMinutes: number) {
        this._updateIntervalInMinutes = updateIntervalInMinutes;
    }

    public getNext(callback: (image: ImageInfo) => void): void {
        assert(callback != null);

        this.updateIfNeeded(() => {
            if (this._totalImages == 0) {
                callback(null);
                return;
            }

            this._currentImageIndex = (this._currentImageIndex + 1) % this._totalImages;
            callback(this._images.get(this._currentImageIndex));
        });
    }

    private updateIfNeeded(ready: () => void): void {
        if (this._nextUpdate == null ||
            (this._updateIntervalInMinutes > 0 && this._nextUpdate < new Date())) {

            this.update(images => {
                if (images != null && images.count() > 0) {
                    // By not setting this every time the callback is called
                    // we ensure that if the source fails (returns null)
                    // we'll retry next time. Also, we don't destroy
                    // the old images if it succeeded before
                    this._images = images;
                    this._totalImages = images.count();

                    var now = new Date();
                    now.setMinutes(now.getMinutes() + this._updateIntervalInMinutes);
                    this._nextUpdate = now;
                }

                ready();
            });
        }
        else {
            ready();
        }
    }

    protected abstract update(callback: (images: List<ImageInfo>) => void): void;
}