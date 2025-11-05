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
      <span className="relative w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors shadow-inner">
        {/* sun icon */}
        <span className="absolute left-1 top-1 w-5 h-5 flex items-center justify-center text-yellow-500 opacity-100 transition-opacity">
          ☀️
        </span>
        {/* moon icon */}
        <span className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center text-indigo-300 opacity-100 transition-opacity">
          🌙
        </span>
        {/* knob */}
        <span
          className={`absolute top-0.5 h-6 w-6 bg-white dark:bg-surface-dark rounded-full border border-border-light dark:border-border-dark shadow transform transition-transform duration-200 ease-in-out ${
            darkMode ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </label>
  );
}
