// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'

export class ImageInfo {
    private _url: string;
    private _title: string;
    private _source: string;

    constructor(url: string, title: string, source: string) {
        assert(url != null);

        this._url = url;
        this._title = title;
        this._source = source;
    }

    public get url() { return this._url; }
    public get title() { return this._title; }
    public get source() { return this._source; }
}

export interface IImageSource {
    getNext(callback: (image: ImageInfo) => void): void;
}