// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

import * as assert from 'assert'
import * as http from 'http'
import * as xml2js from 'xml2js'
import * as url from 'url'

export class RssSource<T> {
    private _requestOptions: http.RequestOptions;

    constructor(endpoint: string) {
        assert(endpoint != null);
        var parsedUrl = url.parse(endpoint);
        assert(parsedUrl != null);

        this._requestOptions = {
            host: parsedUrl.host,
            path: parsedUrl.path
        };
    }

    public download(callback: (feed: T) => void): void {
        assert(callback != null);

        this.downloadFeed(feedData => {
            xml2js.parseString(
                feedData,
                {
                    async: true,
                    explicitArray: false,
                    mergeAttrs: true
                },
                (err, xml) => {
                    if (err != null) {
                        callback(null);
                    }
                    else {
                        callback(xml);
                    }
                });
        });
    }

    private downloadFeed(callback: (feedData: string) => void): void {
        http.get(
            this._requestOptions,
            response => {
                if (response.statusCode != 200) {
                    callback(null);
                    return;
                };

                var responseBody = '';
                response.on('data', (data: string) => {
                    responseBody += data;
                });

                response.on('end', () => {
                    callback(responseBody);
                });
            })
            .end();
    }
}