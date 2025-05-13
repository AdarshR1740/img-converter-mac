"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// preload.ts
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    convert: (files, format, quality) => electron_1.ipcRenderer.invoke('convert-images', { files, format, quality }),
    openFolder: (folderPath) => {
        console.log("📂 shell.openPath called with:", folderPath); // ✅ debug log
        return electron_1.shell.openPath(folderPath);
    },
});
//# sourceMappingURL=preload.js.map