// src/components/DarkModeToggle.jsx
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    // sync state กับ DOM ตอน mount (กัน hydration ต่างกัน)
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const onChange = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <label className="inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        className="sr-only"
        checked={darkMode}
        onChange={(e) => onChange(e.target.checked)}
        aria-label="Toggle dark mode"
      />
      <span className="mr-2 text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
        {darkMode ? "Dark" : "Light"}
      </span>
      <span className="relative w-12 h-7 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-300/30 dark:to-purple-300/30 rounded-full transition-all shadow-inner">
        {/* sun icon */}
        <span className="absolute left-1 top-1 w-5 h-5 flex items-center justify-center text-yellow-400 opacity-100 transition-opacity">
          ☀️
        </span>
        {/* moon icon */}
        <span className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center text-indigo-400 opacity-100 transition-opacity">
          🌙
        </span>
        {/* knob */}
        <span
          className={`absolute top-0.5 h-6 w-6 bg-white rounded-full border-2 border-pink-300/50 dark:border-purple-300/50 shadow-lg transform transition-transform duration-300 ease-in-out ${
            darkMode ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </label>
  );
}
