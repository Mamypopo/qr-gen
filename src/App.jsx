// src/App.jsx
import { useState } from "react";
import QrPreview from "./components/QrPreview";
import QrSettings from "./components/QrSettings";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function App() {
  const [options, setOptions] = useState({
    data: "https://example.com",
    dotsOptions: { color: "#000", type: "rounded" },
    backgroundOptions: { color: "#fff" },
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <NavBar />
      <header className="w-full py-6 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50 dark:from-pink-900/10 dark:via-purple-900/10 dark:to-blue-900/10 border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              QR Code Generator
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-1">
              สร้าง QR Code สวยงามได้ง่ายๆ ด้วยสไตล์ที่คุณชอบ
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ปรับแต่งสี รูปแบบจุด โลโก้ และพื้นหลังได้ตามใจ
            </p>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-6 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-6 max-w-5xl mx-auto">
          <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl border border-border-light dark:border-border-dark w-full lg:max-w-md shadow-lg dark:shadow-2xl">
            <h2 className="text-xl font-semibold mb-8 text-center text-gray-900 dark:text-gray-100">
              ตั้งค่า QR Code
            </h2>
            <QrSettings onChange={setOptions} />
          </div>
          
          <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl border border-border-light dark:border-border-dark w-full lg:max-w-md shadow-lg dark:shadow-2xl">
            <h2 className="text-xl font-semibold mb-8 text-center text-gray-900 dark:text-gray-100">
              ตัวอย่าง
            </h2>
            <QrPreview options={options} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
