const electron = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, Menu, Tray, ipcMain, dialog } = electron;
const log = require("electron-log");
var info = {
  version: "5.0.1",
  date: "18-12-2018 21:25 PM",
  electronVersion: "3.0.12"
};

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

const iconPath = path.join(__dirname, "/assets/icons/win/logo.ico");
let mainWindow,
  tray,
  newEntryWindow,
  chartWindow,
  settingsWindow,
  editEntryWindow,
  lateMoneyWindow = null;

// Check for Update
autoUpdater.on("checking-for-update", () => {
  dialog.showMessageBox({
    title: "Lone",
    message: "Checking for Update",
    icon: iconPath
  });
});

autoUpdater.on("update-available", info => {
  dialog.showMessageBox({
    title: "Lone",
    message: `A new update is ready to install
     Version ${
       info.version
     } is downloaded and will be automatically installed.`,
    buttons: ["OK"],
    icon: iconPath
  });
});

autoUpdater.on("update-not-available", () => {
  dialog.showMessageBox({
    title: "Lone",
    message: "There is no update Currently",
    buttons: ["OK"],
    icon: iconPath
  });
});

autoUpdater.on("update-downloaded", info => {
  autoUpdater.quitAndInstall();
});


autoUpdater.on("error", error => {
  dialog.showMessageBox({
    title: "Lone",
    message: error,
    buttons: ["OK"],
    icon: iconPath
  });
});
// End of Check for Update

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: iconPath,
    // Remove if not working
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: "hidden",
    show: false
    // Remove End
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/assets/webassets/index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  mainWindow.on("close", () => {
    app.quit();
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.maximize();
  // Menu Start
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  const trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
  tray = new Tray(iconPath);
  tray.setContextMenu(trayMenu);
  tray.setToolTip("Lone");
  tray.on("click", function() {
    if (mainWindow.isMinimized()) {
      mainWindow.maximize();
    } else {
      mainWindow.minimize();
    }
  });
  // Menu End
  if (isDev) mainWindow.webContents.openDevTools();
}

ipcMain.on("showdetails", (e, i) => {
  editEntry();
  setTimeout(() => {
    editEntryWindow.webContents.send("showdetails", i);
  }, 1000);
});

ipcMain.on("addeditem", () => {
  if (newEntryWindow != null) newEntryWindow.close();
  mainWindow.webContents.send("addeditem");
  if (lateMoneyWindow != null) lateMoneyWindow.close();
  if (editEntryWindow != null) editEntryWindow.close();
  if (chartWindow != null) chartWindow.webContents.send("addeditem");
});

ipcMain.on("deletedEntry", () => {
  if (lateMoneyWindow != null) lateMoneyWindow.close();
  if (chartWindow != null) chartWindow.webContents.send("addeditem");
});

ipcMain.on("addeditem", () => {
  lateMoney();
  if (lateMoneyWindow != null) lateMoneyWindow.close();
});

function lateMoney() {
  lateMoneyWindow = new BrowserWindow({
    icon: iconPath,
    height: 700,
    width: 1200,
    // Remove if not working
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: "hidden",
    show: false,
    autoHideMenuBar: true
    // Remove End
  });
  lateMoneyWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/assets/webassets/latemoney.html"),
      protocol: "file:",
      slashes: true
    })
  );

  lateMoneyWindow.on("close", () => {
    lateMoneyWindow = null;
  });
  lateMoneyWindow.once("ready-to-show", () => {
    lateMoneyWindow.show();
  });
  if (isDev) lateMoneyWindow.webContents.openDevTools();
}

function showAbout() {
  dialog.showMessageBox({
    title: "About",
    message: `Lone a Saverl Inc. Product
              
    Version: ${info.version}
    Date: ${info.date}
    Electron: ${info.electronVersion}
    OS: ${process.platform}`,
    icon: iconPath
  });
}

