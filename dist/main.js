"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = __importDefault(require("crypto"));
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
        },
    });
    win.loadFile(path_1.default.join(__dirname, 'index.html'));
}
electron_1.app.whenReady().then(createWindow);
electron_1.ipcMain.handle('convert-images', async (_event, args) => {
    console.log('🧾 Converting', args.files.length, 'file(s)');
    console.log('📂 Files:', args.files);
    const results = [];
    let outputDir = null;
    for (const file of args.files) {
        try {
            const ext = args.format;
            const baseName = path_1.default.basename(file, path_1.default.extname(file));
            const originalDir = path_1.default.dirname(file);
            outputDir = path_1.default.join(originalDir, 'converted');
            // ✅ Create the converted folder once, but don’t return early
            if (!fs_1.default.existsSync(outputDir)) {
                fs_1.default.mkdirSync(outputDir);
            }
            const hash = crypto_1.default.createHash('md5').update(file).digest('hex').slice(0, 6);
            const output = path_1.default.join(outputDir, `${baseName}_${hash}.${ext}`);
            await (0, sharp_1.default)(file)
                .toFormat(ext, { quality: args.quality })
                .toFile(output)
                .catch((err) => {
                console.error(`🔴 Sharp failed for ${file}:`, err);
                throw err;
            });
            console.log(`✅ Saved: ${output}`);
            results.push({ message: `✅ Saved: ${output}` });
        }
        catch (err) {
            console.error(`❌ Failed to convert ${file}`, err);
            results.push({ message: `❌ Error with ${file}: ${err.message || err}` });
        }
    }
    return { results, outputDir };
});
//# sourceMappingURL=main.js.map