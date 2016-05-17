const childProcess = require('child_process');
const electron = require('electron-prebuilt');
const es = require('event-stream');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');

const srcFolder = 'src';
const outFolder = 'bin';

gulp.task('compile:shell', function () {
    const srcShellFolder = srcFolder + '/shell';

    return es
        .merge(
            compileJs(srcShellFolder),
            gulp.src([ srcShellFolder + '/package.json'])
        )
        .pipe(gulp.dest(outFolder));
});

gulp.task('compile:app', function () {
    const srcAppFolder = srcFolder + '/app';
    const outAppFolder = outFolder + '/app';

    return es
        .merge(
            compileJs(srcAppFolder),
            gulp.src([
                srcAppFolder + '/*.html',
                srcAppFolder + '/*.css'
            ]))
        .pipe(gulp.dest(outAppFolder));
});

gulp.task('build', [
    'compile:shell',
    'compile:app'
]);

gulp.task('run', ['build'], function () {
    childProcess.spawn(electron, ['.'], { cwd: outFolder, stdio: 'inherit' });
});

gulp.task('default', ['build']);

function compileJs(folder) {
    var project = ts.createProject(folder + '/tsconfig.json');
    return project.src()
        .pipe(ts(project)).js
        .pipe(gulp.dest(folder));
}