function editEntry() {
  editEntryWindow = new BrowserWindow({
    icon: iconPath,
    height: 550,
    width: 800,
    // Remove if not working
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: "hidden",
    show: false,
    autoHideMenuBar: true
    // Remove End
  });
  editEntryWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/assets/webassets/editentry.html"),
      protocol: "file:",
      slashes: true
    })
  );

  editEntryWindow.on("close", () => {
    editEntryWindow = null;
  });
  editEntryWindow.once("ready-to-show", () => {
    editEntryWindow.show();
  });
  if (isDev) editEntryWindow.webContents.openDevTools();
}

function newEntry() {
  newEntryWindow = new BrowserWindow({
    icon: iconPath,
    height: 335,
    width: 500,
    // Remove if not working
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: "hidden",
    show: false,
    autoHideMenuBar: true
    // Remove End
  });
  newEntryWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/assets/webassets/newentry.html"),
      protocol: "file:",
      slashes: true
    })
  );

  newEntryWindow.on("close", () => {
    newEntryWindow = null;
  });
  newEntryWindow.once("ready-to-show", () => {
    newEntryWindow.show();
  });
  if (isDev) newEntryWindow.webContents.openDevTools();
}

function settings() {
  settingsWindow = new BrowserWindow({
    icon: iconPath,
    height: 550,
    width: 800,
    // Remove if not working
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: "hidden",
    show: false,
    autoHideMenuBar: true
    // Remove End
  });
  settingsWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/assets/webassets/settingswindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  settingsWindow.on("close", () => {
    settingsWindow = null;
  });
  settingsWindow.once("ready-to-show", () => {
    settingsWindow.show();
  });
  if (isDev) settingsWindow.webContents.openDevTools();
}

function openPersonChart() {
  chartWindow = new BrowserWindow({
    icon: iconPath,
    height: 400,
    width: 800,
    // Remove if not working
    webPreferences: {
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: "hidden",
    show: false,
    autoHideMenuBar: true
    // Remove End
  });
  chartWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/assets/webassets/chartwindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  chartWindow.on("close", () => {
    chartWindow = null;
  });
  chartWindow.once("ready-to-show", () => {
    chartWindow.show();
  });
  if (isDev) chartWindow.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

const trayMenuTemplate = [
  {
    label: "Show/Hide Lone",
    click() {
      if (mainWindow.isMinimized()) {
        mainWindow.maximize();
        // mainWindow.
      } else {
        mainWindow.minimize();
      }
    }
  },
  {
    label: "Settings",
    click() {
      if (mainWindow.isMinimized()) {
        mainWindow.maximize();
      }
      settings();
    }
  },
  {
    type: "separator"
  },
  {
    label: "Exit",
    click() {
      app.quit();
    }
  }
];

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Entry",
        accelerator: "CmdOrCtrl+N",
        click: newEntry
      },
      {
        role: "reload"
      },
      {
        type: "separator"
      },
      {
        label: "Settings",
        accelerator: "CmdOrCtrl+,",
        click: settings
      },
      {
        type: "separator"
      },
      {
        label: "Exit",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      {
        role: "undo"
      },
      {
        role: "redo"
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        label: "Chart of top amount Given",
        accelerator: "Alt+C",
        click: openPersonChart
      },
      {
        label: "Show Late People Details",
        accelerator: "CmdOrCtrl+L",
        click: lateMoney
      },
      {
        type: "separator"
      },
      {
        role: "togglefullscreen"
      }
    ]
  },
  {
    role: "Window",
    submenu: [
      {
        role: "minimize"
      }
    ]
  },
  {
    role: "Help",
    submenu: [
      {
        label: "Documentation",
        click() {
          electron.shell.openExternal(
            "https://www.saverl.com/lone/documentation"
          );
        }
      },
      {
        type: "separator"
      },
      {
        label: "View Licence",
        click() {
          electron.shell.openExternal("https://www.saverl.com/lone/licence");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Check for Updates...",
        accelerator: "Alt+U",
        click() {
          autoUpdater.checkForUpdates();
        }
      },
      {
        type: "separator"
      },
      {
        label: "Learn More",
        click() {
          electron.shell.openExternal("https://www.saverl.com/lone/help");
        }
      },
      {
        label: "About",
        click() {
          showAbout();
        }
      }
    ]
  }
];

if (process.platform == "darwin") mainMenuTemplate.unshift({});
