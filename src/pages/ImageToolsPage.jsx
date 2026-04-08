// src/pages/ImageToolsPage.jsx
import { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";

const FORMATS = ["webp", "jpeg", "png"];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ImageToolsPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState("webp");
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState(null); // { blob, url, size }
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const loadFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setResult(null);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files[0]);
  }, []);

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const mimeMap = { webp: "image/webp", jpeg: "image/jpeg", png: "image/png" };
      const opts = {
        maxSizeMB: 50,
        useWebWorker: true,
        fileType: mimeMap[format],
        initialQuality: quality / 100,
        alwaysKeepResolution: true,
      };
      const compressed = await imageCompression(file, opts);
      const url = URL.createObjectURL(compressed);
      setResult({ blob: compressed, url, size: compressed.size });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const ext = format === "jpeg" ? "jpg" : format;
    const name = (file?.name.replace(/\.[^.]+$/, "") || "image") + "." + ext;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = name;
    a.click();
  };

  const reduction = result && file ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <>
      <header className="w-full py-6 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-cyan-900/10 border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Image Tools
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            บีบอัดและแปลงรูปภาพ — ทำงานในเบราว์เซอร์ ไม่อัปโหลดไปไหน
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">

          {/* Upload */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-lg dark:shadow-2xl">
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">🖼️ เลือกรูปภาพ</p>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-border-light dark:border-border-dark hover:border-emerald-400/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => loadFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📎</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-2">📁</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">วาง หรือ คลิกเลือกรูป</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP, GIF</p>
                </>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-lg dark:shadow-2xl flex flex-col gap-5">

            {/* Format */}
            <div>
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">🔄 แปลงเป็น Format</p>
              <div className="grid grid-cols-3 gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-2.5 rounded-2xl text-sm font-medium transition-all border ${
                      format === f
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400 dark:from-emerald-500/60 dark:to-teal-500/60 text-white border-transparent shadow-sm"
                        : "bg-surface-light dark:bg-surface-dark text-gray-600 dark:text-gray-400 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {format === "webp" && "WebP — เล็กที่สุด รองรับทุกเบราว์เซอร์สมัยใหม่"}
                {format === "jpeg" && "JPEG — เหมาะกับรูปถ่าย บีบอัดได้ดี"}
                {format === "png" && "PNG — คุณภาพสูง รองรับ transparent"}
              </p>
            </div>

            {/* Quality */}
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <span>คุณภาพ</span>
                <span>{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={format === "png"}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-400 [&::-webkit-slider-thumb]:to-teal-400 [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>เล็กสุด</span>
                <span>คุณภาพดีสุด</span>
              </div>
              {format === "png" && (
                <p className="text-xs text-gray-400 mt-1">PNG เป็น lossless ปรับ quality ไม่ได้</p>
              )}
            </div>

            <button
              onClick={process}
              disabled={!file || loading}
              className="w-full py-3 rounded-2xl text-sm font-medium transition-all shadow-md hover:shadow-lg border bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-400/60 dark:to-teal-400/60 hover:from-emerald-400 hover:to-teal-400 dark:hover:from-emerald-500/70 dark:hover:to-teal-500/70 border-emerald-400/50 dark:border-emerald-500/40 text-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ กำลังประมวลผล..." : "⚡ Compress & Convert"}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-lg dark:shadow-2xl">
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">📊 ผลลัพธ์</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background-light dark:bg-background-dark rounded-2xl p-4 text-center border border-border-light dark:border-border-dark">
                  <p className="text-xs text-gray-400 mb-1">ก่อน</p>
                  <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{formatBytes(file.size)}</p>
                  <p className="text-xs text-gray-400">{file.type.split("/")[1].toUpperCase()}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 text-center border border-emerald-200 dark:border-emerald-700/40">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">หลัง</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(result.size)}</p>
                  <p className="text-xs text-emerald-500">{format.toUpperCase()}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">ลดขนาดได้</span>
                  <span className={`font-bold ${reduction > 0 ? "text-emerald-500" : "text-gray-500"}`}>
                    {reduction > 0 ? `-${reduction}%` : "ขนาดใกล้เคียงเดิม"}
                  </span>
                </div>
                {reduction > 0 && (
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
                      style={{ width: `${Math.min(reduction, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Before/After preview */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1 text-center">ก่อน</p>
                  <img src={preview} alt="before" className="w-full rounded-xl object-cover aspect-square" />
                </div>
                <div>
                  <p className="text-xs text-emerald-500 mb-1 text-center">หลัง</p>
                  <img src={result.url} alt="after" className="w-full rounded-xl object-cover aspect-square" />
                </div>
              </div>

              <button
                onClick={download}
                className="w-full py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-400/60 dark:to-teal-400/60 hover:from-emerald-400 hover:to-teal-400 border border-emerald-400/50 text-gray-800 dark:text-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                ⬇️ ดาวน์โหลด {format.toUpperCase()}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
