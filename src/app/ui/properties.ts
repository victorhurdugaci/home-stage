// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

export enum Unit {
    Pixel,
    Percent
}

export class Size {
    private _value: number;
    private _unit: Unit;

    constructor(value: number, unit?: Unit) {
        if (unit == null) {
            unit = Unit.Pixel;
        }

        this._value = value;
        this._unit = unit;
    }

    public toCss(): string {
        return this._value + (this._unit == Unit.Pixel ? 'px' : '%');
    }
}

export class Dimension {
    private _width: Size;
    private _height: Size;

    constructor(width: Size, height: Size) {
        this._width = width;
        this._height = height;
    }

    public get width(): Size {
        return this._width;
    }

    public get height(): Size {
        return this._height;
    }
}

export class Position {
    private _top: Size;
    private _right: Size;
    private _bottom: Size;
    private _left: Size;

    constructor(top: Size, right: Size, bottom: Size, left: Size) {
        this._top = top;
        this._right = right;
        this._bottom = bottom;
        this._left = left;
    }

    public get top(): Size {
        return this._top;
    }
    public get right(): Size {
        return this._right;
    }
    public get bottom(): Size {
        return this._bottom;
    }
    public get left(): Size {
        return this._left;
    }
}

export interface IColor {
    toCss(): string;
}

export class RgbaColor implements IColor {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    constructor(r: number, g: number, b: number, a: number) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    public toCss(): string {
        // eg: rgba(124,234, 123, 1)
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
    }
}

export class GradientColor implements IColor {
    private _startColor: RgbaColor;
    private _endColor: RgbaColor;

    constructor(startColor: RgbaColor, endColor: RgbaColor) {
        this._startColor = startColor;
        this._endColor = endColor;
    }

    public toCss(): string {
        // eg: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);
        return `linear-gradient(to bottom, ${this._startColor.toCss()} 0%, ${this._endColor.toCss()} 100%)`;
    }
}