// src/components/QrPreview.jsx
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QrPreview({ options }) {
  const ref = useRef(null);
  const qrRef = useRef(
    new QRCodeStyling({
      width: 300,
      height: 300,
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

  const downloadQR = async (size) => {
    // คำนวณ padding สำหรับพื้นหลัง (เพิ่ม 10% ของขนาด)
    const padding = Math.round(size * 0.1);
    const canvasSize = size + padding * 2;
    
    // สร้าง QRCodeStyling instance ใหม่สำหรับการดาวน์โหลด (ไม่มี margin เพื่อควบคุมได้เอง)
    const downloadQR = new QRCodeStyling({
      width: size,
      height: size,
      qrOptions: { ...(options?.qrOptions || {}), margin: 0 },
      data: options?.data || "https://example.com",
      dotsOptions: options?.dotsOptions || { color: "#000000", type: "rounded" },
      backgroundOptions: options?.backgroundOptions || { color: "#ffffff" },
      image: options?.image,
    });

    // สร้าง element ชั่วคราวสำหรับ render
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = `${size}px`;
    tempContainer.style.height = `${size}px`;
    document.body.appendChild(tempContainer);

    try {
      // Render QR Code
      downloadQR.append(tempContainer);

      // รอให้ render เสร็จ
      await new Promise((resolve) => setTimeout(resolve, 500));

      // หา canvas element
      const canvas = tempContainer.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas not found");
      }

      // สร้าง canvas ใหม่ที่มีขนาดใหญ่กว่า
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvasSize;
      finalCanvas.height = canvasSize;
      const ctx = finalCanvas.getContext("2d");

      // วาดพื้นหลัง
      const bgColor = options?.backgroundOptions?.color || "#ffffff";
      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }

      // วาด QR Code ไว้กลาง canvas
      ctx.drawImage(canvas, padding, padding, size, size);

      // ดาวน์โหลด
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

      // รอให้ดาวน์โหลดเสร็จแล้วลบ element ชั่วคราว
      setTimeout(() => {
        if (tempContainer.parentNode) {
          document.body.removeChild(tempContainer);
        }
      }, 500);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      if (tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full ">
      <div
        className="rounded-2xl border border-border-light dark:border-border-dark shadow-sm"
        style={
          hasFrame
            ? { backgroundColor, padding: 30 }
            : isTransparent
            ? {
                padding: 32,
                backgroundImage:
                  "linear-gradient(45deg, #9ca3af33 25%, transparent 25%), linear-gradient(-45deg, #9ca3af33 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #9ca3af33 75%), linear-gradient(-45deg, transparent 75%, #9ca3af33 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }
            : { padding: 0 }
        }
      >
        <div ref={ref} className="flex items-center justify-center"></div>
      </div>

      <div className="w-full mt-6">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>⬇️ Export PNG</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[500, 1000, 1500, 2000].map((s) => (
            <button
              key={s}
              onClick={() => downloadQR(s)}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {s}×{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
