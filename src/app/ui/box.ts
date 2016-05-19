// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as $ from 'jquery'
import {IColor} from './properties'
import {IUIElement, UIElement} from './uielement'

export class Box extends UIElement {
    private _color: IColor;

    constructor(domElement?: JQuery) {
        if (domElement == null) {
            domElement = $("<div></div>");
            domElement.css('position', 'absolute');
        }

        super(domElement);
    }

    public get color(): IColor {
        return this._color;
    }
    public set color(newColor: IColor) {
        this._color = newColor;
        this.getDomElement().css('background', newColor.toCss());
    }

    public add(child: IUIElement): void {
        this.getDomElement().append(child.getDomElement());
    }
}