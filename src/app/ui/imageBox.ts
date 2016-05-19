// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as $ from 'jquery'
import {Dimension, Position} from './properties'
import {IUIElement, UIElement} from './uielement'
import {ImageInfo} from '../dataSources/imageSources/imageSource'
import {Notifier, NotificationHandler} from '../util/notifier'

export class ImageBox extends UIElement {
    private _imageChangedNotifier: Notifier<boolean>;

    private _source: ImageInfo;
    private _currentImage: JQuery;

    constructor() {
        var container = $('<div></div>');
        container.css('position', 'absolute');
        super(container);
        this.createImage("", () => { });

        this._imageChangedNotifier = new Notifier<boolean>(true, false);
    }

    public set onImageChanged(handler: NotificationHandler<ImageInfo>) {
        this._imageChangedNotifier.onNotification = _ => {
            handler(this._source);
        }
    }

    public get source(): ImageInfo {
        return this._source;
    }
    public set source(newImage: ImageInfo) {
        if (newImage == null) {
            newImage = new ImageInfo(null, null, null);
        }

        this._source = newImage;
        var notifier = this._imageChangedNotifier;

        this.createImage(newImage.url, newImage => {
            var oldImage = this._currentImage;
            this._currentImage = newImage;

            this.getDomElement().prepend(newImage);

            if (oldImage != null) {
                oldImage.fadeOut(2000, function () {
                    oldImage.remove();
                    notifier.notifyAll(false);
                });
            }
            else {
                notifier.notifyAll(false);
            }
        });
    }

    private createImage(src: string, ready: (img: JQuery) => void) {
        var url = 'url("' + src + '")';

        // Load the remote image in a temporary image just to download it
        var tempImage = $('<img></img>');
        tempImage.on('onreadystatechange load', function () {
            newImage.css('background-image', url);
            ready(newImage);
        });

        var newImage = $('<div></div>');
        newImage.css('position', 'absolute');

        newImage.css('background-position', 'center');
        newImage.css('background-size', 'cover');

        newImage.css('width', '100%');
        newImage.css('height', '100%');

        tempImage.attr('src', src);
    }
}
