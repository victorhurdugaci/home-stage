// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'
import {ImageInfo, IImageSource} from './imageSource'

export class CompositeImageSource implements IImageSource {
    private _sources: IImageSource[] = [];

    public addSource(source: IImageSource): void {
        assert(source != null);
        this._sources.push(source);
    }

    public getNext(callback: (image: ImageInfo) => void): void {
        if (this._sources.length == 0) {
            callback(null);
            return;
        }

        this.getNextImage(callback, 3);
    }

    private getNextSource(): IImageSource {
        var sourceCount = this._sources.length;
        var sourceIndex = Math.floor(Math.random() * sourceCount);
        return this._sources[sourceIndex];
    }

    private getNextImage(callback: (image: ImageInfo) => void, retriesLeft: number): void {
        if (this._sources.length == 0) {
            callback(null);
            return;
        }

        var source = this.getNextSource();
        source.getNext(image => {
            if (image != null || retriesLeft == 0) {
                callback(image);
                return;
            }

            this.getNextImage(callback, retriesLeft - 1);
        });
    }
}