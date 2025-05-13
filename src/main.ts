// main.ts
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import crypto from 'crypto';

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle(
  'convert-images',
  async (
    _event: IpcMainInvokeEvent,
    args: { files: string[]; format: string; quality: number }
  ) => {
    console.log('🧾 Converting', args.files.length, 'file(s)');
    console.log('📂 Files:', args.files);

    const results: { message: string }[] = [];
    let outputDir: string | null = null;

    for (const file of args.files) {
      try {
        const ext = args.format;
        const baseName = path.basename(file, path.extname(file));
        const originalDir = path.dirname(file);
        outputDir = path.join(originalDir, 'converted');

        // ✅ Create the converted folder once, but don’t return early
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir);
        }

        const hash = crypto.createHash('md5').update(file).digest('hex').slice(0, 6);
        const output = path.join(outputDir, `${baseName}_${hash}.${ext}`);

        await sharp(file)
          .toFormat(ext as keyof sharp.FormatEnum, { quality: args.quality })
          .toFile(output)
          .catch((err) => {
            console.error(`🔴 Sharp failed for ${file}:`, err);
            throw err;
          });

        console.log(`✅ Saved: ${output}`);
        results.push({ message: `✅ Saved: ${output}` });
      } catch (err: any) {
        console.error(`❌ Failed to convert ${file}`, err);
        results.push({ message: `❌ Error with ${file}: ${err.message || err}` });
      }
    }

    return { results, outputDir };
  }
);
