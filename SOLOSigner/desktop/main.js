const { app, BrowserWindow } = require('electron');

/**
 * Get instance of electron-settings
 * In order to ensure ensuring that no more than one unique electron-settings instances don't exist simultaneously.
 * You must require electron-settings in the renderer process, use require('electron').remote.require('electron-settings').
 */
const userReference = require('electron-settings');

userReference.deleteAll();

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

  //hide default menu of browser
  //mainWindow.setMenu(null);
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


const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

/**
 * handle open file dialog
 */
ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    if (files) 
      event.sender.send('selected-file', files[0]);
  });
});


/**
 * handle save QR Code file
 */
ipc.on('open-save-file-dialog', function (event, fileExtenstion) {
  try {
    let fileType = fileExtenstion.fileType.toLowerCase();
    let fileContent = userReference.get("file-content");
    
    //open save file dialog
    dialog.showSaveDialog({ 
      filters: [
        { name: fileType, extensions: [fileType] }
      ]}, function (fileName) {
        if (fileName === undefined) {
          return;
        } else {
          // save file base on type
          if(fileType === 'png') {
            var QRCode = require('qrcode');
            QRCode.toFile(fileName, fileContent);
          } else if(fileType === 'txt'){
            var fs = require('fs');
            fs.writeFileSync(fileName, fileContent, 'utf-8');
          } else {
            throw "Invalid file extension";
          }
          showMessageDialog();
          //clear save data
          userReference.set("file-content","");
        }
    }); 
  } catch (error) {
    showErrorDialog();
  }
});

/**
 * Display message dialog
 * 
 * @param {Object} option Configuration for message dialog 
 */
function showMessageDialog(option) {
  const options = {
    type: 'info',
    title: 'Information',
    message: "Save file successful?",
    buttons: ['OK']
  };

  dialog.showMessageBox(options, function (index) {
    console.log("Save file success...");
  });
}

/**
 * Display error dialog
 */
function showErrorDialog() {
  ipc.on('open-error-dialog', function (event) {
    dialog.showErrorBox('Error Message', 'System has problem while processing.');
  })
}