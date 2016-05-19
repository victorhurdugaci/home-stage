// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

const childProcess = require('child_process');
const electron = require('electron-prebuilt');
const es = require('event-stream');
const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');

const srcFolder = path.resolve('../src');
const outFolder = path.resolve('../bin');

gulp.task('build', function () {
    return es
        .merge(
            compileJs(srcFolder),
            gulp.src([
                    path.join(srcFolder, '/package.json'),
                    path.join(srcFolder, '/app/**/*.html'),
                    path.join(srcFolder, '/app/**/*.css')
                ],
                { base: srcFolder }
            )
        )
        .pipe(gulp.dest(outFolder));
});

gulp.task('run', ['build'], function () {
    // TODO: Workaround for node_modules in the output
    // need better solution here
    var lnProc = childProcess.spawnSync(
        'ln',
        ['-s', path.join(srcFolder, 'node_modules/'), path.join(outFolder, 'node_modules')],
        { cwd: outFolder, stdio: 'inherit' }
    );

    childProcess.spawnSync(
         electron,
         ['.'],
         { cwd: outFolder, stdio: 'inherit' }
    );
});

gulp.task('default', ['build']);

function compileJs(folder) {
    var project = ts.createProject(folder + '/tsconfig.json');

    return project.src()
        .pipe(ts(project)).js
        .pipe(gulp.dest(folder));
}