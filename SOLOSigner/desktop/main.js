const { app, BrowserWindow } = require('electron');

/**
 * Get instance of electron-settings
 * In order to ensure ensuring that no more than one unique electron-settings instances don't exist simultaneously.
 * You must require electron-settings in the renderer process, use remote.require('electron-settings').
 */
const userReference = require('electron-settings');


// settings.deleteAll();

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


const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

/**
 * handle open file dialog
 */
ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) 
      event.sender.send('selected-directory', files);
  });
});

/**
 * handle save file dialog
 */
ipc.on('open-save-file-dialog', function (event, fileType) {
  console.log(fileType);
  dialog.showSaveDialog({ 
    filters: [
      //{ name: 'text', extensions: ['txt'] },
      { name: 'png', extensions: ['png'] }
    ]}, function (fileName) {
      if (fileName === undefined) {
        return;
      } else {
        // TODO: test code
        console.log(fileName);
        var QRCode = require('qrcode')
        // QRCode.toFile('filename.png', data.props.value);
        QRCode.toFile(fileName, userReference.get("file-content"));
        dialog.showMessageBox({ message: "The file has been saved! :-)",

      buttons: ["OK"] });
      }
  }); 
});