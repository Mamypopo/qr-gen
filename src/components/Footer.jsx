// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="w-full mt-10 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="container mx-auto px-4 py-6 text-base text-gray-600 dark:text-gray-400 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} QR Gen by </span>
        <span className="opacity-80">Mamypopo</span>
        </div>
      </div>
    </footer>
  );
}


