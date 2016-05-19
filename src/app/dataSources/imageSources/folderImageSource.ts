// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'
import * as fs from 'fs'
import {List} from 'immutable'
import * as path from 'path'
import {ImageInfo} from './imageSource'
import {UpdatableImageSource} from './updatableImageSource'
import * as pathUtil from '../../util/pathUtil'

// The structure of the meta.json file
interface SourceMeta {
    name: string;
    images: {
        [file: string]: {
            title: string,
            description: string
        }
    }
}

export class FolderImageSource extends UpdatableImageSource {
    private _folder: string;
    private _metaFilePath: string;

    constructor(folder: string) {
        super(-1 /* no updates */);

        assert(folder != null);

        this._folder = folder;
        this._metaFilePath = path.join(folder, "meta.json");
    }

    protected update(callback: (images: List<ImageInfo>) => void): void {
        assert(callback != null);

        var folder = this._folder;

        if (!fs.existsSync(folder)) {
            callback(null);
            return;
        }

        fs.readdir(folder, (err, files) => {
            if (err != null ||
                files == null ||
                files.length == 0) {
                callback(null);
                return;
            }

            this.readSourceMeta(sourceMeta => {
                var sourceName: string;
                if (sourceMeta != null) {
                    sourceName = sourceMeta.name;
                }

                var images: ImageInfo[] = [];

                files.forEach((file) => {
                    if (path.extname(file) != '.jpg') {
                        return;
                    }

                    var title: string;
                    if (sourceMeta != null) {
                        var imageMeta = sourceMeta.images[file];
                        if (imageMeta != null) {
                            title = imageMeta.title;
                        }
                    }

                    var imageInfo = new ImageInfo(
                        pathUtil.normalizePath(path.join(folder, file)),
                        title,
                        sourceName);
                    images.push(imageInfo);
                });

                callback(List(images));
            });
        });
    }

    private readSourceMeta(callback: (sourceMeta: SourceMeta) => void): void {
        fs.readFile(this._metaFilePath, 'utf8', (err, content) => {
            var sourceMeta: SourceMeta;
            if (err == null) {
                sourceMeta = JSON.parse(content);
            }

            callback(sourceMeta);
        });
    }
}