/// <reference path="../../../typings/main.d.ts" />

import * as $ from 'jquery'
import {Dimension, Position} from './properties'
import {IUIElement, UIElement} from './uielement'

export class ImageInfo {
    public filePath: string;
    public height: number = 0;
    public width: number = 0;
    public description: string;
    public source: string;
}


export class ImageBox extends UIElement {
    private _source: ImageInfo;
    private _currentImage: JQuery;

    constructor() {
        var container = $('<div></div>');
        container.css('position', 'absolute');
        super(container);
        this.createImage("", () => {});
    }

    public get source(): ImageInfo {
        return this._source;
    }
    public set source(newImage: ImageInfo) {
        if (newImage == null) {
            newImage = new ImageInfo();
        }

        this._source = newImage;

        this.createImage(newImage.filePath, newImage => {
            var oldImage = this._currentImage;
            this._currentImage = newImage;

            this.getDomElement().prepend(newImage);

            if (oldImage != null) {
                oldImage.fadeOut(2000, function () {
                    oldImage.remove();
                });
            }
        });
    }

    private createImage(src: string, ready: (img: JQuery) => void) {
        var newImage = $('<div></div>');

        newImage.css('position', 'absolute');

        newImage.css('background-image', 'url("' + src + '")');
        newImage.css('background-position', 'center');
        newImage.css('background-size', 'cover');

        newImage.css('width', '100%');
        newImage.css('height', '100%');

        // TODO: Consider loading in an image first, to get the event
        // newImage.css('onreadystatechange load', function() {
        //   ready(newImage);
        // });
        ready(newImage);
    }
}
