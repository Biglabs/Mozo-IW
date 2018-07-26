const { app, BrowserWindow } = require('electron');

/**
 * Get instance of electron-settings
 * In order to ensure ensuring that no more than one unique electron-settings instances don't exist simultaneously.
 * You must require electron-settings in the renderer process, use remote.require('electron-settings').
 */
const settings = require('electron-settings');

settings.deleteAll();

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    minWidth: 300,
    minHeight: 400,
    maxWidth: 400,
    width: 400,
    height: 800,
    show: false,
    /* width: 1024,
    height: 768,
    show: false */
  });

  //open dev tools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

}

app.on('ready', () => {
  createWindow();
});
