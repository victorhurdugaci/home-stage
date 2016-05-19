// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import {Dimension, Position} from './properties'

export interface IUIElement {
    position: Position;
    dimension: Dimension;

    getDomElement(): JQuery;
}

export abstract class UIElement implements IUIElement {
    private _position: Position;
    private _dimension: Dimension;

    private _element: JQuery;

    constructor(domElement: JQuery) {
        this._element = domElement;
    }

    public get position(): Position {
        return this._position;
    }
    public set position(newPosition: Position) {
        this._position = newPosition;
        this.updatePosition();
    }

    public get dimension(): Dimension {
        return this._dimension;
    }
    public set dimension(newDimension: Dimension) {
        this._dimension = newDimension;
        this.updateDimension();
    }

    public getDomElement(): JQuery {
        return this._element;
    }

    private updateDimension() {
        this._element.css(
            'height',
            this.dimension.height != null ? this._dimension.height.toCss() : '');
        this._element.css(
            'width',
            this.dimension.width != null ? this._dimension.width.toCss() : '');
    }

    private updatePosition() {
        this._element.css(
            'top',
            this.position.top != null ? this._position.top.toCss() : '');
        this._element.css(
            'right',
            this.position.right != null ? this._position.right.toCss() : '');
        this._element.css(
            'bottom',
            this.position.bottom != null ? this._position.bottom.toCss() : '');
        this._element.css(
            'left',
            this.position.left != null ? this._position.left.toCss() : '');
    }
}