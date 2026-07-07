'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';

export function HeroSection() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const now = new Date();
      // Format to get UK abbreviated day (e.g., "Mon", "Tue") and hour (24-hour)
      const ukDayStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        weekday: 'short',
      }).format(now);

      const ukHourStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: 'numeric',
        hour12: false,
      }).format(now);

      const ukHour = parseInt(ukHourStr, 10);
      const openDays = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const isWorkingDay = openDays.includes(ukDayStr);
      const isWorkingHour = ukHour >= 10 && ukHour < 18;

      setIsOpen(isWorkingDay && isWorkingHour);
    } catch (e) {
      // Fallback in case Intl is not fully supported or throws
      setIsOpen(true);
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 16,
      },
    },
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex flex-col justify-between bg-[#121212] text-[#F5F5F7] overflow-hidden font-sans selection:bg-[#D4AF37] selection:text-[#121212]"
    >
      {/* Background Image with Deep Overlay Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590246814883-57f5114cb681?auto=format&fit=crop&q=80&w=2000"
          alt="Jake Llewellyn tattooing complex fine lines on a client in a clean, sterile studio environment"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform motion-safe:animate-[pulse_8s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      </div>

      {/* Decorative Top Grid Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent z-10" />

      {/* Hero Header Area */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#F5F5F7]/10">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="font-['Oswald'] tracking-[0.25em] text-xl font-bold text-[#F5F5F7] uppercase">
            JAKE LLEWELLYN
          </span>
          <span className="font-['JetBrains_Mono'] text-xs tracking-wider text-[#D4AF37] uppercase">
            Gilfach Bargoed • Est. 2024
          </span>
        </div>

        {/* Dynamic Studio Status Badge */}
        <div className="flex items-center">
          {isOpen === null ? (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#F5F5F7]/70">
                Checking studio availability...
              </span>
            </div>
          ) : isOpen ? (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/30 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
              </span>
              <span className="font-['JetBrains_Mono'] text-xs font-medium text-[#16A34A] flex items-center gap-1">
                <span>OPEN:</span>
                <span className="text-[#F5F5F7] font-normal">We are open right now! Stop by or send us an inquiry.</span>
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
              <span className="font-['JetBrains_Mono'] text-xs font-medium text-neutral-400 flex flex-wrap items-center gap-1">
                <span>CLOSED:</span>
                <span className="text-[#F5F5F7]/80 font-normal">Send an inquiry & Jake will respond during studio hours.</span>
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-24 flex-grow flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-8"
        >
          {/* Tagline / Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
            <span className="font-['JetBrains_Mono'] text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              Professional Custom Tattoo Artist
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-['Oswald'] text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-none text-[#F5F5F7]"
          >
            Your vision, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F7] via-[#D4AF37] to-[#F5F5F7]">
              expertly inked
            </span> <br />
            in Gilfach Bargoed.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-[#F5F5F7]/80 font-light leading-relaxed max-w-2xl"
          >
            Professional, custom tattooing in a clean, welcoming local studio. All styles welcome—from bold blackwork to delicate fine line.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <a
              href="#booking-enquiry-form"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#121212] font-semibold tracking-wide rounded-sm transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#121212] min-h-[44px]"
            >
              Start Your Booking Inquiry
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <a
              href="#portfolio-gallery"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/5 text-[#F5F5F7] font-semibold tracking-wide border border-white/20 hover:border-white/40 rounded-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[44px]"
            >
              View My Work
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Trust Badges / Quick Stats Footer */}
      <footer className="relative z-10 w-full bg-black/60 border-t border-[#F5F5F7]/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Badge 1 */}
            <div className="flex items-start gap-4 pb-6 md:pb-0 md:px-4 first:pl-0">
              <div className="p-3 bg-[#D4AF37]/10 rounded-sm text-[#D4AF37] shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-['Oswald'] text-lg uppercase tracking-wide text-[#F5F5F7]">
                  Fully Licensed Studio
                </h3>
                <p className="text-sm text-[#F5F5F7]/60 mt-1">
                  Registered and inspected by Caerphilly County Borough Council.
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-start gap-4 pt-6 pb-6 md:pt-0 md:pb-0 md:px-6">
              <div className="p-3 bg-[#D4AF37]/10 rounded-sm text-[#D4AF37] shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 21l8.954-8.955m-10.14 2.522L15 3l-1 5.096h6.813l-1.182 1.182"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-['Oswald'] text-lg uppercase tracking-wide text-[#F5F5F7]">
                  All Styles Welcome
                </h3>
                <p className="text-sm text-[#F5F5F7]/60 mt-1">
                  Specialized in Black & Grey, Color, Fine Line, and Custom Cover-ups.
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-start gap-4 pt-6 md:pt-0 md:pl-6 last:pr-0">
              <div className="p-3 bg-[#D4AF37]/10 rounded-sm text-[#D4AF37] shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-['Oswald'] text-lg uppercase tracking-wide text-[#F5F5F7]">
                  100% Sterile Environment
                </h3>
                <p className="text-sm text-[#F5F5F7]/60 mt-1">
                  Hospital-grade sanitization and single-use needles for every session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}