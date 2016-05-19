// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'
import {List} from 'immutable'
import {ImageInfo} from './imageSource'
import {UpdatableImageSource} from './updatableImageSource'
import {RssSource} from '../rssSource'

// The structure of the NASA rss feed
interface NasaFeed {
    rss: {
        channel: {
            item: {
                title: string,
                enclosure: {
                    url: string,
                    type: string,
                    length: string,
                }
            }[]
        }
    }
}

export class NasaImageSource extends UpdatableImageSource {
    private static SOURCE_NAME = 'NASA Image of the Day';

    private _rssSource: RssSource<NasaFeed>;

    constructor() {
        super(60 /* minutes */);

        this._rssSource = new RssSource<NasaFeed>('http://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss');
    }

    protected update(callback: (images: List<ImageInfo>) => void): void {
        this._rssSource.download(feedData => {
            if (feedData == null) {
                callback(null);
                return;
            }

            var images: ImageInfo[] = [];

            feedData.rss.channel.item.slice(0, 10).forEach(image => {
                var isValidImage = image != null &&
                    image.enclosure != null &&
                    image.enclosure.url != null &&
                    image.enclosure.type == 'image/jpeg';

                if (isValidImage) {
                    var newImage = new ImageInfo(
                        image.enclosure.url,
                        image.title,
                        NasaImageSource.SOURCE_NAME);

                    images.push(newImage);
                }
            });

            callback(List(images));
        });
    }
}