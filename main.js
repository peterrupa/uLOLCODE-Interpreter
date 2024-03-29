var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var fs = require('fs');
var dialog = require('dialog');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    center: true,
    resizable: false,
    title: 'uLOLCODE Interpreter',
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // listen
  ipc.on('open-file', function(){
    // open dialog box
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{
        name: 'LOLCODES',
        extensions: ['lol']
      }]
    }, function(filename){
      fs.readFile(filename[0], 'utf8', function(err, data){
        mainWindow.webContents.send('send-code', data);
      });
    });
  });

  ipc.on('open-devtools', function(){
    mainWindow.openDevTools();
  });
});
