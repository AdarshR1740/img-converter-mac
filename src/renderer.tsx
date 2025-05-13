import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

declare global {
  interface Window {
    api: {
      convert: (
        files: string[],
        format: string,
        quality: number
      ) => Promise<{
        results: { message: string }[];
        outputDir: string;
      }>;
    };
  }
}

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [format, setFormat] = useState<string>('webp');
  const [quality, setQuality] = useState<number>(100);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      setFiles(Array.from(selected));
      setMessages([]);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    const paths = files.map((f: any) => f.path as string);
    const result = await window.api.convert(paths, format, quality);
    setMessages(result.results.map((r) => r.message));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🖼️ Image Converter</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Format:&nbsp;</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="webp">webp</option>
          <option value="png">png</option>
          <option value="jpeg">jpeg</option>
          <option value="avif">avif</option>
          <option value="jpg">jpg</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Quality (%):&nbsp;</label>
        <input
          type="number"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          min={1}
          max={100}
        />
      </div>

      <input type="file" multiple onChange={handleFileSelect} />

      {files.length > 0 && (
        <div style={{ marginTop: 10 }}>
          Selected: {files.length} file(s)
          <br />
          <button style={{ marginTop: 10 }} onClick={handleConvert}>
            🚀 Convert Images
          </button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
