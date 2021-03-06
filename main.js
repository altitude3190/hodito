const electron = require('electron');
// Module to control application life.
const { app, Menu } = electron;
// Module to create native browser window.
const { BrowserWindow } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow(
        {
            minWidth: 960,
            minHeight: 540,
        }
    );
    win.maximize();

    // and load the index.html of the app.
    win.loadURL(`file://${__dirname}/index.html`);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // links are always opened by a default browser
    const webContents = win.webContents;
    const openExternal = (e, url) => {
        if (url === webContents.getURL()) return;
        e.preventDefault();
        electron.shell.openExternal(url);
    };
    webContents.on('new-window', openExternal);
    webContents.on('will-navigate', openExternal);

    const template = [
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'pasteandmatchstyle' },
                { role: 'delete' },
                { role: 'selectall' },
            ],
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click() { electron.shell.openExternal('https://github.com/altitude3190/Hodito'); },
                },
            ],
        },
    ];

    if (process.platform === 'darwin') {
        template.unshift(
            {
                label: app.getName(),
                submenu: [
                  { role: 'about' },
                  { type: 'separator' },
                  { role: 'services', submenu: [] },
                  { type: 'separator' },
                  { role: 'hide' },
                  { role: 'hideothers' },
                  { role: 'unhide' },
                  { type: 'separator' },
                  { role: 'quit' },
                ],
            }
        );

        // Window menu
        template[3].submenu = [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' },
        ];
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
