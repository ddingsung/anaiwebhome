"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "홈", href: "#home" },
  { name: "회사소개", href: "#about" },
  { name: "상담문의", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 lg:px-[107px] h-[74px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2"
        >
          <div className={`w-[42px] h-[36px] rounded flex items-center justify-center transition-colors duration-500 ${
            scrolled ? "bg-[#D9D9D9]" : "bg-[#D9D9D9]"
          }`}>
            <span className={`text-[18px] font-semibold transition-colors duration-500 ${
              scrolled ? "text-black" : "text-black"
            }`}>로고</span>
          </div>
          <span className={`text-[25px] font-medium transition-colors duration-500 ${
            scrolled ? "text-[#111]" : "text-white"
          }`}>
            Anai
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-16">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-[18px] transition-colors duration-300 hover:opacity-70 ${
                scrolled ? "text-[#111]" : "text-white"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[#111]" : "bg-white"
              } ${
                mobileOpen && i === 0
                  ? "rotate-45 translate-y-2"
                  : mobileOpen && i === 1
                    ? "opacity-0"
                    : mobileOpen && i === 2
                      ? "-rotate-45 -translate-y-2"
                      : ""
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[18px] text-[#111] py-2 hover:text-brand transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
