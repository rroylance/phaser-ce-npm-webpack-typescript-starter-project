const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        fullscreen: false,
        fullscreenable: false,
        height: /*[[DEFAULT_GAME_HEIGHT*/500/*DEFAULT_GAME_HEIGHT]]*/, // This is changed via the setupGameSize script, change DEFAULT_GAME_HEIGHT to MAX_GAME_HEIGHT if you'd rather use the full size instead of only the safe zone size.
        maximizable: false,
        resizeable: false,
        show: false,
        useContentSize: true,
        width: /*[[DEFAULT_GAME_WIDTH*/800/*DEFAULT_GAME_WIDTH]]*/ // This is changed via the setupGameSize script, change DEFAULT_GAME_WIDTH to MAX_GAME_WIDTH if you'd rather use the full size instead of only the safe zone size.
    });

    mainWindow.once('ready-to-show', function() {
        mainWindow.show();
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
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
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
