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
      <div className="container mx-auto px-4 py-6 flex-1 w-full">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-6 max-w-5xl mx-auto">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark w-full lg:max-w-md shadow-sm">
            <h2 className="text-lg font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
              ตั้งค่า QR Code
            </h2>
            <QrSettings onChange={setOptions} />
          </div>
          
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark w-full lg:max-w-md shadow-sm">
            <h2 className="text-lg font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
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
