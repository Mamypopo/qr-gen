// src/components/QrPreview.jsx
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QrPreview({ options }) {
  const ref = useRef(null);
  const qrRef = useRef(
    new QRCodeStyling({
      width: 250,
      height: 250,
      qrOptions: { margin: 80 },
      ...options,
    })
  );

  useEffect(() => {
    qrRef.current.append(ref.current);
  }, []);

  useEffect(() => {
    qrRef.current.update({
      ...options,
      qrOptions: { ...(options?.qrOptions || {}), margin: 80 },
    });
  }, [options]);

  const backgroundColor = options?.backgroundOptions?.color;
  const hasFrame = backgroundColor && backgroundColor !== "transparent";
  const isTransparent = backgroundColor === "transparent";

  const downloadPNG = async (size) => {
    const padding = Math.round(size * 0.1);
    const canvasSize = size + padding * 2;

    const dlQR = new QRCodeStyling({
      width: size,
      height: size,
      qrOptions: { ...(options?.qrOptions || {}), margin: 0 },
      data: options?.data || "https://example.com",
      dotsOptions: options?.dotsOptions || { color: "#000000", type: "rounded" },
      backgroundOptions: options?.backgroundOptions || { color: "#ffffff" },
      image: options?.image,
    });

    const tempContainer = document.createElement("div");
    tempContainer.style.cssText = "position:absolute;left:-9999px;width:" + size + "px;height:" + size + "px;";
    document.body.appendChild(tempContainer);

    try {
      dlQR.append(tempContainer);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = tempContainer.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvasSize;
      finalCanvas.height = canvasSize;
      const ctx = finalCanvas.getContext("2d");

      const bgColor = options?.backgroundOptions?.color || "#ffffff";
      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }
      ctx.drawImage(canvas, padding, padding, size, size);

      finalCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `qr-${size}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });

      setTimeout(() => {
        if (tempContainer.parentNode) document.body.removeChild(tempContainer);
      }, 500);
    } catch (error) {
      console.error("Error downloading PNG:", error);
      if (tempContainer.parentNode) document.body.removeChild(tempContainer);
    }
  };

  const downloadSVG = () => {
    qrRef.current.download({ name: "qr-code", extension: "svg" });
  };

  return (
    <div className="flex flex-col items-center w-full gap-5">
      {/* QR Preview */}
      <div className="rounded-3xl border-2 border-dashed border-pink-300/60 dark:border-purple-300/60 bg-pink-50/30 dark:bg-purple-900/10 p-6 shadow-lg dark:shadow-2xl">
        <div
          className="rounded-2xl border border-border-light dark:border-border-dark shadow-sm p-6"
          style={
            hasFrame
              ? { backgroundColor }
              : isTransparent
              ? {
                  backgroundImage:
                    "linear-gradient(45deg, #9ca3af33 25%, transparent 25%), linear-gradient(-45deg, #9ca3af33 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #9ca3af33 75%), linear-gradient(-45deg, transparent 75%, #9ca3af33 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                }
              : { backgroundColor: "transparent" }
          }
        >
          <div ref={ref} className="flex items-center justify-center" />
        </div>
      </div>

      {/* Export */}
      <div className="w-full">
        <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">⬇️ ดาวน์โหลด</p>

        {/* PNG presets */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[500, 1000, 2000].map((size) => (
            <button
              key={size}
              onClick={() => downloadPNG(size)}
              className="py-3 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md border bg-gradient-to-r from-green-300 to-emerald-300 dark:from-green-400/60 dark:to-emerald-400/60 hover:from-green-400 hover:to-emerald-400 dark:hover:from-green-500/70 dark:hover:to-emerald-500/70 border-green-400/50 dark:border-green-500/40 text-gray-800 dark:text-gray-100"
            >
              {size}×{size}
            </button>
          ))}
        </div>

        {/* SVG */}
        <button
          onClick={downloadSVG}
          className="w-full py-3 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md border bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-400/50 dark:to-pink-400/50 hover:from-purple-300 hover:to-pink-300 dark:hover:from-purple-500/60 dark:hover:to-pink-500/60 border-purple-300/50 dark:border-purple-500/40 text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2"
        >
          <span>SVG</span>
          <span className="text-xs opacity-60 font-normal">Vector · ขยายไม่แตก</span>
        </button>
      </div>
    </div>
  );
}
