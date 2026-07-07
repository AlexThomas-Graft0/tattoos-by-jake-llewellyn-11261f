'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Shield, Sparkles, HeartHandshake, HelpCircle, Check, Award, AlertCircle } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export function ArtistShowcase() {
  const [activeTab, setActiveTab] = useState<'beliefs' | 'safety'>('beliefs');

  const beliefs = [
    {
      id: 'belief-1',
      title: 'No Gatekeeping',
      icon: HeartHandshake,
      description: 'No matter how big, small, simple, or complex your idea is, it deserves to be done right. There are no "silly" tattoo questions here.'
    },
    {
      id: 'belief-2',
      title: 'Honest Advice',
      icon: Sparkles,
      description: 'If a design is too small to age well, or if a placement will warp, I will tell you upfront. I design tattoos that look incredible on day one and stay legible for decades.'
    },
    {
      id: 'belief-3',
      title: 'A Safe, Welcoming Space',
      icon: Shield,
      description: 'Whether you are nervous about your first tattoo or sitting for an all-day session, I keep the vibe friendly, calm, and completely stress-free.'
    }
  ];

  const safetyItems = [
    {
      title: 'Fully Licensed Studio',
      desc: 'Registered and rigorously inspected by Caerphilly County Borough Council.'
    },
    {
      title: '100% Sterile Environment',
      desc: 'Hospital-grade sanitization and single-use needles for every single session.'
    },
    {
      title: 'Skin-Safe Inks Only',
      desc: 'We use only industry-leading, certified skin-safe brands to guarantee vibrant, clean healing.'
    },
    {
      title: 'Safe Disposal Protocols',
      desc: 'All bio-waste and single-use materials are immediately discarded into medical-grade disposal units.'
    }
  ];

  return (
    <section 
      id="artist-showcase" 
      className="relative min-h-screen bg-[#121212] text-[#F5F5F7] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans selection:bg-[#D4AF37] selection:text-[#121212]"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase block mb-3">
            Craftsmanship & Safety
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#F5F5F7] font-sans uppercase">
            Meet Your Artist: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F7] via-[#D4AF37] to-[#F5F5F7]">Jake Llewellyn</span>
          </h2>
          <div className="w-24 h-[3px] bg-[#D4AF37] mx-auto mt-6" />
          <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed">
            Dedicated craftsmanship, sterile safety standards, and a relaxed space where everyone feels at home.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait & Credentials */}
          <motion.div 
            className="lg:col-span-5 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={imageVariants}
          >
            {/* Portrait Wrapper with Gold Border Frame */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-neutral-800 opacity-30 group-hover:opacity-50 transition duration-500 blur" />
              <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#1e1e1e] aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=1200"
                  alt="Jake Llewellyn tattooing a custom piece with absolute precision"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
                
                {/* Floating Studio Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#121212]/95 backdrop-blur-md border border-[#D4AF37]/30 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#D4AF37] tracking-wider uppercase">Registered Studio</p>
                    <p className="text-sm font-semibold text-white">Caerphilly County Council</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Badges Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#1e1e1e]/60 border border-neutral-800 p-4 rounded-xl">
                <p className="text-[#D4AF37] text-2xl font-black font-mono">100%</p>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Sterile</p>
              </div>
              <div className="bg-[#1e1e1e]/60 border border-neutral-800 p-4 rounded-xl">
                <p className="text-[#D4AF37] text-2xl font-black font-mono">CCBC</p>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Licensed</p>
              </div>
              <div className="bg-[#1e1e1e]/60 border border-neutral-800 p-4 rounded-xl">
                <p className="text-[#D4AF37] text-2xl font-black font-mono">All</p>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Styles Welcome</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Core Beliefs / Safety Interactive Tabs */}
          <motion.div 
            className="lg:col-span-7 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            {/* Biography Text */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase font-sans">
                The Story Behind The Needle
              </h3>
              <div className="space-y-4 text-neutral-300 leading-relaxed font-light">
                <p>
                  Hi, I’m Jake. I run a solo, independent tattoo studio here in Gilfach Bargoed. For me, tattooing is more than just putting ink on skin—it is about clean craftsmanship, honest advice, and making sure you walk out of my studio completely thrilled with your new piece.
                </p>
                <p>
                  I started this studio to offer a professional, high-standard alternative to intimidating street shops. When you book a session with me, you get my undivided attention in a relaxed, private setting. I pride myself on being down-to-earth, easy to talk to, and completely transparent about what will look best on your skin long-term.
                </p>
                <p>
                  From deep blackwork and smooth black-and-grey shading to bright color pieces and delicate fine lines, I welcome all tattoo styles. I love working closely with my clients to turn their personal stories and ideas into beautiful, lasting body art.
                </p>
              </div>
            </motion.div>

            {/* Interactive Tab Switcher */}
            <motion.div variants={itemVariants} className="border-t border-neutral-800 pt-8">
              <div className="flex gap-4 border-b border-neutral-800 pb-4 mb-6">
                <button
                  onClick={() => setActiveTab('beliefs')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 uppercase tracking-wider ${
                    activeTab === 'beliefs'
                      ? 'bg-[#D4AF37] text-[#121212] font-bold shadow-lg shadow-[#D4AF37]/20'
                      : 'text-neutral-400 hover:text-white hover:bg-[#1e1e1e]'
                  }`}
                >
                  Core Beliefs
                </button>
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 uppercase tracking-wider ${
                    activeTab === 'safety'
                      ? 'bg-[#D4AF37] text-[#121212] font-bold shadow-lg shadow-[#D4AF37]/20'
                      : 'text-neutral-400 hover:text-white hover:bg-[#1e1e1e]'
                  }`}
                >
                  Safety & Hygiene
                </button>
              </div>

              {/* Tab 1: Core Beliefs */}
              {activeTab === 'beliefs' && (
                <div className="space-y-6">
                  {beliefs.map((belief, i) => {
                    const Icon = belief.icon;
                    return (
                      <div 
                        key={belief.id}
                        className="flex items-start gap-4 p-5 rounded-xl bg-[#1e1e1e]/40 border border-neutral-800 hover:border-[#D4AF37]/30 transition duration-300"
                      >
                        <div className="p-3 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37] shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white uppercase tracking-tight">{belief.title}</h4>
                          <p className="mt-2 text-sm text-neutral-400 leading-relaxed font-light">{belief.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Safety & Hygiene */}
              {activeTab === 'safety' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-neutral-900/40 border border-dashed border-red-500/20 flex gap-4 items-start mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Your Safety is My Top Priority</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        I strictly adhere to the highest standards of sterilization and hygiene. Every needle, tube, and barrier film used during your session is single-use, medical-grade, and safely disposed of immediately afterward.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safetyItems.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#1e1e1e]/60 border border-neutral-800">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <h5 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h5>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* CTA Section */}
            <motion.div variants={itemVariants} className="pt-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1e1e1e] to-[#121212] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight">Let's create something unique.</h4>
                  <p className="text-sm text-neutral-400 font-light mt-1">Ready to bring your ideas to life with professional execution?</p>
                </div>
                <a 
                  href="#booking-enquiry-form" 
                  className="w-full sm:w-auto px-6 py-3 bg-[#D4AF37] text-[#121212] font-bold rounded-xl text-center uppercase tracking-wider hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-[#D4AF37]/10"
                >
                  Work with Jake
                </a>
              </div>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}