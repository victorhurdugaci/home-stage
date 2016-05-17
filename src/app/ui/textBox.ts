/// <reference path="../../../typings/main.d.ts" />

import * as $ from 'jquery'
import {Dimension, Position} from './properties'
import {UIElement} from './uielement'

export class TextBox extends UIElement {
    private _textColor: string;
    private _textSize: number;

    private _text: string;

    constructor() {
        var textBox = $("<div></div>");
        textBox.css('position', 'absolute');
        super(textBox);
    }

    public get textColor(): string {
        return this._textColor;
    }
    public set textColor(newColor: string) {
        this._textColor = newColor;
        this.getDomElement().css('color', newColor);
    }

    public get textSize(): number {
        return this._textSize;
    }
    public set textSize(newSize: number) {
        this._textSize = newSize;
        this.getDomElement().css('font-size', newSize);
    }

    public get text(): string {
        return this._text;
    }
    public set text(newText) {
        if (this._text != newText) {
            this._text = newText;
            this.getDomElement().html(newText);
        }
    }
}