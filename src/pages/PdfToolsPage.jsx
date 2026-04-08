// src/pages/PdfToolsPage.jsx
import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// ─── Image → PDF ────────────────────────────────────────────
function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState("a4");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (newFiles) => {
    const imgs = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
  };

  const remove = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));
  const moveUp = (i) => {
    if (i === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  };
  const moveDown = (i) => {
    setFiles((prev) => { if (i >= prev.length - 1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
  };

  const generate = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const pdf = await PDFDocument.create();
      const sizes = { a4: [595, 842], letter: [612, 792] };
      const [pw, ph] = sizes[pageSize] || sizes.a4;

      for (const file of files) {
        const buf = await file.arrayBuffer();
        let img;
        if (file.type === "image/png") img = await pdf.embedPng(buf);
        else img = await pdf.embedJpg(buf);

        const page = pdf.addPage([pw, ph]);
        const { width: iw, height: ih } = img;
        const scale = Math.min(pw / iw, ph / ih);
        const w = iw * scale;
        const h = ih * scale;
        page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400/60 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all"
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <div className="text-3xl mb-2">📸</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">คลิกหรือวางรูปภาพ (เลือกหลายไฟล์ได้)</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG — ลากเรียงลำดับได้</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-background-light dark:bg-background-dark rounded-2xl px-4 py-2.5 border border-border-light dark:border-border-dark">
              <span className="text-lg">🖼️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveUp(i)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1 text-xs">↑</button>
                <button onClick={() => moveDown(i)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1 text-xs">↓</button>
                <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 px-1 text-sm ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page size */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ขนาดหน้า</p>
        <div className="grid grid-cols-2 gap-2">
          {["a4", "letter"].map((s) => (
            <button
              key={s}
              onClick={() => setPageSize(s)}
              className={`py-2.5 rounded-2xl text-sm font-medium transition-all border ${
                pageSize === s
                  ? "bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-400/60 dark:to-amber-400/60 text-gray-800 border-transparent shadow-sm"
                  : "bg-surface-light dark:bg-surface-dark text-gray-600 dark:text-gray-400 border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!files.length || loading}
        className="w-full py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-400/60 dark:to-amber-400/60 hover:from-orange-400 hover:to-amber-400 border border-orange-400/50 text-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
      >
        {loading ? "⏳ กำลังสร้าง..." : `⚡ สร้าง PDF (${files.length} หน้า)`}
      </button>
    </div>
  );
}

// ─── PDF Merge ───────────────────────────────────────────────
function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = (newFiles) => {
    const pdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...pdfs]);
  };
  const remove = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));
  const moveUp = (i) => {
    if (i === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  };
  const moveDown = (i) => {
    setFiles((prev) => { if (i >= prev.length - 1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
  };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400/60 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all"
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <div className="text-3xl mb-2">📄</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">คลิกหรือวางไฟล์ PDF (เลือกหลายไฟล์)</p>
        <p className="text-xs text-gray-400 mt-1">ลากเพื่อเรียงลำดับก่อน Merge</p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-background-light dark:bg-background-dark rounded-2xl px-4 py-2.5 border border-border-light dark:border-border-dark">
              <span className="text-lg">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveUp(i)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1 text-xs">↑</button>
                <button onClick={() => moveDown(i)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1 text-xs">↓</button>
                <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 px-1 text-sm ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={merge}
        disabled={files.length < 2 || loading}
        className="w-full py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-400/60 dark:to-amber-400/60 hover:from-orange-400 hover:to-amber-400 border border-orange-400/50 text-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
      >
        {loading ? "⏳ กำลัง Merge..." : `🔗 Merge ${files.length} ไฟล์`}
      </button>
    </div>
  );
}

// ─── PDF Split ───────────────────────────────────────────────
function PdfSplit() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const loadFile = async (f) => {
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    setRange("");
    try {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      setPageCount(doc.getPageCount());
    } catch (e) {
      console.error(e);
    }
  };

  // แปลง range string "1-3, 5, 7-9" → array of 0-indexed page numbers
  const parseRange = (str, total) => {
    const pages = new Set();
    str.split(",").forEach((part) => {
      const p = part.trim();
      if (p.includes("-")) {
        const [s, e] = p.split("-").map(Number);
        for (let i = s; i <= Math.min(e, total); i++) pages.add(i - 1);
      } else {
        const n = Number(p);
        if (n >= 1 && n <= total) pages.add(n - 1);
      }
    });
    return [...pages].sort((a, b) => a - b);
  };

  const split = async () => {
    if (!file || !range.trim()) return;
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf);
      const indices = parseRange(range, pageCount);
      if (!indices.length) return;

      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach((p) => newDoc.addPage(p));

      const bytes = await newDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split-${range.replace(/\s/g, "")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); }}
        className="border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl p-8 text-center cursor-pointer hover:border-orange-400/60 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all"
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
        {file ? (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">📄 {file.name}</p>
            <p className="text-xs text-gray-400 mt-1">{pageCount} หน้า · {formatBytes(file.size)}</p>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">คลิกหรือวางไฟล์ PDF</p>
          </>
        )}
      </div>

      {file && (
        <>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              เลือกหน้า <span className="text-gray-400 font-normal">(เช่น 1-3, 5, 7-9)</span>
            </label>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder={`1-${pageCount}`}
              className="w-full p-3 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300/50 transition-all"
            />
            {range && (
              <p className="text-xs text-gray-400 mt-1">
                จะได้ {parseRange(range, pageCount).length} หน้า จากทั้งหมด {pageCount} หน้า
              </p>
            )}
          </div>

          <button
            onClick={split}
            disabled={!range.trim() || loading}
            className="w-full py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-400/60 dark:to-amber-400/60 hover:from-orange-400 hover:to-amber-400 border border-orange-400/50 text-gray-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
          >
            {loading ? "⏳ กำลัง Split..." : "✂️ Split PDF"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
const TABS = [
  { id: "img2pdf", label: "🖼️ → PDF" },
  { id: "merge", label: "🔗 Merge" },
  { id: "split", label: "✂️ Split" },
];

export default function PdfToolsPage() {
  const [tab, setTab] = useState("img2pdf");

  return (
    <>
      <header className="w-full py-6 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-yellow-900/10 border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
            PDF Tools
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            แปลงรูป รวมไฟล์ และแยกหน้า — ทำงานในเบราว์เซอร์ ไม่อัปโหลดไปไหน
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="max-w-lg mx-auto flex flex-col gap-5">

          {/* Tabs */}
          <div className="flex gap-2 bg-surface-light dark:bg-surface-dark p-1.5 rounded-2xl border border-border-light dark:border-border-dark">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === id
                    ? "bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-400/60 dark:to-amber-400/60 text-gray-800 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-lg dark:shadow-2xl">
            {tab === "img2pdf" && <ImageToPdf />}
            {tab === "merge" && <PdfMerge />}
            {tab === "split" && <PdfSplit />}
          </div>

        </div>
      </div>
    </>
  );
}
