'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

const hoverScaleVariants = {
  hover: { scale: 1.02, translateY: -4, transition: { duration: 0.2 } },
};

export function PhilosophySection() {
  return (
    <section
      id="philosophy-section"
      className="relative bg-[#121212] text-[#F5F5F7] py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5"
    >
      {/* Decorative Warm Gold Radial Glows */}
      <div className="absolute top-1/4 left-0 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16 lg:mb-24 text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4 block">
            Studio Philosophy
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mb-6 font-sans">
            High-quality tattooing with a friendly, local vibe.
          </h2>
          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mb-8" />
        </div>

        {/* Top Split: Narrative & Imagery with Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 lg:mb-32">
          {/* Narrative Content */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-white/90 leading-relaxed font-light"
            >
              Getting a tattoo should be an exciting, comfortable experience. Whether it is your very first piece or you are adding to a full sleeve, I am here to bring your ideas to life with absolute precision.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-white/70 leading-relaxed font-light"
            >
              Operating out of a private, fully licensed studio in Gilfach Bargoed, I focus on custom designs, clean lines, and solid shading. I do not believe in gatekeeping or elite attitudes. Every design is treated with the same high level of care, respect, and medical-grade hygiene. Let’s collaborate and create something you will be proud to wear forever.
            </motion.p>

            {/* Quick Stats / Trust Badges */}
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </</svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold font-sans tracking-wide">Fully Licensed Studio</h4>
                  <p className="text-sm text-white/60">Registered and inspected by Caerphilly County Borough Council.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </</svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold font-sans tracking-wide">All Styles Welcome</h4>
                  <p className="text-sm text-white/60">Specialized in Black & Grey, Color, Fine Line, and Custom Cover-ups.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </</svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold font-sans tracking-wide">100% Sterile Environment</h4>
                  <p className="text-sm text-white/60">Hospital-grade sanitization and single-use needles for every single session.</p>
                </div>
              </div>
            </motion.div>

            {/* Quick CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#booking-enquiry-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-semibold uppercase tracking-wider rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#121212]"
              >
                Start Your Booking Inquiry
              </a>
              <a
                href="#portfolio-gallery"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-white/40 hover:bg-white/[0.03] text-white font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                View My Work
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Imagery & Floating Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-[#D4AF37]/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80"
                alt="Jake detailing a clean tattoo in the studio"
                className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#121212]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest block mb-1">LOCATED IN</span>
                <span className="text-white font-bold block text-sm tracking-wide">GILFACH BARGOED, WALES</span>
                <span className="text-xs text-white/50 block mt-0.5">Private, hygienic, professional standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Services Highlights */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white font-sans">
              Core Services Highlights
            </h3>
            <p className="text-white/50 text-sm mt-2 font-mono">
              Craftsmanship across every design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <motion.div
              className="group relative bg-[#1c1c1c] border border-white/5 hover:border-[#D4AF37]/40 p-8 rounded-2xl transition-all duration-300"
              variants={hoverScaleVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] mb-6 border border-[#D4AF37]/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 font-sans tracking-wide uppercase">
                Custom Artwork
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Bring your own concept, reference photos, or rough sketches. I will design a unique, custom piece shaped perfectly to your body.
              </p>
            </motion.div>

            {/* Service Card 2 */}
            <motion.div
              className="group relative bg-[#1c1c1c] border border-white/5 hover:border-[#D4AF37]/40 p-8 rounded-2xl transition-all duration-300"
              variants={hoverScaleVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] mb-6 border border-[#D4AF37]/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17m0 0a5 5 0 100 10" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 font-sans tracking-wide uppercase">
                Expert Cover-ups
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Have an old tattoo you no longer love? I specialize in custom cover-ups and reworks that seamlessly hide or transform existing ink (subject to consultation).
              </p>
            </motion.div>

            {/* Service Card 3 */}
            <motion.div
              className="group relative bg-[#1c1c1c] border border-white/5 hover:border-[#D4AF37]/40 p-8 rounded-2xl transition-all duration-300"
              variants={hoverScaleVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] mb-6 border border-[#D4AF37]/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3 font-sans tracking-wide uppercase">
                Studio Flash Designs
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Want something ready to go? Browse my collection of pre-drawn flash designs available to be tattooed as-is.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}