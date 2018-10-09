/**
 * load package json for build
 */
// given this file is: /src/browser/main.js

/* const path = require('path')
const devMode = (process.argv || []).indexOf('--dev') !== -1

// load the app dependencies for development mode
console.log("__dirname: " + __dirname);
const PATH_APP_NODE_MODULES = path.join(__dirname, 'node_modules');
require('module').globalPaths.push(PATH_APP_NODE_MODULES);
console.log("PATH_APP_NODE_MODULES: " + PATH_APP_NODE_MODULES); */

// start grpc server
// const grpcServer = require('./grpcserver/SignerGrpcServer');
// grpcServer.start();

// start proxy server
const proxy = require('./proxy/GrpcProxy');
proxy.start();

const services = require('./utils/services');

const { app, BrowserWindow, protocol } = require('electron');
const app_config = require("./app_settings").APP_SETTINGS;
const PROTOCOL_PREFIX = app_config.app.deeplink;


/**
 * Get instance of electron-settings
 * In order to ensure ensuring that no more than one unique electron-settings instances don't exist simultaneously.
 * You must require electron-settings in the renderer process, use require('electron').remote.require('electron-settings').
 */
const userReference = require('electron-settings');

// console.log(JSON.stringify(userReference.getAll(), null, 2));
// userReference.deleteAll();

let mainWindow = null;
let deeplinkingUrl = null;

// Force Single Instance Application -> this use for window -> macos is 'open-url'
const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.

  // Protocol handler for win32 and linux
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (['win32', 'linux'].includes(process.platform)) {
    // Keep only command line / deep linked arguments
    if (argv.length > 1) {
      for (var index = 1; index < argv.length; ++index) {
        if (argv[index].startsWith(PROTOCOL_PREFIX + "://")) {
          deeplinkingUrl = argv[index];
          break;
        }
      }
    }
  }

  if (mainWindow) {
    if (deeplinkingUrl) {
      handleDeepLinkURL(deeplinkingUrl);
      deeplinkingUrl = null;
    } else {
      if (mainWindow.isMinimized())
        mainWindow.restore();
      mainWindow.focus();
    }
  }
});
if (shouldQuit) {
    app.quit();
    return;
}

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

  // Protocol handler for win32 and linux
  if (['win32', 'linux'].includes(process.platform)) {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1);
  }

  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
    handleDeepLinkURL(req.url);
  });

  //hide default menu of browser
  mainWindow.setMenu(null);
  //open dev tools
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);


  /**
   * expose mainWindow for outside
   */
  exports.mainWindow = mainWindow;
}

function handleDeepLinkURL(url) {
  let split_array = url.split("://");

  // Handle case we have an empty string after splitting
  if (split_array[1] && split_array[1] != "") {
    let request_data = null;
    try {
      request_data = JSON.parse(split_array[1]);
    } catch(e) {
      console.log(e);
      return;
    }

    // Stop the function if the data cannot be parse
    if (!request_data) {
      // Show the mainwindow when calling from deep link
      mainWindow.show();
      return;
    }

    if (request_data.start == "minimized")  {
      mainWindow.minimize();
    }
  }
};

app.on('ready', () => {
  createWindow();
  if (process.argv.length > 1) {
    for (var index = 1; index < process.argv.length; ++index) {
      if (process.argv[index].startsWith(PROTOCOL_PREFIX + "://")) {
        handleDeepLinkURL(process.argv[index]);
        break;
      }
    }
  }
});

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

// Define custom protocol handler. Deep linking works on packaged versions of the application!
app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);

// Protocol handler for osx
app.on('open-url', function (event, url) {
  event.preventDefault();
  //dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  deeplinkingUrl = url;
  // console.log("in open-url handler........");
})


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
            fs.writeFileSync(fileName, fileContent);
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
    // console.log("Save file success...");
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

/**
 * Demo for send message from main to render
 * @param {*} param
 */
exports.sendMessageToRender = (param) => {
  // console.log("send-message-to-render: " + param);
};

exports.handleMainRequest = (param) => {
  if (param.action == "SIGN") {
    // grpcServer.returnSignRequest(param);
    services.sendSignRequest(param);
  }
}

exports.updateWalletInfo = services.updateWalletInfo;

