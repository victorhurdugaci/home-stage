// Copyright (c) Victor Hurdugaci (https://victorhurdugaci.com). All rights reserved.
// Licensed  under the GNU General Public License v3.0. See `LICENSE.md` in the project root.

/// <reference path="./typings/main.d.ts" />

import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron'

var stageWindow: Electron.BrowserWindow = null;

function createStage() {
    stageWindow = new BrowserWindow({
        width: 1376,
        height: 768
    });
    stageWindow.setMenu(null);

    stageWindow.loadURL('file://' + __dirname + '/app/stage.html');

    stageWindow.on('closed', function () {
        stageWindow = null;
    });

    ipcMain.on('stage', (ev, arg) => {
        if (arg == 'full-screen') {
            stageWindow.setFullScreen(!stageWindow.isFullScreen());
        }
        else if (arg == 'dev-tools') {
            stageWindow.webContents.toggleDevTools()
        }
        else if (arg == 'reload') {
            stageWindow.webContents.reload();
        }
    });
}

app.on('ready', createStage);

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (stageWindow === null) {
        createStage();
    }
});