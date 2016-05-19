// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import {ipcRenderer} from 'electron'

import * as $ from 'jquery'
import * as dateformat from 'dateformat'
import * as path from 'path'

import {CompositeImageSource} from './dataSources/imageSources/compositeImageSource'
import {FolderImageSource} from './dataSources/imageSources/folderImageSource'
import {NasaImageSource} from './dataSources/imageSources/nasaImageSource'

import {WindowService} from './services/windowService'

import {Box} from './ui/box';
import {ImageBox} from './ui/imageBox'
import {Unit, Size, Dimension, Position, RgbaColor, GradientColor} from './ui/properties'
import {TextBox} from './ui/textBox'

import {Timer} from './util/timer'

class Stage {
    private _windowService: WindowService;

    private _imagesSource: CompositeImageSource;

    private _backgroundImage: ImageBox;
    private _backgroundImageTextBox: TextBox;
    private _backgroundImageTimer: Timer;

    private _dateTimeTextBox: TextBox;
    private _dateTimeTimer: Timer;

    public create() {
        this.bindKeys();
        this.createServices();
        this.createDataSources();

        this.createRoot(root => {
            root.add(this.createBackgroundImage());

            root.add(
                this.createBottomBox(bottomBox => {
                    bottomBox.add(this.createDateTimeTextBox());
                    bottomBox.add(this.createBackgroundImageTextBox());
                })
            );
        });

        this.createTimers();
    }

    private bindKeys() {
        document.onkeydown = ev => {
            // Ctrl +Shift + I
            if (ev.ctrlKey) {
                // Ctrl + Shift + I
                if (ev.shiftKey && ev.keyCode == 73) {
                    ipcRenderer.send('stage', 'dev-tools');
                }
                // Ctrl + R
                else if (ev.keyCode == 82) {
                    ipcRenderer.send('stage', 'reload');
                }
            }
            else {
                // F
                if (ev.keyCode == 70) {
                    ipcRenderer.send('stage', 'full-screen');
                }
            }
        }
    }

    private createServices(): void {
        this._windowService = new WindowService();
    }

    private createDataSources(): void {
        var source = new CompositeImageSource();
        source.addSource(new NasaImageSource());
        source.addSource(new FolderImageSource(path.join(process.cwd(), 'background/')));

        this._imagesSource = source;
    }


    private createRoot(callback: (root: Box) => void): Box {
        var root = $("<div></div>");
        $(document.body).append(root);

        var rootBox = new Box(root);
        callback(rootBox);

        return rootBox;
    }


    private createBackgroundImage(): ImageBox {
        var backImage = new ImageBox();

        this._windowService.onWindowResize = newDimension => {
            backImage.dimension = newDimension;
        };

        this._backgroundImage = backImage;

        return backImage;
    }

    private createBottomBox(callback: (bottomBox: Box) => void): Box {
        var bottomBox = new Box();
        bottomBox.position = new Position(
            null,
            null,
            new Size(0),
            null);
        bottomBox.dimension = new Dimension(
            new Size(100, Unit.Percent),
            new Size(50, Unit.Percent)
        );
        bottomBox.color = new GradientColor(
            new RgbaColor(0, 0, 0, 0),
            new RgbaColor(0, 0, 0, .75));

        callback(bottomBox);

        return bottomBox;
    }

    private createDateTimeTextBox(): TextBox {
        var box = new TextBox();
        box.position = new Position(
            null,
            new Size(40),
            new Size(75),
            null);
        box.textColor = "white";
        box.textSize = new Size(50);

        this._dateTimeTextBox = box;

        return box;
    }

    private createBackgroundImageTextBox(): TextBox {
        var box = new TextBox();
        box.position = new Position(
            null,
            new Size(40),
            new Size(50),
            null);
        box.textColor = "white";
        box.textSize = new Size(25);

        this._backgroundImage.onImageChanged = img => {
            var text = "";
            if (img.source != null) {
                text += img.source;
            }
            if (img.title != null) {
                text += ` &#8226; ${img.title}`;
            }
            box.text = text;
        };

        this._backgroundImageTextBox = box;

        return box;
    }

    private createTimers(): void {
        this._backgroundImageTimer = new Timer(
            () => {
                this.updateBackgroundImage();
            },
            60 * 1000);
        this._backgroundImageTimer.start(true);

        this._dateTimeTimer = new Timer(
            () => {
                var formattedDate = dateformat(new Date(), "hh:MM TT");
                this._dateTimeTextBox.text = formattedDate;
            },
            1000);
        this._dateTimeTimer.start(true);
    }

    private updateBackgroundImage(): void {
        var nextImage = this._imagesSource.getNext(imageInfo => {
            if (imageInfo != null) {
                this._backgroundImage.source = imageInfo;
            }
        });
    }
}

export function create(): void {
    var stage = new Stage();
    stage.create();
}