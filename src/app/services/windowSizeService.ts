import {Notifier} from './notifier'
import {Dimension, Size} from '../ui/properties'

export class WindowSizeService extends Notifier<Dimension> {
    private _latestValue: Dimension;

    constructor() {
        super();
        this.update();

        window.onresize = this.onWindowResize.bind(this);
    }

    public getLatestValue(): Dimension {
        return this._latestValue;
    }

    private onWindowResize(arg: UIEvent): void {
        this.update();
        this.notifyAll(this._latestValue);
    }

    private update() {
        this._latestValue = new Dimension(
            new Size(window.innerWidth),
            new Size(window.innerHeight));
    }
}