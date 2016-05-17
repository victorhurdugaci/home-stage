/// <reference path="../../../typings/main.d.ts" />

import * as path from 'path'
import {stat, readdir} from 'fs'
import * as sizeOf from 'image-size'
import {TimerNotifier} from './notifier'
import {ImageInfo} from '../ui/imageBox'

export class DiskImageService extends TimerNotifier<ImageInfo> {
    private _imageFiles: Array<ImageInfo>;

    private _currentImageIndex: number = 0;
    private _totalImages: number = 0;


    constructor(refreshInterval: number) {
        super(refreshInterval);
    }

    public indexFolder(folder: string, done: () => void): void {
        this.stop();

        this._imageFiles = [];
        this._totalImages = 0;

        stat(folder, (err, stats) => {

            if (err != null || !stats.isDirectory()) {
                done();
                return;
            }

            readdir(folder, (err, files) => {
                files.forEach((f) => {
                    var imageInfo = new ImageInfo();
                    imageInfo.filePath = path.join(folder, f).replace(/\\/g, '/');

                    this._imageFiles.push(imageInfo);

                    sizeOf(imageInfo.filePath, (err, dim) => {
                        imageInfo.height = dim.height;
                        imageInfo.width = dim.width;
                    });
                });
                this._totalImages = files.length;

                done();
            });
        })
    }

    protected getUpdate(): ImageInfo {
        return this.getNextImage();
    }

    private getNextImage(): ImageInfo {
        if (this._totalImages == 0) {
            return null;
        }

        this._currentImageIndex = (this._currentImageIndex + 1) % this._totalImages;
        return this._imageFiles[this._currentImageIndex];
    }
}