// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="w-full mt-10">
      <div className="container mx-auto px-6 py-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} QR Gen by{' '}
          <span className="font-medium bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
            Mamypopo
          </span>
        </p>
      </div>
    </footer>
  );
}


