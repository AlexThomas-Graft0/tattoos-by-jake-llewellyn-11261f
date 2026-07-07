'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [studioOpen, setStudioOpen] = useState<boolean | null>(null);

  // Detect scroll to style navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine UK studio open/closed status without SSR mismatch
  useEffect(() => {
    const checkStatus = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Europe/London',
          hour: 'numeric',
          weekday: 'long',
          hour12: false,
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        // Safely call Date constructor inside useEffect (not in render)
        const dateObj = new Date();
        const parts = formatter.formatToParts(dateObj);

        const weekdayPart = parts.find((p) => p.type === 'weekday');
        const hourPart = parts.find((p) => p.type === 'hour');

        if (weekdayPart && hourPart) {
          const day = weekdayPart.value;
          const hour = parseInt(hourPart.value, 10);

          const isOpenDay = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day);
          const isOpenHour = hour >= 10 && hour < 18;

          setStudioOpen(isOpenDay && isOpenHour);
        } else {
          setStudioOpen(false);
        }
      } catch (e) {
        setStudioOpen(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'About', href: '#philosophy-section' },
    { name: 'Artist', href: '#artist-showcase' },
    { name: 'Portfolio', href: '#portfolio-gallery' },
    { name: 'Policies', href: '#studio-policies' },
    { name: 'Aftercare', href: '#aftercare-guide' },
    { name: 'FAQ & Contact', href: '#contact-and-faq' },
  ];

  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full">
      {/* Dynamic Studio Status Banner */}
      <div className="w-full bg-black border-b border-zinc-800/60 text-xs py-2 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {studioOpen === null ? (
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-600 animate-pulse" />
            ) : studioOpen ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono tracking-wider text-[10px] font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inline-flex" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                OPEN NOW
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-zinc-400 font-mono tracking-wider text-[10px] font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
                CLOSED
              </span>
            )}
            <span className="text-zinc-400 font-sans tracking-wide">
              {studioOpen === null
                ? 'Checking studio availability...'
                : studioOpen
                ? '🟢 We are open right now! Stop by or send us an inquiry.'
                : '⚪ We are currently closed. You can still submit your inquiry below.'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-zinc-400 font-mono text-[11px] tracking-widest">
            <span>TUE - SAT: 10AM - 6PM</span>
            <span className="text-zinc-600">|</span>
            <span>GILFACH BARGOED</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-zinc-950/95 backdrop-blur-md border-zinc-800/80 py-3 shadow-xl'
            : 'bg-zinc-950/80 backdrop-blur-sm border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand Area */}
          <a
            href="#hero-section"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black rounded-lg p-1"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37]/50 group-hover:border-[#D4AF37] transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Jake Llewellyn tattooing"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-lg font-black tracking-widest text-zinc-100 uppercase leading-none group-hover:text-[#D4AF37] transition-colors duration-300">
                J. LLEWELLYN
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 uppercase leading-normal">
                Tattoo Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative font-mono text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-colors duration-200 py-2 group focus:outline-none focus:text-[#D4AF37]"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#booking-enquiry-form"
              className="relative inline-flex items-center justify-center px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-black bg-[#D4AF37] hover:bg-white hover:text-black transition-all duration-300 font-bold rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] focus:ring-offset-black"
            >
              Book Consultation
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-none text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <motion.div
        id="mobile-menu"
        className="lg:hidden w-full bg-zinc-950 border-b border-zinc-800 overflow-hidden"
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={menuVariants}
      >
        <div className="px-4 pt-3 pb-6 space-y-3 flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 font-mono text-sm uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-zinc-900 border-l-2 border-transparent hover:border-[#D4AF37] transition-all duration-150"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 px-3">
            <a
              href="#booking-enquiry-form"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-3 font-mono text-xs uppercase tracking-widest text-black bg-[#D4AF37] hover:bg-white transition-all duration-200 font-bold"
            >
              Start Booking Inquiry
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  );
}