// preload.ts
import { contextBridge, ipcRenderer, shell } from 'electron';

contextBridge.exposeInMainWorld('api', {
  convert: (files: string[], format: string, quality: number) =>
    ipcRenderer.invoke('convert-images', { files, format, quality }),

  openFolder: (folderPath: string) => {
    console.log("📂 shell.openPath called with:", folderPath); // ✅ debug log
    return shell.openPath(folderPath);
  },
});
