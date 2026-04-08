// src/components/NavBar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import DonationModal from "./DonationModal";

const NAV_LINKS = [
  { to: "/", label: "📱 QR Gen" },
  { to: "/password", label: "🔐 Password" },
  { to: "/image", label: "🖼️ Image" },
  { to: "/pdf", label: "📄 PDF" },
];

function HamburgerIcon({ open }) {
  return (
    <div className="flex flex-col justify-center items-center w-5 h-5 gap-1.5">
      <span className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
      <span className={`block h-px w-5 bg-current transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
      <span className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </div>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [donation, setDonation] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div className="border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <NavLink to="/" className="font-bold text-base bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent flex-shrink-0">
            Popo
          </NavLink>

          {/* Desktop nav — hidden บน mobile */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/8"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setDonation(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-300 hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-500/30 dark:hover:to-purple-500/30 border border-pink-200 dark:border-pink-500/30 transition-all"
            >
              ☕ Donate
            </button>
            <DarkModeToggle />
            {/* Hamburger — แสดงแค่บน mobile */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={open} />
            </button>
          </div>

        </div>
      </div>

      {/* Donation modal */}
      {donation && <DonationModal onClose={() => setDonation(false)} />}

      {/* Mobile dropdown */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-64" : "max-h-0"}`}>
        <nav className="bg-white/95 dark:bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-4 py-2 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500/60 dark:to-purple-500/60 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/8"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { setOpen(false); setDonation(true); }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-left text-pink-600 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all"
          >
            ☕ Donate
          </button>
        </nav>
      </div>
    </header>
  );
}
