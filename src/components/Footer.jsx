// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="w-full mt-10 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
        <span>© {new Date().getFullYear()} QR Gen</span>
        <span className="opacity-80">Built with React + Tailwind</span>
      </div>
    </footer>
  );
}


