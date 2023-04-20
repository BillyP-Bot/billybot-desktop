import "dotenv/config";

import { app, BrowserWindow, shell } from "electron";
import * as path from "path";

import { Config } from "./config";

const env = process.env.NODE_ENV?.toUpperCase?.().trim?.();
const { DASHBOARD_URL, OPEN_DEV_PANEL } = env === "DEVELOPMENT" ? Config.LOCAL : Config.PRODUCTION;

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1400,
		height: 1000,
		show: false,
		webPreferences: {
			devTools: OPEN_DEV_PANEL,
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js")
		}
	});

	mainWindow.loadURL(DASHBOARD_URL);
	mainWindow.removeMenu();
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});
	// @ts-ignore
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
	});
};

app.whenReady().then(() => {
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
