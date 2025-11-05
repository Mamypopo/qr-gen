// src/components/QrPreview.jsx
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function QrPreview({ options }) {
  const ref = useRef(null);
  const qrRef = useRef(
    new QRCodeStyling({
      width: 300,
      height: 300,
      qrOptions: { margin: 24 },
      ...options,
    })
  );

  useEffect(() => {
    qrRef.current.append(ref.current);
  }, []);

  useEffect(() => {
    qrRef.current.update({
      ...options,
      qrOptions: { ...(options?.qrOptions || {}), margin: 24 },
    });
  }, [options]);

  const backgroundColor = options?.backgroundOptions?.color;
  const hasFrame = backgroundColor && backgroundColor !== "transparent";

  const downloadQR = (size) => {
    qrRef.current.update({ width: size, height: size });
    qrRef.current.download({ name: `qr-${size}`, extension: "png" });
    qrRef.current.update({ width: 300, height: 300 }); // กลับขนาด preview
  };

  return (
    <div className="flex flex-col items-center w-full ">
      <div
        className="rounded-2xl border border-border-light dark:border-border-dark shadow-sm"
        style={hasFrame ? { backgroundColor, padding: 20 } : { padding: 0 }}
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
