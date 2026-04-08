// src/components/DonationModal.jsx
import { useEffect } from "react";

export default function DonationModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl shadow-2xl p-6 w-full max-w-lg flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-lg"
        >
          ✕
        </button>

        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
        รวมสมทบทุน มาม่าซองสุดท้าย 🍜🥺
        </p>

        <img
          src="/image/donate.png"
          alt="donation"
          className="w-full rounded-2xl border border-border-light dark:border-border-dark"
        />

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
          นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ 🙏<br />
          ขอให้ผู้ใจบุญทุกท่านร่ำรวย มีความสุข สมหวังทุกประการ
        </p>

        <a
          href="https://www.youtube.com/watch?v=WddbhA1M1qE"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-2xl text-sm font-medium text-center bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-700 dark:text-pink-300 hover:from-pink-300 hover:to-purple-300 dark:hover:from-pink-500/30 dark:hover:to-purple-500/30 border border-pink-200 dark:border-pink-500/30 transition-all"
        >
          🎵 ฟังบทสวดมนต์
        </a>
      </div>
    </div>
  );
}
