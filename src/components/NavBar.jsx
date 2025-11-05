// src/components/NavBar.jsx
import DarkModeToggle from "./DarkModeToggle";

export default function NavBar() {
  return (
    <header className="w-full border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
        
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
            QR Gen
          </h1>
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
}


