// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import QrPage from "./pages/QrPage";
import PasswordPage from "./pages/PasswordPage";
import ImageToolsPage from "./pages/ImageToolsPage";
import PdfToolsPage from "./pages/PdfToolsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<QrPage />} />
            <Route path="/password" element={<PasswordPage />} />
            <Route path="/image" element={<ImageToolsPage />} />
            <Route path="/pdf" element={<PdfToolsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
