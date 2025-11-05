// src/components/NavBar.jsx
import DarkModeToggle from "./DarkModeToggle";

export default function NavBar() {
  return (
    <header className="w-full border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          QR Gen
        </h1>
        <DarkModeToggle />
      </div>
    </header>
  );
}


