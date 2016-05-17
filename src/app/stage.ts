/// <reference path='../../typings/main.d.ts' />

import {ipcRenderer} from 'electron'

import * as $ from 'jquery'
import * as dateformat from 'dateformat'
import * as path from 'path'

import {Box} from './ui/box';
import {ImageBox, ImageInfo} from './ui/imageBox'
import {Unit, Size, Dimension, Position, RgbaColor, GradientColor} from './ui/properties'
import {TextBox} from './ui/textBox'

import {DateTimeService} from './services/dateTimeService'
import {DiskImageService} from './services/imageService'
import {WindowSizeService} from './services/windowSizeService'

class Stage {
    private _dateTimeService: DateTimeService;
    private _imageService: DiskImageService;
    private _windowSizeService: WindowSizeService;

    public create() {
        this.bindKeys();

        this.createServices();

        this.createRoot(root => {
            root.add(this.createBackgroundImage());

            root.add(
                this.createBottomBox(bottomBox => {
                    bottomBox.add(this.createClock());
                })
            );
        });
    }

    private createServices() {
        this._dateTimeService = new DateTimeService();
        this._dateTimeService.start();

        this._imageService = new DiskImageService(5000);

        var imagesFolder = path.join(process.cwd(), './img_cache/');
        this._imageService.indexFolder(imagesFolder, () => {
            this._imageService.start();
        });

        this._windowSizeService = new WindowSizeService();
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

        this._imageService.subscribe(newImage => {
            backImage.source = newImage;
        });

        this._windowSizeService.subscribe(newDimension => {
            backImage.dimension = newDimension;
        });

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
            new Size(150, Unit.Pixel)
        );
        bottomBox.color = new GradientColor(
            new RgbaColor(0, 0, 0, 0),
            new RgbaColor(0, 0, 0, 1));

        callback(bottomBox);

        return bottomBox;
    }

    private createClock(): TextBox {
        var clock = new TextBox();
        clock.position = new Position(
            null,
            new Size(50),
            new Size(50),
            null);
        clock.textColor = "white";
        clock.textSize = 48;

        this._dateTimeService.subscribe(date => {
            var formattedDate = dateformat(date, "hh:MM TT");
            clock.text = formattedDate;
        });

        return clock;
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
}

export function create(): void {
    var stage = new Stage();
    stage.create();
}