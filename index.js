const { app, BrowserWindow } = require("electron");
const path = require("path");
const { shell } = require("electron");
const config = require("./config.json");

const environment = process.env.NODE_ENV?.toUpperCase?.().trim?.();
const settings = config[environment ?? "PRODUCTION"];

function createWindow() {
	const win = new BrowserWindow({
		width: 1400,
		height: 1000,
		show: false,
		allowRunningInsecureContent: false,
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js")
		}
	});
	win.loadURL(settings.DASHBOARD_URL);
	win.removeMenu();
	win.once("ready-to-show", () => win.show());
	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
	});
	// mainWindow.webContents.on('new-window', (e, url) => {
	//   e.preventDefault();
	//   shell.openExternal(url);
	// });
	settings.OPEN_DEV_PANEL && win.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
