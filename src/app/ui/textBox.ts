// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as $ from 'jquery'
import {Dimension, Position, Size} from './properties'
import {UIElement} from './uielement'

export class TextBox extends UIElement {
    private _textColor: string;
    private _textSize: Size;

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

    public get textSize(): Size {
        return this._textSize;
    }
    public set textSize(newSize: Size) {
        this._textSize = newSize;
        this.getDomElement().css('font-size', newSize.toCss());
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