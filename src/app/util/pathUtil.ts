// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

export function normalizePath(path: string): string {
    if (path == null) {
        return path;
    }

    return path.replace(/\\/g, '/');
}